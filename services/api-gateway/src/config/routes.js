module.exports = {
  publicRoutes: [
    '/health',
    '/metrics',
    // Public identity and account-recovery endpoints
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh-token',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/google',
    '/api/auth/google/callback',
    '/api/auth/validate',
    '/api/auth/mfa/verify-login',
    '/api/storefront/products',
    '/api/storefront/reviews',
  ],
  protectedRoutes: [
    '/api/auth/logout',
    '/api/auth/mfa/setup',
    '/api/auth/mfa/verify-enable',
    '/api/auth/mfa/disable',
    '/api/auth/mfa/status',
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
