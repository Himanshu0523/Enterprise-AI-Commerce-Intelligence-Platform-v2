/**
 * Idempotency Key Middleware
 * Prevents double-charging or duplicate order creation on network retries.
 */
const processedKeys = new Map(); // Memory fallback cache (in prod backed by Redis)

const idempotencyMiddleware = (ttlMs = 86400000) => {
  return (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'];

    // Only enforce on POST / PUT / PATCH mutating routes
    if (!idempotencyKey || !['POST', 'PUT', 'PATCH'].includes(req.method)) {
      return next();
    }

    const cached = processedKeys.get(idempotencyKey);
    if (cached) {
      console.log(`[IDEMPOTENCY] Cache hit for key: ${idempotencyKey}`);
      return res.status(cached.status).json(cached.body);
    }

    // Capture response method
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        processedKeys.set(idempotencyKey, {
          status: res.statusCode,
          body,
          timestamp: Date.now(),
        });
        // Expire after TTL
        setTimeout(() => processedKeys.delete(idempotencyKey), ttlMs);
      }
      return originalJson(body);
    };

    next();
  };
};

module.exports = { idempotencyMiddleware };
