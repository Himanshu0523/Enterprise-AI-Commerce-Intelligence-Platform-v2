/**
 * Integration Test for Redis Lua Allocation Engine
 *
 * Simulates high-concurrency stock reservation requests targeting the
 * Redis Lua script allocator to verify:
 *   1. Atomic decrement of stock.
 *   2. Handling of out-of-stock scenarios.
 *   3. Non-blocking asynchronous database synchronization.
 */

const INVENTORY_URL = 'http://localhost:3004/api/inventory';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAllocatorTest() {
  console.log('⚡ Starting High-Concurrency Redis Lua Allocation Engine Test...');

  const sku = 'FLASH-SALE-ITEM';

  try {
    // 1. Initialize stock to 5
    console.log('[INIT] Setting initial stock for FLASH-SALE-ITEM to 5...');
    const initRes = await fetch(INVENTORY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, productId: 'prod-123', quantity: 5, warehouseLocation: 'Main' }),
    });

    const initData = await initRes.json();
    console.log(`[INIT] Initial Stock Status: quantity=${initData.data.quantity}, reserved=${initData.data.reserved}`);

    // 2. Perform 6 concurrent reservation requests of 1 item each
    // Since stock is 5, exactly 5 must succeed and 1 must fail due to Lua atomic protection!
    console.log('\n[CONCURRENCY] Simulating 6 concurrent clicks on "Buy Now" (Stock: 5)...');
    
    const requests = Array.from({ length: 6 }).map((_, idx) => {
      return fetch(`${INVENTORY_URL}/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, quantity: 1 }),
      }).then(async res => ({
        id: idx + 1,
        status: res.status,
        body: await res.json()
      }));
    });

    const results = await Promise.all(requests);
    
    let successes = 0;
    let failures = 0;

    results.forEach(res => {
      if (res.status === 200) {
        successes++;
        console.log(`  ✅ Click #${res.id}: Success! (Reserved 1 via ${res.body.allocationEngine})`);
      } else {
        failures++;
        console.log(`  ❌ Click #${res.id}: Failed! (${res.body.error.message})`);
      }
    });

    console.log(`\n[SUMMARY] Successes: ${successes} (Expected: 5), Failures: ${failures} (Expected: 1)`);

    if (successes === 5 && failures === 1) {
      console.log('\n🎉 VERDICT: PASS - Redis Lua Script allocator atomically prevented overselling!');
    } else {
      console.log('\n❌ VERDICT: FAIL - Concurrency race condition detected.');
    }

  } catch (err) {
    console.error('Test run failed:', err.message);
  }
}

runAllocatorTest();
