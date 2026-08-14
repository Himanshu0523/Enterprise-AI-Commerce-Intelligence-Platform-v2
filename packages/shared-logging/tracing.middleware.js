/**
 * OpenTelemetry / W3C Trace Context Middleware
 * Generates and propagates x-trace-id across microservices for distributed tracing.
 */
const crypto = require('crypto');

const tracingMiddleware = (req, res, next) => {
  const traceId = req.headers['x-trace-id'] || req.headers['traceparent'] || `trace-${crypto.randomUUID()}`;
  req.traceId = traceId;
  res.setHeader('x-trace-id', traceId);

  // Attach traceId to console log metadata context
  req.logMeta = { traceId, path: req.originalUrl, method: req.method };
  next();
};

module.exports = { tracingMiddleware };
