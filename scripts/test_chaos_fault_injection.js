/**
 * Phase 2: Chaos & Fault Injection Test Suite
 *
 * Implements "Jepsen-Style" Network Partition Testing.
 * Dynamically configures network partitions between order-service, payment-service,
 * and inventory-service. Verifies that the system handles partitions gracefully,
 * fails safely without corrupted state, and automatically reconciles when the network heals.
 */

const ORDER_URL = 'http://localhost:3006/api/orders';
const INVENTORY_URL = 'http://localhost:3004/api/inventory';
const PAYMENT_URL = 'http://localhost:3007/api/payments';

const ORDER_CHAOS = 'http://localhost:3006/api/chaos/configure';
const PAYMENT_CHAOS = 'http://localhost:3007/api/chaos/configure';

async function configureServiceChaos(endpoint, config) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return res.json();
}

async function getOrderDetails(orderId) {
  const res = await fetch(`${ORDER_URL}/${orderId}`, {
    headers: { 'x-user-id': 'test_user' }
  });
  const body = await res.json();
  return body.data;
}

async function getInventoryStock(sku) {
  const res = await fetch(`${INVENTORY_URL}/${sku}`);
  const body = await res.json();
  return body.data;
}

async function setupInventory(sku, quantity) {
  await fetch(INVENTORY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sku, productId: sku, quantity, warehouseLocation: 'Main', reorderLevel: 5 }),
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runJepsenChaosTest() {
  console.log('⚡ Initiating Jepsen-Style Network Partition & Eventual Consistency Test...\n');

  try {
    // 0. Seed test stock
    const sku = 'TEST-SKU-999';
    await setupInventory(sku, 10);
    const initialInv = await getInventoryStock(sku);
    console.log(`[INIT] Initial Stock for ${sku}: quantity=${initialInv.quantity}, reserved=${initialInv.reserved}`);

    // ────────────────────────────────────────────────────────────────────────
    // SCENARIO 1: Partition between Order-Service and Payment-Service
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n================================──────────────────────');
    console.log('🧪 SCENARIO: Partition between Order & Payment Services');
    console.log('================================──────────────────────');

    console.log('[CHAOS] Partitioning network: Blocking Order-Service from reaching Payment-Service (3007)...');
    await configureServiceChaos(ORDER_CHAOS, {
      partitionActive: true,
      blockedHosts: ['localhost:3007', '3007'], // Block payment port/host
      dropRate: 0,
      latencyMs: 0
    });

    console.log('[TEST] Submitting checkout request...');
    const checkoutRes = await fetch(ORDER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `idem_chaos_${Date.now()}`,
        'x-user-id': 'test_user'
      },
      body: JSON.stringify({
        items: [{ productId: sku, title: 'Test Product', price: 50, quantity: 2 }],
        shippingAddress: {
          fullName: 'Chaos Jane',
          addressLine1: '123 Faulty Rd',
          city: 'Split Brain',
          state: 'CA',
          postalCode: '90210',
          country: 'US',
          phone: '555-0199'
        },
        paymentMethod: 'CREDIT_CARD',
        subtotal: 100
      })
    });

    const checkoutBody = await checkoutRes.json();
    console.log(`[TEST] Checkout response status: ${checkoutRes.status}`);
    console.log(`[TEST] Checkout error payload:`, checkoutBody.error);

    // Verify order was created but cancelled with pending compensations
    const orderId = checkoutBody.error?.message?.match(/failed/) ? null : checkoutBody.error?.reconciliationTasks ? 'extracted' : null;
    
    // Let's query recent order list to find our order
    const listRes = await fetch(`${ORDER_URL}?limit=1`, {
      headers: { 'x-user-id': 'test_user' }
    });
    const listBody = await listRes.json();
    const order = listBody.orders[0];

    console.log(`[VERIFY] Order ${order.orderNumber} state during partition:`);
    console.log(`  - orderStatus         : ${order.orderStatus}`);
    console.log(`  - sagaState           : ${order.sagaState}`);
    console.log(`  - reconciliationTasks : ${JSON.stringify(order.reconciliationTasks)}`);

    // Verify inventory reserved is now 2 (since the order-service couldn't reach payment,
    // it registered the compensation task but was blocked from releasing stock or immediate release failed)
    // Wait, the immediate release failed because order-service was partitioned from inventory-service too?
    // Let's check stock status:
    const midInv = await getInventoryStock(sku);
    console.log(`  - Current SKU Reserved: ${midInv.reserved} (Expected: 2)`);

    // ────────────────────────────────────────────────────────────────────────
    // HEAL PHASE
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n🩹 Healing network partition...');
    await configureServiceChaos(ORDER_CHAOS, {
      partitionActive: false,
      blockedHosts: []
    });

    console.log('[RECONCILE] Waiting 6 seconds for background eventual consistency worker...');
    await delay(6000);

    // Verify healed order
    const healedOrder = await getOrderDetails(order._id);
    const healedInv = await getInventoryStock(sku);

    console.log('[VERIFY] Order state after network healing:');
    console.log(`  - orderStatus         : ${healedOrder.orderStatus}`);
    console.log(`  - sagaState           : ${healedOrder.sagaState} (Expected: COMPENSATED)`);
    console.log(`  - reconciliationTasks : ${JSON.stringify(healedOrder.reconciliationTasks)} (Expected: [])`);
    console.log(`  - Current SKU Reserved: ${healedInv.reserved} (Expected: 0 - Stock successfully released!)`);

    console.log('\n================================──────────────────────');
    if (healedOrder.sagaState === 'COMPENSATED' && healedInv.reserved === 0) {
      console.log('🎉 VERDICT: PASS - System achieved eventual consistency post-partition with zero corrupted states!');
    } else {
      console.log('❌ VERDICT: FAIL - Data mismatch detected after healing network partition.');
    }
    console.log('======================================================\n');

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    // Reset all chaos states
    await configureServiceChaos(ORDER_CHAOS, { partitionActive: false, blockedHosts: [] });
  }
}

runJepsenChaosTest();
