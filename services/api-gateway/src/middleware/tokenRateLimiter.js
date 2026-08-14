/**
 * Token-Aware Rate Limiter Middleware
 *
 * Implements a sliding window token-rate limiter in Redis.
 * Instead of raw HTTP requests, it calculates the exact Input and Output tokens consumed
 * by users/AI agents. Prevents recursive loops and malicious flooding of LLM API budgets.
 */

const { redis } = require('../utils/redis');

// Rate limit configuration
const WINDOW_SIZE_SECONDS = 60;
const DEFAULT_TOKEN_BUDGET = 20000; // 20k tokens per minute

// Estimate tokens using standard character-to-token ratio (approx 4 chars per token)
function estimateTextTokens(text) {
  if (!text || typeof text !== 'string') return 0;
  return Math.ceil(text.length / 4);
}

// Intercepts and parses incoming payloads to estimate input tokens
function estimateInputTokens(req) {
  let tokens = 0;

  // 1. Text payload estimation
  if (req.body) {
    const textFields = ['query', 'prompt', 'text', 'message', 'input'];
    textFields.forEach(field => {
      if (req.body[field]) {
        tokens += estimateTextTokens(req.body[field]);
      }
    });

    // Check nested/array messages (e.g. OpenAI chat format)
    if (Array.isArray(req.body.messages)) {
      req.body.messages.forEach(m => {
        if (m.content) tokens += estimateTextTokens(m.content);
      });
    }
  }

  // 2. Multi-modal image token estimation
  // Vision models consume significant fixed tokens per image (e.g. CLIP is ~512 tokens)
  if (req.files || req.file) {
    const files = req.files ? Object.values(req.files).flat() : [req.file];
    tokens += files.length * 512;
  }

  // Base minimum transaction cost
  return Math.max(10, tokens);
}

const tokenRateLimiter = async (req, res, next) => {
  // Use IP or User ID for rate limiting
  const clientId = req.headers['x-user-id'] || req.ip;
  const redisKey = `token_limiter:${clientId}`;

  try {
    const inputTokens = estimateInputTokens(req);

    // 1. Fetch current usage from Redis
    const currentUsageStr = await redis.get(redisKey);
    const currentUsage = currentUsageStr ? parseInt(currentUsageStr, 10) : 0;

    // 2. Check if the incoming request exceeds the token budget
    if (currentUsage + inputTokens > DEFAULT_TOKEN_BUDGET) {
      console.warn(`[TOKEN RATE LIMITER] Client ${clientId} blocked. Requested: ${inputTokens} tokens, Used: ${currentUsage}/${DEFAULT_TOKEN_BUDGET} tokens.`);
      
      res.setHeader('Retry-After', WINDOW_SIZE_SECONDS);
      return res.status(429).json({
        success: false,
        error: {
          code: 'TOKEN_BUDGET_EXCEEDED',
          message: `Rogue AI Loop / Rate limit exceeded. You have consumed ${currentUsage} of your ${DEFAULT_TOKEN_BUDGET} token budget. Action blocked to protect cloud billing limits.`,
          budget: DEFAULT_TOKEN_BUDGET,
          currentUsage,
        }
      });
    }

    // 3. Temporarily deduct input tokens
    if (currentUsage === 0) {
      await redis.set(redisKey, inputTokens, 'EX', WINDOW_SIZE_SECONDS);
    } else {
      await redis.incrby(redisKey, inputTokens);
    }

    // ── Response Interceptor: Capture Output Tokens ─────────────────────────
    const originalSend = res.send;
    res.send = function (body) {
      res.send = originalSend; // Restore
      
      try {
        let outputTokens = 0;
        
        // Try parsing JSON output
        if (typeof body === 'string') {
          try {
            const parsed = JSON.parse(body);
            const outputFields = ['answer', 'response', 'result', 'output', 'text'];
            outputFields.forEach(field => {
              if (parsed[field]) {
                outputTokens += estimateTextTokens(String(parsed[field]));
              }
              // Nested results (e.g. multi-modal search match descriptions)
              if (Array.isArray(parsed.results)) {
                parsed.results.forEach(item => {
                  if (item.name) outputTokens += estimateTextTokens(item.name);
                });
              }
            });
          } catch (e) {
            outputTokens = estimateTextTokens(body);
          }
        } else if (body && typeof body === 'object') {
          const outputFields = ['answer', 'response', 'result', 'output', 'text'];
          outputFields.forEach(field => {
            if (body[field]) {
              outputTokens += estimateTextTokens(String(body[field]));
            }
          });
        }

        // Increment output usage in Redis asynchronously
        if (outputTokens > 0) {
          redis.incrby(redisKey, outputTokens).catch(() => {});
        }
      } catch (err) {
        console.error('[TOKEN RATE LIMITER] Error counting output tokens:', err);
      }

      return originalSend.call(this, body);
    };

    next();
  } catch (error) {
    console.error('[TOKEN RATE LIMITER] Error executing rate limiting:', error);
    next(); // Fail-safe to avoid blocking system on Redis failures
  }
};

module.exports = tokenRateLimiter;
