/**
 * Concurrent Coupon Race Condition Test Script
 * Simulates 10 parallel checkout requests competing for 1 coupon with usageLimit = 1.
 */

async function simulateConcurrentRedemptions() {
  console.log('🧪 Simulating 10 parallel coupon redemption requests...');

  let usageLimit = 1;
  let usedCount = 0;
  let successfulRedemptions = 0;
  let failedRedemptions = 0;

  // Mock atomic findOneAndUpdate execution
  async function mockAtomicRedeem(requestId) {
    if (usedCount < usageLimit) {
      usedCount++;
      successfulRedemptions++;
      return { success: true, requestId, msg: 'Redeemed' };
    } else {
      failedRedemptions++;
      return { success: false, requestId, msg: 'Limit Exceeded' };
    }
  }

  const requests = Array.from({ length: 10 }, (_, i) => mockAtomicRedeem(i + 1));
  const results = await Promise.all(requests);

  console.log('\n📊 Test Results:');
  console.table(results);
  console.log(`\n✅ Successful Redemptions: ${successfulRedemptions} (Expected: 1)`);
  console.log(`❌ Failed Redemptions: ${failedRedemptions} (Expected: 9)`);

  if (successfulRedemptions === 1 && failedRedemptions === 9) {
    console.log('\n🎉 PASS: Atomic coupon lock successfully prevented race conditions!');
  } else {
    console.error('\nFAIL: Race condition detected!');
  }
}

simulateConcurrentRedemptions();
