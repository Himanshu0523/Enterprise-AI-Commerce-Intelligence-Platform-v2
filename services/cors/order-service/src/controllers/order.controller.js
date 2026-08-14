const Order = require('../models/Order');
const { chaosFetch } = require('../../../packages/shared-utils/chaos');
const { Tracer } = require('../../../packages/shared-utils/tracing');

const tracer = new Tracer('order-service');

/**
 * In-memory idempotency store.
 * Production: use Redis with TTL (e.g., SET idem:{key} {orderId} EX 86400 NX)
 * Key = X-Idempotency-Key header value
 * Value = { orderId, status, response, createdAt }
 */
const _idempotencyStore = new Map();
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function cleanExpiredKeys() {
  const now = Date.now();
  for (const [key, entry] of _idempotencyStore) {
    if (now - entry.createdAt > IDEMPOTENCY_TTL_MS) {
      _idempotencyStore.delete(key);
    }
  }
}

// Purge stale keys every 10 minutes
setInterval(cleanExpiredKeys, 10 * 60 * 1000);


/**
 * Saga Orchestrator for Order Checkout Flow (Instrumented with Tracing)
 */
exports.createOrder = async (req, res) => {
  const rootSpan = tracer.startSpan('POST /api/orders', { traceparent: req.headers['traceparent'] });
  
  try {
    const idempotencyKey = req.headers['x-idempotency-key'];
    if (!idempotencyKey) {
      rootSpan.setStatus('ERROR', 'Missing Idempotency Key');
      rootSpan.end();
      return res.status(400).json({
        success: false,
        error: { code: 'VAL_001', message: 'X-Idempotency-Key header is required for order creation' },
      });
    }

    // Check idempotency cache
    const existingEntry = _idempotencyStore.get(idempotencyKey);
    if (existingEntry) {
      console.log(`[ORDER] Idempotency hit: returning cached order for key=${idempotencyKey}`);
      rootSpan.setAttribute('idempotency.hit', true);
      rootSpan.setStatus('OK');
      rootSpan.end();
      return res.status(200).json({
        success: true,
        idempotencyHit: true,
        data: existingEntry.response,
      });
    }

    const { items, shippingAddress, paymentMethod, subtotal, tax = 0, shippingFee = 0, discount = 0 } = req.body;
    if (!items || items.length === 0 || !shippingAddress || !paymentMethod || subtotal === undefined) {
      rootSpan.setStatus('ERROR', 'Validation Failed');
      rootSpan.end();
      return res.status(400).json({ success: false, error: { code: 'VAL_001', message: 'Missing required order fields' } });
    }

    const totalAmount = subtotal + tax + shippingFee - discount;
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);

    let order;
    
    // ── STEP 1: Persist Local Order (Traced) ─────────────────────────────────
    const dbSpan = tracer.startSpan('mongodb.create_order', { parent: rootSpan });
    try {
      order = await Order.create({
        userId: req.user ? req.user.id : 'guest',
        orderNumber,
        idempotencyKey,
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        tax,
        shippingFee,
        discount,
        totalAmount,
        sagaState: 'STOCK_RESERVING',
        orderStatus: 'PENDING',
        paymentStatus: 'PENDING',
        reconciliationTasks: [],
      });
      dbSpan.setStatus('OK');
    } catch (error) {
      dbSpan.setStatus('ERROR', error.message);
      dbSpan.end();
      if (error.code === 11000) {
        console.log(`[ORDER] Duplicate key hit (11000) on idempotencyKey: returning existing order`);
        const existingOrder = await Order.findOne({ idempotencyKey });
        if (existingOrder) {
          rootSpan.setAttribute('idempotency.hit', true);
          rootSpan.setStatus('OK');
          rootSpan.end();
          return res.status(200).json({ success: true, idempotencyHit: true, data: existingOrder });
        }
      }
      rootSpan.setStatus('ERROR', error.message);
      rootSpan.end();
      return res.status(500).json({ success: false, error: { code: 'SYS_500', message: error.message } });
    } finally {
      dbSpan.end();
    }

    // ── Execute Saga Steps ────────────────────────────────────────────────────
    let stockReserved = false;
    let paymentCharged = false;

    try {
      // ── STEP 2: Reserve Stock (Traced) ───────────────────────────
      const invSpan = tracer.startSpan('inventory.reserve_stock', { parent: rootSpan });
      invSpan.setAttribute('items.count', items.length);
      try {
        for (const item of items) {
          const invRes = await chaosFetch('http://localhost:3004/api/inventory/reserve', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'traceparent': rootSpan.traceparent
            },
            body: JSON.stringify({ sku: item.productId, quantity: item.quantity }),
          });

          if (!invRes.ok) {
            const errData = await invRes.json().catch(() => ({}));
            throw new Error(`Stock reservation failed: ${errData.error?.message || invRes.statusText}`);
          }
        }
        invSpan.setStatus('OK');
      } catch (err) {
        invSpan.setStatus('ERROR', err.message);
        throw err;
      } finally {
        invSpan.end();
      }

      stockReserved = true;
      order.sagaState = 'STOCK_RESERVED';
      await order.save();

      // ── STEP 3: Charge Payment (Traced) ─────────────────────────────
      order.sagaState = 'PAYING';
      await order.save();

      const paySpan = tracer.startSpan('payment.charge_card', { parent: rootSpan });
      paySpan.setAttribute('payment.amount', totalAmount);
      try {
        const payRes = await chaosFetch('http://localhost:3007/api/payments/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': req.user ? req.user.id : 'guest',
            'traceparent': rootSpan.traceparent
          },
          body: JSON.stringify({
            orderId: order._id.toString(),
            amount: totalAmount,
            currency: 'USD',
          }),
        });

        if (!payRes.ok) {
          const errData = await payRes.json().catch(() => ({}));
          throw new Error(`Payment failed: ${errData.error?.message || payRes.statusText}`);
        }
        paySpan.setStatus('OK');
      } catch (err) {
        paySpan.setStatus('ERROR', err.message);
        throw err;
      } finally {
        paySpan.end();
      }

      paymentCharged = true;
      order.sagaState = 'COMPLETED';
      order.orderStatus = 'PROCESSING';
      order.paymentStatus = 'PAID';
      await order.save();

      // Cache response
      _idempotencyStore.set(idempotencyKey, {
        orderId: order._id.toString(),
        status: order.orderStatus,
        response: order,
        createdAt: Date.now(),
      });

      rootSpan.setStatus('OK');
      rootSpan.end();
      return res.status(201).json({ success: true, data: order });

    } catch (sagaError) {
      console.error(`[SAGA ERROR] Order ${orderNumber} failed: ${sagaError.message}`);

      // Trigger Compensating Transactions
      order.orderStatus = 'CANCELLED';
      order.sagaState = 'COMPENSATING';
      
      const pendingTasks = [];
      if (stockReserved) pendingTasks.push('RESTOCK');
      order.reconciliationTasks = pendingTasks;
      await order.save();

      // ── Apply Immediate compensations (best-effort) ─────────────────────────
      if (stockReserved) {
        const compSpan = tracer.startSpan('saga.compensate_restock', { parent: rootSpan });
        try {
          console.log(`[SAGA COMPENSATE] Restocking items for order ${orderNumber}`);
          for (const item of items) {
            await chaosFetch('http://localhost:3004/api/inventory/release', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'traceparent': rootSpan.traceparent
              },
              body: JSON.stringify({ sku: item.productId, quantity: item.quantity }),
            });
          }
          // Success: remove task
          order.reconciliationTasks = order.reconciliationTasks.filter(t => t !== 'RESTOCK');
          order.sagaState = 'COMPENSATED';
          await order.save();
          compSpan.setStatus('OK');
        } catch (compensateError) {
          compSpan.setStatus('ERROR', compensateError.message);
          console.error(`[SAGA COMPENSATE] Restock failed during compensation: ${compensateError.message}`);
        } finally {
          compSpan.end();
        }
      }

      rootSpan.setStatus('ERROR', sagaError.message);
      rootSpan.end();
      return res.status(400).json({
        success: false,
        error: {
          code: 'SAGA_FAILED',
          message: `Order checkout failed. Rollback initiated. Error: ${sagaError.message}`,
          reconciliationTasks: order.reconciliationTasks,
        },
      });
    }
  } catch (outerError) {
    rootSpan.setStatus('ERROR', outerError.message);
    rootSpan.end();
    return res.status(500).json({ success: false, error: { code: 'SYS_500', message: outerError.message } });
  }
};

// Traced routes below

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId };
    if (status) query.orderStatus = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    res.json({ success: true, orders, page: Number(page), pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SYS_500', message: error.message } });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: { code: 'RES_404', message: 'Order not found' } });
    if (order.userId !== req.user.id && !req.user.roles?.includes('admin')) {
      return res.status(403).json({ success: false, error: { code: 'AUTH_003', message: 'Access denied' } });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SYS_500', message: error.message } });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    let updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (trackingNumber) updateFields.trackingNumber = trackingNumber;

    const order = await Order.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!order) return res.status(404).json({ success: false, error: { code: 'RES_404', message: 'Order not found' } });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SYS_500', message: error.message } });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: { code: 'RES_404', message: 'Order not found' } });

    if (order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED') {
      return res.status(400).json({ success: false, error: { code: 'VAL_001', message: 'Cannot cancel a shipped or delivered order' } });
    }

    order.orderStatus = 'CANCELLED';
    await order.save();
    res.json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SYS_500', message: error.message } });
  }
};

// ─── EVENTUAL CONSISTENCY RECONCILIATION WORKER ──────────────────────────────
setInterval(async () => {
  try {
    const pendingOrders = await Order.find({
      reconciliationTasks: { $not: { $size: 0 } },
    });

    for (const order of pendingOrders) {
      console.log(`[RECONCILE WORKER] Healing order ${order.orderNumber} (Tasks: ${order.reconciliationTasks})`);
      const newTasks = [...order.reconciliationTasks];

      // RESTOCK compensation task
      if (newTasks.includes('RESTOCK')) {
        try {
          for (const item of order.items) {
            await chaosFetch('http://localhost:3004/api/inventory/release', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sku: item.productId, quantity: item.quantity }),
            });
          }
          const idx = newTasks.indexOf('RESTOCK');
          if (idx > -1) newTasks.splice(idx, 1);
          console.log(`[RECONCILE WORKER] Restock success for order ${order.orderNumber}`);
        } catch (err) {
          console.error(`[RECONCILE WORKER] Restock retry failed for ${order.orderNumber}: ${err.message}`);
        }
      }

      // REFUND compensation task
      if (newTasks.includes('REFUND')) {
        try {
          await chaosFetch('http://localhost:3007/api/payments/refund-by-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': order.userId,
            },
            body: JSON.stringify({ orderId: order._id.toString() }),
          });
          const idx = newTasks.indexOf('REFUND');
          if (idx > -1) newTasks.splice(idx, 1);
          console.log(`[RECONCILE WORKER] Refund success for order ${order.orderNumber}`);
        } catch (err) {
          console.error(`[RECONCILE WORKER] Refund retry failed for ${order.orderNumber}: ${err.message}`);
        }
      }

      // Save resolved updates
      if (newTasks.length !== order.reconciliationTasks.length) {
        order.reconciliationTasks = newTasks;
        if (newTasks.length === 0) {
          order.sagaState = 'COMPENSATED';
        }
        await order.save();
        console.log(`[RECONCILE WORKER] Order ${order.orderNumber} successfully healed to COMPENSATED state.`);
      }
    }
  } catch (err) {
    console.error(`[RECONCILE WORKER] Error:`, err);
  }
}, 5000);
