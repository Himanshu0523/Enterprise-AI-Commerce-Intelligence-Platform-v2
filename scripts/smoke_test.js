/**
 * Post-Deployment Smoke Test Script
 * Iterates through all 19 microservices to verify /health endpoints are 200 OK.
 */

const http = require('http');

const SERVICES = [
  { name: 'API Gateway', port: 8000 },
  { name: 'Auth Service', port: 3001 },
  { name: 'User Service', port: 3002 },
  { name: 'Product Service', port: 3003 },
  { name: 'Inventory Service', port: 3004 },
  { name: 'Cart Service', port: 3005 },
  { name: 'Order Service', port: 3006 },
  { name: 'Payment Service', port: 3007 },
  { name: 'Shipping Service', port: 3008 },
  { name: 'Coupon Service', port: 3009 },
  { name: 'Review Service', port: 3010 },
  { name: 'Notification Service', port: 3011 },
  { name: 'Audit Log Service', port: 3012 },
  { name: 'RAG Service', port: 8001 },
  { name: 'Forecast Service', port: 8002 },
  { name: 'Pricing Service', port: 8003 },
  { name: 'Fraud Service', port: 8004 },
  { name: 'Visual Search Service', port: 8005 },
  { name: 'ML Service', port: 8006 },
  { name: 'Agent Service', port: 8007 },
];

function checkServiceHealth(service) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${service.port}/health`, (res) => {
      resolve({ name: service.name, port: service.port, status: res.statusCode === 200 ? 'HEALTHY ✅' : `UNHEALTHY ❌ (${res.statusCode})` });
    });

    req.on('error', (err) => {
      resolve({ name: service.name, port: service.port, status: `DOWN ❌ (${err.code})` });
    });

    req.setTimeout(2000, () => {
      req.destroy();
      resolve({ name: service.name, port: service.port, status: 'TIMEOUT ❌' });
    });
  });
}

async function runPostDeploySmokeTest() {
  console.log('💨 Running Post-Deployment Smoke Test across 20 Endpoints...\n');

  const results = await Promise.all(SERVICES.map(checkServiceHealth));
  console.table(results);

  const healthyCount = results.filter((r) => r.status.includes('HEALTHY')).length;
  console.log(`\n📊 Health Check Summary: ${healthyCount} / ${SERVICES.length} Services Responding 200 OK.`);
}

runPostDeploySmokeTest();
