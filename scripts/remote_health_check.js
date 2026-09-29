/**
 * Live Deployed Remote Health Check Script for All Platform Services
 */
require('dotenv').config();
const https = require('https');
const http = require('http');

const DEPLOYED_SERVICES = [
  // 1. AI Operations & Intelligence Microservices
  { name: 'Agentic AI Operations Microservice', url: process.env.AGENT_SERVICE_URL || 'https://enterprise-ai-commerce-intelligence-d6ci.onrender.com/health' },
  { name: 'RAG Support Service', url: process.env.RAG_SERVICE_URL || 'https://rag-service.onrender.com/health' },
  { name: 'ML Recommendation Service', url: process.env.ML_SERVICE_URL || 'https://ml-service.onrender.com/health' },
  { name: 'Dynamic Pricing Service', url: process.env.PRICING_SERVICE_URL || 'https://pricing-service.onrender.com/health' },
  { name: 'Demand Forecast Service', url: process.env.FORECAST_SERVICE_URL || 'https://forecast-service.onrender.com/health' },
  { name: 'Fraud Detection Service', url: process.env.FRAUD_SERVICE_URL || 'https://fraud-service.onrender.com/health' },

  // 2. Core API Gateway & Commerce Services
  { name: 'API Gateway', url: process.env.API_GATEWAY_URL || 'https://api-gateway.onrender.com/health' },
  { name: 'Auth Service', url: process.env.AUTH_SERVICE_URL || 'https://auth-service.onrender.com/health' },
  { name: 'Product Service', url: process.env.PRODUCT_SERVICE_URL || 'https://product-service.onrender.com/health' },
  { name: 'Order Service', url: process.env.ORDER_SERVICE_URL || 'https://order-service.onrender.com/health' },
  { name: 'User Service', url: process.env.USER_SERVICE_URL || 'https://user-service-e3hq.onrender.com/health' },
  { name: 'Inventory Service', url: process.env.INVENTORY_SERVICE_URL || 'https://inventory-service.onrender.com/health' },
  { name: 'Cart Service', url: process.env.CART_SERVICE_URL || 'https://cart-service.onrender.com/health' },
  { name: 'Payment Service', url: process.env.PAYMENT_SERVICE_URL || 'https://payment-service.onrender.com/health' },
];

function checkDeployedService(service, retries = 1) {
  return new Promise((resolve) => {
    const client = service.url.startsWith('https') ? https : http;
    
    function attempt(remaining) {
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
            resolve({ service: service.name, status: `HTTP ${res.statusCode} ⚠️`, details: body.substring(0, 50) });
          }
        });
      });

      req.on('error', (err) => {
        if (remaining > 0) {
          setTimeout(() => attempt(remaining - 1), 3000);
        } else {
          resolve({ service: service.name, status: 'OFFLINE / PENDING ⏳', details: err.message });
        }
      });

      // Free tier cold starts on Render take ~30-50s
      req.setTimeout(45000, () => {
        req.destroy();
        if (remaining > 0) {
          setTimeout(() => attempt(remaining - 1), 3000);
        } else {
          resolve({ service: service.name, status: 'TIMEOUT ⏱️', details: 'Warming up on Render (free tier cold start)' });
        }
      });
    }

    attempt(retries);
  });
}

async function main() {
  console.log('🌐 Verification of Platform Services:\n');
  const results = await Promise.all(DEPLOYED_SERVICES.map(s => checkDeployedService(s)));
  console.table(results);
}

main();
