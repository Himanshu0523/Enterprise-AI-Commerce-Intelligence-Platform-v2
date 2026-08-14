/**
 * Health Check Script for All Microservices
 */
const http = require('http');

const SERVICES = [
  { name: 'API Gateway', port: 8000, path: '/health' },
  { name: 'Auth Service', port: 3001, path: '/health' },
  { name: 'User Service', port: 3002, path: '/health' },
  { name: 'Product Service', port: 3003, path: '/health' },
  { name: 'Inventory Service', port: 3004, path: '/health' },
  { name: 'Cart Service', port: 3005, path: '/health' },
  { name: 'Order Service', port: 3006, path: '/health' },
  { name: 'Payment Service', port: 3007, path: '/health' },
  { name: 'Shipping Service', port: 3008, path: '/health' },
  { name: 'Coupon Service', port: 3009, path: '/health' },
  { name: 'Review Service', port: 3010, path: '/health' },
  { name: 'RAG Support Service', port: 8001, path: '/health' },
  { name: 'Forecast Service', port: 8002, path: '/health' },
  { name: 'Pricing Service', port: 8003, path: '/health' },
  { name: 'Fraud Service', port: 8004, path: '/health' },
  { name: 'Visual Search Service', port: 8005, path: '/health' },
  { name: 'ML Service', port: 8006, path: '/health' },
  { name: 'Agent Operations Service', port: 8007, path: '/health' },
];

function checkService(service) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${service.port}${service.path}`, (res) => {
      if (res.statusCode === 200) {
        resolve({ service: service.name, port: service.port, status: 'ONLINE ✅' });
      } else {
        resolve({ service: service.name, port: service.port, status: `HTTP ${res.statusCode} ⚠️` });
      }
    });

    req.on('error', () => {
      resolve({ service: service.name, port: service.port, status: 'OFFLINE ❌' });
    });

    req.setTimeout(2000, () => {
      req.destroy();
      resolve({ service: service.name, port: service.port, status: 'TIMEOUT ⏱️' });
    });
  });
}

async function runHealthCheck() {
  console.log('🔍 Checking status of all microservices...\n');
  const results = await Promise.all(SERVICES.map(checkService));
  console.table(results);
}

runHealthCheck();
