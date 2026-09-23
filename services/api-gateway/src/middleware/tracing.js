'use strict';

/**
 * @file services/api-gateway/src/middleware/tracing.js
 * @description Enriches OpenTelemetry spans with business-level attributes
 * at the API Gateway level. Adds user context, upstream service routing,
 * and AI endpoint markers to every span.
 */

const { trace, SpanStatusCode } = require('@opentelemetry/api');

/**
 * Express middleware that enriches the active OTel span with gateway-specific
 * attributes. Must be registered AFTER the OTel auto-instrumentation bootstrap.
 */
function gatewayTracingMiddleware(req, res, next) {
  const activeSpan = trace.getActiveSpan();

  if (!activeSpan) return next();

  // ── User context (from JWT-decoded header set by auth middleware) ──────────
  const userId = req.headers['x-user-id'] || 'anonymous';
  const userRole = req.headers['x-user-role'] || 'guest';
  activeSpan.setAttribute('user.id', userId);
  activeSpan.setAttribute('user.role', userRole);

  // ── Route classification ──────────────────────────────────────────────────
  const path = req.path || req.url || '';
  activeSpan.setAttribute('http.route', path);
  activeSpan.setAttribute('gateway.method', req.method);

  // ── Upstream service tagging ──────────────────────────────────────────────
  const upstreamMap = {
    '/api/auth':          'auth-service',
    '/api/users':         'user-service',
    '/api/products':      'product-service',
    '/api/inventory':     'inventory-service',
    '/api/cart':          'cart-service',
    '/api/orders':        'order-service',
    '/api/payments':      'payment-service',
    '/api/shipping':      'shipping-service',
    '/api/coupons':       'coupon-service',
    '/api/reviews':       'review-service',
    '/api/notifications': 'notification-service',
    '/api/audit':         'audit-log-service',
    '/api/search':        'rag-service',
    '/api/agent':         'agent-service',
    '/api/pricing':       'pricing-service',
    '/api/fraud':         'fraud-service',
    '/api/visual-search': 'visual-search-service',
    '/api/forecast':      'forecast-service',
    '/api/ml':            'ml-service',
  };

  const upstream = Object.entries(upstreamMap).find(([prefix]) =>
    path.startsWith(prefix)
  );
  if (upstream) {
    activeSpan.setAttribute('gateway.upstream_service', upstream[1]);
  }

  // ── AI endpoint marker (for cost tracking) ────────────────────────────────
  const AI_PREFIXES = ['/api/agent', '/api/search', '/api/visual-search', '/api/ml'];
  const isAiEndpoint = AI_PREFIXES.some((p) => path.startsWith(p));
  activeSpan.setAttribute('ai.endpoint', isAiEndpoint);

  // ── Response status tagging ───────────────────────────────────────────────
  res.on('finish', () => {
    activeSpan.setAttribute('http.status_code', res.statusCode);
    if (res.statusCode >= 500) {
      activeSpan.setStatus({ code: SpanStatusCode.ERROR });
    }
  });

  next();
}

module.exports = gatewayTracingMiddleware;
