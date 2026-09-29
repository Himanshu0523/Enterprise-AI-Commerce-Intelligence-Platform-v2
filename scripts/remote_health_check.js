/**
 * Live Deployed Remote Health Check Script for All 22 Platform Services
 */
try { require('dotenv').config(); } catch (e) {}
const https = require('https');
const http = require('http');

const DEPLOYED_SERVICES = [
  // 1. Frontend Web Applications
  { name: 'Commerce Storefront', url: process.env.STOREFRONT_URL || 'https://storefront-ept1.onrender.com' },
  { name: 'Admin Dashboard', url: process.env.ADMIN_DASHBOARD_URL || 'https://admin-dashboard-sy4k.onrender.com' },

  // 2. Core Microservices & API Gateway
  { name: 'API Gateway', url: process.env.API_GATEWAY_URL || 'https://api-gateway-xu2v.onrender.com/health' },
  { name: 'Auth Service', url: process.env.AUTH_SERVICE_URL || 'https://auth-service-4x8g.onrender.com/health' },
  { name: 'User Service', url: process.env.USER_SERVICE_URL || 'https://user-service-q7p2.onrender.com/health' },
  { name: 'Product Service', url: process.env.PRODUCT_SERVICE_URL || 'https://product-service-v8k1.onrender.com/health' },
  { name: 'Inventory Service', url: process.env.INVENTORY_SERVICE_URL || 'https://inventory-service-a93m.onrender.com/health' },
  { name: 'Cart Service', url: process.env.CART_SERVICE_URL || 'https://cart-service-b12n.onrender.com/health' },
  { name: 'Order Service', url: process.env.ORDER_SERVICE_URL || 'https://order-service-c34p.onrender.com/health' },
  { name: 'Payment Service', url: process.env.PAYMENT_SERVICE_URL || 'https://payment-service-d56q.onrender.com/health' },
  { name: 'Shipping Service', url: process.env.SHIPPING_SERVICE_URL || 'https://shipping-service-e78r.onrender.com/health' },
  { name: 'Coupon Service', url: process.env.COUPON_SERVICE_URL || 'https://coupon-service-f90s.onrender.com/health' },
  { name: 'Review Service', url: process.env.REVIEW_SERVICE_URL || 'https://review-service-g12t.onrender.com/health' },
  { name: 'Notification Service', url: process.env.NOTIFICATION_SERVICE_URL || 'https://notification-service-h34u.onrender.com/health' },
  { name: 'Audit Log Service', url: process.env.AUDIT_LOG_SERVICE_URL || 'https://audit-log-service-i56v.onrender.com/health' },

  // 3. AI & Intelligence Microservices
  { name: 'Agentic AI Operations Service', url: process.env.AGENT_SERVICE_URL || 'https://agent-service-j78w.onrender.com/health' },
  { name: 'RAG Knowledge Support Service', url: process.env.RAG_SERVICE_URL || 'https://rag-service-k90x.onrender.com/health' },
  { name: 'ML Recommendation Service', url: process.env.ML_SERVICE_URL || 'https://ml-service-l12y.onrender.com/health' },
  { name: 'Dynamic Pricing Service', url: process.env.PRICING_SERVICE_URL || 'https://pricing-service-m34z.onrender.com/health' },
  { name: 'Demand Forecast Service', url: process.env.FORECAST_SERVICE_URL || 'https://forecast-service-n56a.onrender.com/health' },
  { name: 'Fraud Detection Service', url: process.env.FRAUD_SERVICE_URL || 'https://fraud-service-o78b.onrender.com/health' },
  { name: 'Visual Search Service', url: process.env.VISUAL_SEARCH_SERVICE_URL || 'https://visual-search-service-p90c.onrender.com/health' },
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
