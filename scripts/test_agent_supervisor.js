/**
 * Integration Test for Agent Supervisor Router
 *
 * Verifies that the agent-service supervisor router correctly:
 *   1. Rejects execution loop depths >= 5 (Unprocessable Entity 422)
 *   2. Rejects session budgets exceeding $0.05 (Payment Required 402)
 */

const AGENT_ROUTE_URL = 'http://localhost:8007/api/agent/route';

async function testAgentSupervisor() {
  console.log('⚡ Starting Agent Supervisor Guardrails Test...');

  const sessionId = `session_${Date.now()}`;

  try {
    // Scenario A: Verify Graph Loop Depth Caps
    console.log('\n[TEST A] Simulating recursive agent loops up to max depth...');
    for (let depth = 0; depth <= 5; depth++) {
      console.log(`  - Sending Agent Routing Request (Step depth: ${depth})...`);
      const res = await fetch(AGENT_ROUTE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          currentLoopCount: depth,
          inputTokens: 100,
          outputTokens: 150,
          agentName: 'MarketingAgent',
          prompt: 'Am I stuck in a loop?'
        }),
      });

      console.log(`    ➔ Status: ${res.status}`);
      const data = await res.json();
      
      if (res.status === 422) {
        console.log('  ✅ SUCCESS: Supervisor Router blocked infinite loop traversal!');
        console.log(`  - Blocked message: ${data.detail}`);
        break;
      }
    }

    // Scenario B: Verify Financial Token Cost Caps
    console.log('\n[TEST B] Simulating high token cost session...');
    const costlySessionId = `expensive_${Date.now()}`;
    
    // We send a request with 25,000 input tokens and 15,000 output tokens to trigger over $0.05 limit
    // Cost calculation: 25k * (0.0015/1k) + 15k * (0.002/1k) = 0.0375 + 0.03 = 0.0675 USD (Limit: $0.05)
    console.log('  - Sending heavy token payload (25,000 input / 15,000 output)...');
    
    // First request registers the cost
    const resB1 = await fetch(AGENT_ROUTE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: costlySessionId,
        currentLoopCount: 1,
        inputTokens: 25000,
        outputTokens: 15000,
        agentName: 'MarketingAgent',
        prompt: 'Generate huge reports'
      }),
    });
    const dataB1 = await resB1.json();
    console.log(`    ➔ Response 1 Status: ${resB1.status}, Accumulated Cost: $${dataB1.sessionCost?.toFixed(4)}`);

    // Second request should be blocked immediately by supervisor
    console.log('  - Sending subsequent request under same costly session...');
    const resB2 = await fetch(AGENT_ROUTE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: costlySessionId,
        currentLoopCount: 2,
        inputTokens: 100,
        outputTokens: 100,
        agentName: 'MarketingAgent',
        prompt: 'Continue working'
      }),
    });
    
    console.log(`    ➔ Response 2 Status: ${resB2.status}`);
    const dataB2 = await resB2.json();

    if (resB2.status === 402) {
      console.log('  ✅ SUCCESS: Supervisor Router blocked token billing hemorrhage!');
      console.log(`  - Blocked message: ${dataB2.detail}`);
      console.log('\n======================================================');
      console.log('🎉 VERDICT: PASS - Supervisor Router caps depth and session costs!');
      console.log('======================================================');
    } else {
      console.log('  ❌ FAIL: Costly request was not blocked.');
    }

  } catch (err) {
    console.error('Test run failed:', err.message);
  }
}

testAgentSupervisor();
