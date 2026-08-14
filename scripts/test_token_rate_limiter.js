/**
 * Integration Test for Token-Aware Rate Limiter
 *
 * Verifies that the API Gateway token-rate limiting middleware calculates input
 * and output token consumption and correctly blocks requests exceeding the token budget
 * with a 429 status code.
 */

const GATEWAY_SUPPORT_URL = 'http://localhost:8000/api/support/api/support/query';

async function testTokenRateLimiter() {
  console.log('⚡ Starting Token-Aware Rate Limiter Test...');

  try {
    // 1. Send normal query (approx 10 tokens)
    console.log('\n[TEST] Sending normal query...');
    const res1 = await fetch(GATEWAY_SUPPORT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'agent_rate_test_user'
      },
      body: JSON.stringify({ query: 'What is the return policy?' }),
    });

    console.log(`  - Response Status: ${res1.status}`);
    const body1 = await res1.json();
    console.log(`  - Response Answer:`, body1.answer);

    // 2. Send massive spam queries to consume the 20,000 token budget
    // Each request will carry 5,000 tokens (approx 20,000 characters)
    const largeText = 'A '.repeat(20000); // 20k characters = ~5k tokens
    
    console.log('\n[TEST] Flooding gateway with high-token queries to trigger rate limiter...');
    for (let i = 1; i <= 5; i++) {
      console.log(`  - Sending Query #${i} containing ~5,000 tokens...`);
      const res = await fetch(GATEWAY_SUPPORT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'agent_rate_test_user'
        },
        body: JSON.stringify({ query: `Flood test ${i}: ${largeText}` }),
      });

      console.log(`    ➔ Status: ${res.status}`);
      const data = await res.json();
      
      if (res.status === 429) {
        console.log('\n🎉 SUCCESS: Gateway rate-limiter blocked the request!');
        console.log(`  - Blocked Code   : ${data.error.code}`);
        console.log(`  - Blocked Message: ${data.error.message}`);
        console.log(`  - Current Usage  : ${data.error.currentUsage} / ${data.error.budget}`);
        console.log('\n======================================================');
        console.log('🎉 VERDICT: PASS - Token-Aware Rate Limiter successfully protected cloud API budgets!');
        console.log('======================================================');
        return;
      }
    }

    console.log('❌ VERDICT: FAIL - Gateway did not rate-limit the high-token load.');

  } catch (err) {
    console.error('Test run failed:', err.message);
  }
}

testTokenRateLimiter();
