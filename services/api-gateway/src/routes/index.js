const express = require('express');
const createProxy = require('../services/proxy');
const { canaryRouter } = require('../services/canary');
const config = require('../config');
const storefrontRoutes = require('./storefront');
const adminRoutes = require('./admin');

const router = express.Router();

router.use('/auth', createProxy(config.services.auth));

// Canary deployment: 5% of pricing traffic routed to v2 for safe rollout.
// Adjust PRICING_CANARY_WEIGHT env var (0.0 - 1.0) to control traffic split.
// Set PRICING_SERVICE_V2_URL to point to the new service instance.
router.use('/pricing', canaryRouter({
  stableUrl: config.services.pricing || 'http://localhost:8003',
  canaryUrl: process.env.PRICING_SERVICE_V2_URL || 'http://localhost:8013',
  canaryWeight: parseFloat(process.env.PRICING_CANARY_WEIGHT || '0.05'),
}));

const tokenRateLimiter = require('../middleware/tokenRateLimiter');

router.use('/storefront', storefrontRoutes);
router.use('/admin', adminRoutes);

// AI & Agent routes protected by Token-Aware Rate Limiter
router.use('/support', tokenRateLimiter, createProxy(config.services.rag));
router.use('/agent', tokenRateLimiter, createProxy(config.services.agent));

module.exports = router;