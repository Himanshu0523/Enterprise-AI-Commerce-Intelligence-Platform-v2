const Inventory = require('../models/Inventory');
const { redis } = require('../config/redis');

exports.getInventoryBySku = async (req, res) => {
  try {
    const { sku } = req.params;
    let inv = await Inventory.findOne({ sku });
    if (!inv) return res.status(404).json({ success: false, error: { code: 'RES_404', message: 'Inventory record not found' } });
    res.json({ success: true, data: inv });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SYS_500', message: error.message } });
  }
};

exports.setInventory = async (req, res) => {
  try {
    const { sku, productId, quantity, warehouseLocation, reorderLevel } = req.body;
    let inv = await Inventory.findOne({ sku });

    if (inv) {
      inv.quantity = quantity;
      if (warehouseLocation) inv.warehouseLocation = warehouseLocation;
      if (reorderLevel !== undefined) inv.reorderLevel = reorderLevel;
      await inv.save();
    } else {
      inv = await Inventory.create({ sku, productId, quantity, warehouseLocation, reorderLevel });
    }

    // Sync to Redis immediately to maintain cache coherence
    await redis.set(`stock:${sku}`, inv.quantity);
    await redis.set(`reserved:${sku}`, inv.reserved);

    res.json({ success: true, data: inv });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SYS_500', message: error.message } });
  }
};

/**
 * High-Concurrency Lock-Free In-Memory Inventory Allocator
 *
 * Utilizes a Redis Lua script running atomically and entirely in-memory
 * to check and decrement stock in <1ms without database locking bottlenecks.
 * Persists changes asynchronously to MongoDB, shielding the system from high-concurrency collapses.
 */
exports.reserveStock = async (req, res) => {
  try {
    const { sku, quantity } = req.body;

    if (!sku || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ success: false, error: { code: 'VAL_001', message: 'Valid sku and positive quantity required' } });
    }

    // ── Lazy Load Cache to Redis ──────────────────────────────────────────
    let stockCached = await redis.get(`stock:${sku}`);
    if (stockCached === null) {
      const inv = await Inventory.findOne({ sku });
      if (!inv) {
        return res.status(404).json({ success: false, error: { code: 'RES_404', message: 'SKU not found in catalog' } });
      }
      await redis.set(`stock:${sku}`, inv.quantity);
      await redis.set(`reserved:${sku}`, inv.reserved);
    }

    // ── Run Atomic Lua script Allocation ──────────────────────────────────
    const allocated = await redis.reserveStockLua([sku], [quantity]);

    if (allocated === 0) {
      // Insufficient stock
      const stock = parseInt(await redis.get(`stock:${sku}`) || '0', 10);
      const reserved = parseInt(await redis.get(`reserved:${sku}`) || '0', 10);
      return res.status(400).json({
        success: false,
        error: {
          code: 'INV_400',
          message: `Insufficient stock for SKU ${sku}. Transaction aborted by Redis Lua Engine.`,
          availableUnits: Math.max(0, stock - reserved),
        },
      });
    }

    // ── Return success response immediately (<1ms) ───────────────────────
    res.json({
      success: true,
      message: `Atomically reserved ${quantity} units of ${sku} in-memory`,
      allocationEngine: 'Redis LUA Script (Lock-Free)',
    });

    // ── Asynchronous Write-Behind DB Sync ────────────────────────────────
    // Detached promise chain executes asynchronously without blocking the client response
    Inventory.findOneAndUpdate(
      { sku },
      { $inc: { reserved: quantity } },
      { new: true }
    ).catch(err => {
      console.error(`[DB-ASYNC-ERROR] Failed to persist stock reservation for SKU ${sku}:`, err.message);
    });

  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SYS_500', message: error.message } });
  }
};

exports.releaseStock = async (req, res) => {
  try {
    const { sku, quantity } = req.body;
    if (!sku || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ success: false, error: { code: 'VAL_001', message: 'Valid sku and positive quantity required' } });
    }

    // ── Release in-memory reserve ─────────────────────────────────────────
    const reservedVal = parseInt(await redis.get(`reserved:${sku}`) || '0', 10);
    const newReserved = Math.max(0, reservedVal - quantity);
    await redis.set(`reserved:${sku}`, newReserved);

    // ── Return success response immediately ──────────────────────────────
    res.json({
      success: true,
      message: `Stock released in-memory for ${sku}`,
      engine: 'Redis Cache-Coherent Sync',
    });

    // ── Asynchronous Database Sync ────────────────────────────────────────
    Inventory.findOneAndUpdate(
      { sku },
      { $inc: { reserved: -Math.abs(quantity) } },
      { new: true }
    ).then(inv => {
      if (inv && inv.reserved < 0) {
        inv.reserved = 0;
        inv.save();
      }
    }).catch(err => {
      console.error(`[DB-ASYNC-ERROR] Failed to persist stock release for SKU ${sku}:`, err.message);
    });

  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SYS_500', message: error.message } });
  }
};

exports.adjustStock = async (req, res) => {
  try {
    const { sku, adjustment } = req.body;
    let inv = await Inventory.findOne({ sku });
    if (!inv) return res.status(404).json({ success: false, error: { code: 'RES_404', message: 'Inventory record not found' } });

    inv.quantity = Math.max(0, inv.quantity + adjustment);
    await inv.save();
    res.json({ success: true, data: inv });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SYS_500', message: error.message } });
  }
};
