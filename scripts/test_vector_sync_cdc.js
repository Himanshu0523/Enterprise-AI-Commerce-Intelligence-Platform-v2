/**
 * Integration Test for Real-Time Kafka CDC Vector Metadata Sync
 *
 * Simulates a change in catalog parameters (e.g. price reduction and item sell-out)
 * and verifies that the RAG multimodal search returns the updated metadata instantly
 * due to the background CDC listener loop.
 */

const RAG_SEARCH_URL = 'http://localhost:8001/api/search/multimodal';

async function performSearch(queryText) {
  const form = new FormData();
  form.append('query', queryText);
  form.append('limit', '5');

  const res = await fetch(RAG_SEARCH_URL, {
    method: 'POST',
    body: form
  });

  if (!res.ok) {
    throw new Error(`RAG search request failed with status: ${res.status}`);
  }

  return await res.json();
}

async function testCdcVectorSync() {
  console.log('⚡ Starting Real-Time CDC Vector Sync Integration Test...');

  try {
    // Step 1: Initial RAG query to retrieve p102
    console.log('\n[STEP 1] Performing initial RAG search for "Sneaker"...');
    const data1 = await performSearch('Minimalist Sneaker');
    const sneaker1 = data1.results.find(p => p.productId === 'p102');
    
    if (!sneaker1) {
      console.log('  ❌ FAIL: Minimalist White Sneaker (p102) not found in search results.');
      return;
    }
    
    console.log(`  ✅ Found: ${sneaker1.name}`);
    console.log(`  - Price: $${sneaker1.price}`);
    console.log(`  - Stock: ${sneaker1.stock} units`);

    // Step 2: Wait for background CDC update simulation to kick in
    // The kafka_cdc_worker.py simulation loop updates:
    // p102 -> price: 74.99, stock: 0 after 5-10 seconds
    console.log('\n[STEP 2] Waiting 6 seconds for CDC stream event to propagate catalog mutations...');
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Step 3: Subsequent RAG query to check if values updated in real-time
    console.log('\n[STEP 3] Re-running RAG search to inspect updated vector metadata...');
    const data2 = await performSearch('Minimalist Sneaker');
    const sneaker2 = data2.results.find(p => p.productId === 'p102');

    console.log(`  ➔ Updated Price: $${sneaker2.price} (Expected: $74.99)`);
    console.log(`  ➔ Updated Stock: ${sneaker2.stock} (Expected: 0)`);

    if (sneaker2.price === 74.99 && sneaker2.stock === 0) {
      console.log('\n======================================================');
      console.log('🎉 VERDICT: PASS - Kafka CDC real-time metadata sync verified!');
      console.log('======================================================');
    } else {
      console.log('\n❌ VERDICT: FAIL - CDC sync lag or values mismatched.');
    }

  } catch (err) {
    console.error('Test run failed:', err.message);
  }
}

testCdcVectorSync();
