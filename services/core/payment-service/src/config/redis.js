'use strict';

/**
 * @file services/core/payment-service/src/config/redis.js
 *
 * Redis client for payment-service idempotency engine.
 * Reuses the same pattern as inventory-service with in-memory fallback
 * so the service still works without a Redis connection.
 */

let client;
let isMock = false;

// Minimal in-memory mock for idempotency when Redis is unavailable
class MockRedis {
  constructor() {
    this._store = new Map(); // key -> { value, expiresAt }
  }

  _isExpired(entry) {
    return entry.expiresAt && Date.now() > entry.expiresAt;
  }

  async get(key) {
    const entry = this._store.get(key);
    if (!entry || this._isExpired(entry)) {
      this._store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key, value, exFlag, ttlSeconds, nxFlag) {
    const ex = exFlag === 'EX' ? ttlSeconds * 1000 : null;
    const nx = nxFlag === 'NX';

    if (nx && this._store.has(key)) {
      const entry = this._store.get(key);
      if (!this._isExpired(entry)) return null; // NX failed — key exists
      this._store.delete(key); // expired key — allow overwrite
    }

    this._store.set(key, {
      value: String(value),
      expiresAt: ex ? Date.now() + ex : null,
    });
    return 'OK';
  }

  async del(key) {
    this._store.delete(key);
    return 1;
  }
}

try {
  const ioredis = require('ioredis');
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

  client = new ioredis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 2) {
        console.warn('[PAYMENT-REDIS] Falling back to in-memory idempotency store.');
        isMock = true;
        return null;
      }
      return Math.min(times * 100, 2000);
    },
  });

  client.on('error', (err) => {
    if (!isMock) {
      console.warn(`[PAYMENT-REDIS] ${err.message}. Switching to in-memory fallback.`);
      isMock = true;
    }
  });
} catch {
  console.warn('[PAYMENT-REDIS] ioredis not found. Using in-memory fallback.');
  isMock = true;
}

const activeClient = isMock ? new MockRedis() : client;
console.log(`[PAYMENT-REDIS] Mode: ${isMock ? 'IN-MEMORY MOCK' : 'REAL REDIS'}`);

module.exports = activeClient;
