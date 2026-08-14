/**
 * Hybrid Redis Client for API Gateway
 *
 * Tries to instantiate ioredis. Falls back to a high-fidelity
 * in-memory key-value store with TTL capabilities if Redis is not running or ioredis
 * is not installed.
 */

let client;
let isMock = false;

class MockRedis {
  constructor() {
    this.store = new Map();
    this.ttls = new Map();
    
    // Cleanup expired keys periodically
    setInterval(() => {
      const now = Date.now();
      for (const [key, expiresAt] of this.ttls.entries()) {
        if (expiresAt <= now) {
          this.store.delete(key);
          this.ttls.delete(key);
        }
      }
    }, 5000);
  }

  async get(key) {
    const expiresAt = this.ttls.get(key);
    if (expiresAt && expiresAt <= Date.now()) {
      this.store.delete(key);
      this.ttls.delete(key);
      return null;
    }
    return this.store.get(key) || null;
  }

  async set(key, value, mode, duration) {
    this.store.set(key, String(value));
    if (mode === 'EX' && duration) {
      this.ttls.set(key, Date.now() + duration * 1000);
    }
    return 'OK';
  }

  async incrby(key, amount) {
    const val = parseInt(await this.get(key) || '0', 10);
    const newVal = val + parseInt(amount, 10);
    this.store.set(key, String(newVal));
    return newVal;
  }

  async expire(key, seconds) {
    this.ttls.set(key, Date.now() + seconds * 1000);
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
        isMock = true;
        return null;
      }
      return 1000;
    }
  });

  client.on('error', () => {
    isMock = true;
  });
} catch (e) {
  isMock = true;
}

const activeClient = isMock ? new MockRedis() : client;

console.log(`[GATEWAY-REDIS] Active engine mode: ${isMock ? 'IN-MEMORY MOCK' : 'REAL REDIS'}`);

module.exports = {
  redis: activeClient,
  isMock
};
