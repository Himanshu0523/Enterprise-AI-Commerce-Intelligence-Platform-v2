require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003',
    inventory: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3004',
    cart: process.env.CART_SERVICE_URL || 'http://localhost:3005',
    order: process.env.ORDER_SERVICE_URL || 'http://localhost:3006',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3007',
    shipping: process.env.SHIPPING_SERVICE_URL || 'http://localhost:3008',
    coupon: process.env.COUPON_SERVICE_URL || 'http://localhost:3009',
    review: process.env.REVIEW_SERVICE_URL || 'http://localhost:3010',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3011',
    auditLog: process.env.AUDIT_LOG_SERVICE_URL || 'http://localhost:3012',
    pricing: process.env.PRICING_SERVICE_URL || 'http://localhost:8003',
    rag: process.env.RAG_SERVICE_URL || 'http://localhost:8001',
    agent: process.env.AGENT_SERVICE_URL || 'http://localhost:8007',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    issuer: process.env.JWT_ISSUER || 'ecommerce-platform',
  },
  
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001', '*'],
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                  // limit each IP to 100 requests per window
  },
};
