const config = require('./index');

module.exports = {
  publicRoutes: [
    '/health',
    '/metrics',
    '/api/auth/login',
    '/api/auth/register',
    '/api/storefront/products',
    '/api/storefront/reviews',
  ],
  protectedRoutes: [
    '/api/storefront/cart',
    '/api/storefront/orders',
    '/api/storefront/payments',
    '/api/storefront/shipping',
    '/api/storefront/coupons',
    '/api/storefront/users',
  ],
  adminRoutes: [
    '/api/admin/*',
  ],
};
