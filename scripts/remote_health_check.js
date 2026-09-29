/**
 * Live Deployed Remote Health Check Script
 */
const https = require('https');
const http = require('http');

const DEPLOYED_SERVICES = [
  {
    name: 'Agentic AI Operations Microservice (Render)',
    url: 'https://enterprise-ai-commerce-intelligence-d6ci.onrender.com/health',
  }
];

function checkDeployedService(service) {
  return new Promise((resolve) => {
    const client = service.url.startsWith('https') ? https : http;
    const req = client.get(service.url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(body);
            resolve({ service: service.name, status: 'ONLINE ✅', details: JSON.stringify(parsed) });
          } catch (e) {
            resolve({ service: service.name, status: 'ONLINE ✅', details: body.substring(0, 50) });
          }
        } else {
          resolve({ service: service.name, status: `HTTP ${res.statusCode} ⚠️`, details: body });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ service: service.name, status: 'OFFLINE ❌', details: err.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ service: service.name, status: 'TIMEOUT ⏱️', details: 'Request timed out' });
    });
  });
}

async function main() {
  console.log('🌐 Verification of Live Deployed Services:\n');
  const results = await Promise.all(DEPLOYED_SERVICES.map(checkDeployedService));
  console.table(results);
}

main();
