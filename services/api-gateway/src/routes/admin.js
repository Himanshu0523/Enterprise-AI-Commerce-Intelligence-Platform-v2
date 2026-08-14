const express = require('express');
const createProxy = require('../services/proxy');
const config = require('../conifg');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireRole('admin'));

// Proxy to admin-specific endpoints
router.use('/products', createProxy(config.services.product));
router.use('/inventory', createProxy(config.services.inventory));
router.use('/orders', createProxy(config.services.order));
router.use('/users', createProxy(config.services.user));
router.use('/coupons', createProxy(config.services.coupon));
router.use('/audit-logs', createProxy(config.services.auditLog));
router.use('/audit', createProxy(config.services.auditLog));

module.exports = router;