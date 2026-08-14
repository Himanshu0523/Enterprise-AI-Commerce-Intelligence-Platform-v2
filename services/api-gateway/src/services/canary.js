const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Canary Traffic Router
 *
 * Splits incoming traffic between a stable and a canary service version
 * based on a configurable weight (0.0 to 1.0 = % sent to canary).
 *
 * Strategy:
 *   - Weighted random: Math.random() < canaryWeight → canary, else → stable
 *   - Sticky sessions: if X-Canary-Session header is present and equals "true",
 *     pin the request to canary for the duration of that session.
 *   - Sets X-Served-By response header so clients / logs can identify which
 *     version handled the request.
 *
 * Usage:
 *   const { canaryRouter } = require('./canary');
 *   router.use('/pricing', canaryRouter({
 *     stableUrl: 'http://pricing-service:8003',
 *     canaryUrl: 'http://pricing-service-v2:8013',
 *     canaryWeight: 0.05,  // 5% to canary
 *   }));
 */
function canaryRouter({ stableUrl, canaryUrl, canaryWeight = 0.05 }) {
  if (canaryWeight < 0 || canaryWeight > 1) {
    throw new Error(`canaryWeight must be between 0.0 and 1.0, got ${canaryWeight}`);
  }

  const stableProxy = createProxyMiddleware({
    target: stableUrl,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => injectTraceHeaders(proxyReq, req, 'stable'),
      error: (err, req, res) => proxyError(err, req, res, 'stable'),
    },
  });

  const canaryProxy = createProxyMiddleware({
    target: canaryUrl,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => injectTraceHeaders(proxyReq, req, 'canary'),
      error: (err, req, res) => proxyError(err, req, res, 'canary'),
    },
  });

  return (req, res, next) => {
    // Sticky session: if client was already pinned to canary, keep them there
    const stickyCanary = req.headers['x-canary-session'] === 'true';
    const routeToCanary = stickyCanary || Math.random() < canaryWeight;

    const version = routeToCanary ? 'canary' : 'stable';
    res.setHeader('X-Served-By', version);
    res.setHeader('X-Canary-Weight', canaryWeight.toString());

    console.log(
      `[CANARY] ${req.method} ${req.path} → ${version} ` +
      `(weight=${(canaryWeight * 100).toFixed(0)}%, sticky=${stickyCanary}) ` +
      `[corr=${req.correlationId}]`
    );

    if (routeToCanary) {
      return canaryProxy(req, res, next);
    }
    return stableProxy(req, res, next);
  };
}

function injectTraceHeaders(proxyReq, req, version) {
  // W3C Trace Context
  if (req.correlationId) proxyReq.setHeader('x-correlation-id', req.correlationId);
  if (req.traceParent) proxyReq.setHeader('traceparent', req.traceParent);

  // User context
  if (req.user) {
    proxyReq.setHeader('x-user-id', req.user.id || '');
    proxyReq.setHeader('x-user-role', req.user.role || 'guest');
  }

  // Mark which version is serving this request
  proxyReq.setHeader('x-service-version', version);
}

function proxyError(err, req, res, version) {
  console.error(`[CANARY] Proxy error on ${version}: ${err.message} [corr=${req.correlationId}]`);
  res.status(502).json({
    error: 'Bad Gateway',
    serviceVersion: version,
    correlationId: req.correlationId,
  });
}

module.exports = { canaryRouter };
