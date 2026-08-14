const rateLimit = require('express-rate-limit');
const config = require('../config');

// Standard global rate limiter (e.g. 100 requests per 15 mins)
const standardLimiter = rateLimit({
  windowMs: config?.rateLimit?.windowMs || 15 * 60 * 1000,
  max: config?.rateLimit?.max || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Strict rate limiter for sensitive routes (Login, OTP, Payment Charges: 5 requests per 15 mins)
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sensitive requests (login/payment). Please try again in 15 minutes.' },
});

module.exports = {
  standardLimiter,
  strictLimiter,
};