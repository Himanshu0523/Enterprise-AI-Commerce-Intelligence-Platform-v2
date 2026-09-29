'use strict';

/**
 * @file services/core/payment-service/src/middleware/idempotency.middleware.js
 *
 * Redis-Backed Idempotency Engine for payment-service.
 *
 * Prevents duplicate payment charges when clients retry requests.
 * Uses Redis with atomic SET NX EX to store request status and cached responses.
 *
 * Flow:
 *   1. Client sends X-Idempotency-Key: <uuid> header with every mutation.
 *   2. If key is PROCESSING → 409 Conflict (another request is in-flight).
 *   3. If key is COMPLETED  → 200 with cached response (no re-processing).
 *   4. If key absent        → SET key PROCESSING (atomic NX), allow request through.
 *   5. After handler finishes → update key to COMPLETED with response body cached.
 *
 * TTL: 24 hours (keys auto-expire, no manual cleanup needed)
 */

const redis = require('../config/redis');

const IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60; // 24 hours
const PREFIX = 'idem:payment:';

/**
 * Build the Redis key for a given idempotency key.
 * @param {string} key
 * @returns {string}
 */
function redisKey(key) {
  return `${PREFIX}${key}`;
}

/**
 * Express middleware that enforces idempotency on POST /api/payments/process.
 * Must be registered BEFORE the route handler.
 */
async function idempotencyMiddleware(req, res, next) {
  // Only apply to state-mutating requests
  if (req.method !== 'POST') return next();

  const idempotencyKey = req.headers['x-idempotency-key'];

  if (!idempotencyKey) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VAL_IDEM_001',
        message: 'X-Idempotency-Key header is required for payment requests. Generate a UUID v4 on the client and retry.',
      },
    });
  }

  const rKey = redisKey(idempotencyKey);

  try {
    // Attempt atomic: SET key PROCESSING EX ttl NX
    // NX = only set if key does NOT exist
    const set = await redis.set(rKey, 'PROCESSING', 'EX', IDEMPOTENCY_TTL_SECONDS, 'NX');

    if (set === null) {
      // Key already exists — check its current state
      const existing = await redis.get(rKey);

      if (existing === 'PROCESSING') {
        // Another request is currently processing this key
        return res.status(409).json({
          success: false,
          error: {
            code: 'IDEM_409',
            message: 'A payment with this idempotency key is already being processed. Retry after a few seconds.',
            idempotencyKey,
          },
        });
      }

      // Key is COMPLETED — parse and return cached response
      try {
        const cached = JSON.parse(existing);
        console.log(`[IDEMPOTENCY] Cache hit for key=${idempotencyKey}, returning cached payment response.`);
        return res.status(200).json({
          ...cached,
          idempotencyHit: true,
        });
      } catch {
        // Corrupted cache entry — allow re-processing
        await redis.del(rKey);
        await redis.set(rKey, 'PROCESSING', 'EX', IDEMPOTENCY_TTL_SECONDS);
      }
    }

    // Key was newly set to PROCESSING — intercept res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      // Only cache successful responses (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await redis.set(rKey, JSON.stringify(body), 'EX', IDEMPOTENCY_TTL_SECONDS);
          console.log(`[IDEMPOTENCY] Cached response for key=${idempotencyKey} (TTL: 24h)`);
        } catch (cacheErr) {
          console.error(`[IDEMPOTENCY] Failed to cache response: ${cacheErr.message}`);
          // Don't block response on cache failure
          await redis.del(rKey).catch(() => {});
        }
      } else {
        // On error, delete the PROCESSING key so retries are allowed
        await redis.del(rKey).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  } catch (redisErr) {
    // Redis unavailable — degrade gracefully, allow request through without idempotency
    console.error(`[IDEMPOTENCY] Redis error: ${redisErr.message}. Degrading gracefully — request will proceed without idempotency guarantee.`);
    next();
  }
}

module.exports = idempotencyMiddleware;
