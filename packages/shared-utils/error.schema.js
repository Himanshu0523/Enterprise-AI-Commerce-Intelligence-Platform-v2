/**
 * Standardized Error Response Contract across Node.js & Python Microservices
 */
const createErrorResponse = (res, statusCode, errorCode, message, details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: res.req ? res.req.originalUrl : undefined,
      traceId: res.req ? res.req.traceId : undefined,
    },
  });
};

module.exports = {
  createErrorResponse,
  ErrorCodes: {
    UNAUTHORIZED: 'AUTH_001',
    FORBIDDEN: 'AUTH_003',
    VALIDATION_FAILED: 'VAL_001',
    RESOURCE_NOT_FOUND: 'RES_404',
    PAYMENT_DECLINED: 'PAY_402',
    OUT_OF_STOCK: 'INV_400',
    INTERNAL_SERVER_ERROR: 'SYS_500',
  },
};
