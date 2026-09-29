require('dotenv').config();

function formatUrl(envVal, fallback) {
  const val = envVal || fallback;
  if (!val) return fallback;
  if (val.startsWith('http://') || val.startsWith('https://')) {
    return val;
  }
  return `http://${val}`;
}

module.exports = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  services: {
    auth: formatUrl(process.env.AUTH_SERVICE_URL, 'http://localhost:3001'),
    user: formatUrl(process.env.USER_SERVICE_URL, 'http://localhost:3002'),
    product: formatUrl(process.env.PRODUCT_SERVICE_URL, 'http://localhost:3003'),
    inventory: formatUrl(process.env.INVENTORY_SERVICE_URL, 'http://localhost:3004'),
    cart: formatUrl(process.env.CART_SERVICE_URL, 'http://localhost:3005'),
    order: formatUrl(process.env.ORDER_SERVICE_URL, 'http://localhost:3006'),
    payment: formatUrl(process.env.PAYMENT_SERVICE_URL, 'http://localhost:3007'),
    shipping: formatUrl(process.env.SHIPPING_SERVICE_URL, 'http://localhost:3008'),
    coupon: formatUrl(process.env.COUPON_SERVICE_URL, 'http://localhost:3009'),
    review: formatUrl(process.env.REVIEW_SERVICE_URL, 'http://localhost:3010'),
    notification: formatUrl(process.env.NOTIFICATION_SERVICE_URL, 'http://localhost:3011'),
    auditLog: formatUrl(process.env.AUDIT_LOG_SERVICE_URL, 'http://localhost:3012'),
    pricing: formatUrl(process.env.PRICING_SERVICE_URL, 'http://localhost:8003'),
    rag: formatUrl(process.env.RAG_SERVICE_URL, 'http://localhost:8001'),
    agent: formatUrl(process.env.AGENT_SERVICE_URL, 'http://localhost:8007'),
    ml: formatUrl(process.env.ML_SERVICE_URL, 'http://localhost:8000'),
    forecast: formatUrl(process.env.FORECAST_SERVICE_URL, 'http://localhost:8004'),
    fraud: formatUrl(process.env.FRAUD_SERVICE_URL, 'http://localhost:8005'),
    visualSearch: formatUrl(process.env.VISUAL_SEARCH_SERVICE_URL, 'http://localhost:8002'),
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    issuer: process.env.JWT_ISSUER || 'ecommerce-platform',
  },
  
  cors: {
    origins: (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL)?.split(',').map(s => s.trim()) || ['http://localhost:3000', 'http://localhost:3001', '*'],
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                  // limit each IP to 100 requests per window
  },
};
