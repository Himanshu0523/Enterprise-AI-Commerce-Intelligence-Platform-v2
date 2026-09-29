const crypto = require('crypto');
const { createErrorResponse, ErrorCodes } = require('./error.schema');
const { idempotencyMiddleware } = require('./idempotency.middleware');

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

const successResponse = (res, data, statusCode = 200, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

const generateOrderTrackingCode = (prefix = 'TRK') => {
  return `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

const internalAuthMiddleware = (req, res, next) => {
  const token = req.headers['x-internal-service-token'];
  const expectedToken = process.env.INTERNAL_SERVICE_TOKEN || 'internal-secret-token-v2';

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing internal service token' });
  }

  try {
    const tokenBuf = Buffer.from(String(token));
    const expectedBuf = Buffer.from(String(expectedToken));
    if (tokenBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(tokenBuf, expectedBuf)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid internal service token' });
    }
  } catch (e) {
    return res.status(401).json({ success: false, error: 'Unauthorized token check failed' });
  }

  next();
};

module.exports = {
  formatCurrency,
  successResponse,
  errorResponse,
  generateOrderTrackingCode,
  createErrorResponse,
  ErrorCodes,
  idempotencyMiddleware,
  internalAuthMiddleware,
};
