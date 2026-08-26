/**
 * Global Error Handler Middleware for API Gateway
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[GATEWAY ERROR] ${req.method} ${req.originalUrl || req.url} - ${statusCode}: ${message}`, err.stack || '');
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || (statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 403 ? 'FORBIDDEN' : statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR'),
      message: message,
    },
    correlationId: req.correlationId || req.headers?.['x-correlation-id'] || null,
  });
};

module.exports = errorHandler;
