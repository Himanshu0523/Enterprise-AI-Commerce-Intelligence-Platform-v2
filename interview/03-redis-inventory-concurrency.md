# 03. Inventory Concurrency, Redis Lua & Rate Limiting

## 1. Flash-Sale Inventory Concurrency
- **Problem**: 100,000 concurrent requests attempting to buy 10 items. Standard database `SELECT stock` $\rightarrow$ `UPDATE stock` causes double-selling and massive row lock contention.

```
Race Condition without Lua:
User A ──► Read Stock (1) ──┐
                            ├─► Both see stock = 1 ──► Both Decrement ──► Stock = -1 (Oversold!)
User B ──► Read Stock (1) ──┘
```

- **Why Redis?**: In-memory speeds (<1ms latency) with single-threaded execution thread.
- **Why Lua Scripting (`reserveStockLua`)?**:
  - Redis executes Lua scripts **atomically** in its single event loop thread.
  - No other command can execute while the Lua script is running.
  - Eliminates network round-trips (Check + Decrement performed in one server-side execution).

```lua
-- reserveStockLua Pseudocode
local stockKey = KEYS[1]
local reqQty = tonumber(ARGV[1])
local currentStock = tonumber(redis.call('GET', stockKey) or "0")

if currentStock >= reqQty then
    redis.call('DECRBY', stockKey, reqQty)
    return 1 -- Success
else
    return 0 -- Out of Stock
end
```

---

## 2. Lock-Free Write-Behind Pattern
- **How it Works**:
  1. Stock is reserved atomically in Redis (`sub-millisecond`).
  2. Inventory Service responds immediately to caller with `Reservation Approved`.
  3. Async queue worker persists the stock decrement to MongoDB in the background.
- **Disaster Recovery**:
  - **Redis Persistence**: Configured with AOF (`fsync everysec`) to prevent data loss on container reboot.
  - **Cold Sync Worker**: On system startup, a background reconciliation job reconciles Redis stock counts against authoritative MongoDB physical inventory tables.

---

## 3. Rate Limiting Architecture
- **Request Rate Limiting (Fixed/Sliding Window in Redis)**:
  - Gateway tracks requests per IP/User: `INCR rate:user_123` with 60s TTL. If count > 100 $\rightarrow$ `429 Too Many Requests`.
- **Token-Aware AI Rate Limiting**:
  - AI requests consume variable compute (e.g. 1 request with a 1,000-word prompt + image consumes more tokens than 10 standard REST queries).
  - Gateway tracks token counts: `20,000 tokens/min` per user tenant.
  - Image uploaded for Visual Search is assigned a fixed weight of `512 tokens`.
