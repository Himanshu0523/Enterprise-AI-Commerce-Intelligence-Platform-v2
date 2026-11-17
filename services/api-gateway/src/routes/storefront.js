const express = require('express');
const createProxy = require('../services/proxy');
const config = require('../config');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes (no auth required)
router.use('/products', createProxy(config.services.product, { pathRewrite: { '^/': '/api/products/' } }));
router.get('/reviews/product/:productId', createProxy(config.services.review, { pathRewrite: { '^/reviews/': '/api/reviews/' } }));
router.get('/reviews/product/:productId/summary', createProxy(config.services.review, { pathRewrite: { '^/reviews/': '/api/reviews/' } }));
router.post('/reviews/:id/helpful', createProxy(config.services.review, { pathRewrite: { '^/reviews/': '/api/reviews/' } }));
router.use('/reviews', authenticate, createProxy(config.services.review, { pathRewrite: { '^/': '/api/reviews/' } }));

// Cart routes require authentication
router.use('/cart', authenticate, createProxy(config.services.cart, { pathRewrite: { '^/': '/api/cart/' } }));

// Checkout routes (order, payment, shipping) require authentication
router.use('/orders', authenticate, createProxy(config.services.order, { pathRewrite: { '^/': '/api/orders/' } }));
router.use('/payments', authenticate, createProxy(config.services.payment, { pathRewrite: { '^/': '/api/payments/' } }));
router.use('/shipping', authenticate, createProxy(config.services.shipping, { pathRewrite: { '^/': '/api/shipping/' } }));
router.use('/coupons', authenticate, createProxy(config.services.coupon, { pathRewrite: { '^/': '/api/coupons/' } }));

// User profile routes require authentication
router.use('/users', authenticate, createProxy(config.services.user, { pathRewrite: { '^/': '/v1/users/' } }));

module.exports = router;