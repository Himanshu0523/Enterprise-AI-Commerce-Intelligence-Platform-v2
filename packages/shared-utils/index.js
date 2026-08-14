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

module.exports = {
  formatCurrency,
  successResponse,
  errorResponse,
  generateOrderTrackingCode,
  createErrorResponse,
  ErrorCodes,
  idempotencyMiddleware,
};
