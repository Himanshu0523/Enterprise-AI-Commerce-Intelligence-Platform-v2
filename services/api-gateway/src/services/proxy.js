const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Service Proxy Factory
 *
 * Forwards all relevant tracing headers to downstream microservices:
 *   - x-correlation-id  (stable request trace ID)
 *   - traceparent       (W3C Trace Context — compatible with Jaeger/OTEL)
 *   - x-user-id / x-user-role (authenticated user context)
 *
 * For Kafka event publishing, services must read req.headers['x-correlation-id']
 * and attach it as a Kafka message header:
 *   { headers: { 'x-correlation-id': Buffer.from(correlationId) } }
 */
function createServiceProxy(target, options = {}) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: options.pathRewrite || {},
    on: {
      proxyReq: (proxyReq, req) => {
        // ── Distributed Tracing Headers ──────────────────────────────────
        if (req.correlationId) {
          proxyReq.setHeader('x-correlation-id', req.correlationId);
        }
        if (req.traceParent) {
          proxyReq.setHeader('traceparent', req.traceParent);
        }

        // ── Authenticated User Context ───────────────────────────────────
        if (req.user) {
          proxyReq.setHeader('x-user-id', req.user.id || '');
          proxyReq.setHeader('x-user-role', req.user.role || 'guest');
          if (req.user.email) {
            proxyReq.setHeader('x-user-email', req.user.email);
          }
        }
      },

      proxyRes: (proxyRes, req) => {
        // Ensure correlation ID echoes back on response for client logging
        if (req.correlationId && !proxyRes.headers['x-correlation-id']) {
          proxyRes.headers['x-correlation-id'] = req.correlationId;
        }
      },

      error: (err, req, res) => {
        console.error(
          `[PROXY ERROR] ${req.method} ${req.url} → ${target}: ${err.message}`,
          `[corr=${req.correlationId}]`
        );
        res.status(502).json({
          error: { code: 'GATEWAY_502', message: 'Bad Gateway — upstream service unavailable' },
          correlationId: req.correlationId,
        });
      },
    },
  });
}

module.exports = createServiceProxy;