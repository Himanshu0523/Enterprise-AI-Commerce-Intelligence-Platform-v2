const express = require('express');
const createProxy = require('../services/proxy');
const config = require('../conifg');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes (no auth required)
router.use('/products', createProxy(config.services.product));
router.use('/reviews', createProxy(config.services.review));

// Cart routes require authentication
router.use('/cart', authenticate, createProxy(config.services.cart));

// Checkout routes (order, payment, shipping) require authentication
router.use('/orders', authenticate, createProxy(config.services.order));
router.use('/payments', authenticate, createProxy(config.services.payment));
router.use('/shipping', authenticate, createProxy(config.services.shipping));
router.use('/coupons', authenticate, createProxy(config.services.coupon));

// User profile routes require authentication
router.use('/users', authenticate, createProxy(config.services.user));

module.exports = router;