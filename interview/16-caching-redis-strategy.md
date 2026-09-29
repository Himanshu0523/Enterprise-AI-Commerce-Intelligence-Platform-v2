# 16. Caching Strategies & Redis Architecture

## 1. Caching Patterns Used
| Pattern                        | How It Works                                                                                                | Applied In                                              |
| :-------------------------------| :------------------------------------------------------------------------------------------------------------| :--------------------------------------------------------|
| **Cache-Aside (Lazy Loading)** | Application reads Redis first. If cache miss, reads MongoDB, writes result to Redis with TTL, returns data. | Product Catalog Details (`product:123`), User Profiles. |
| **Write-Behind (Write-Back)**  | Application writes directly to Redis. Redis asynchronously persists writes to MongoDB in background.        | Flash-Sale Inventory Decrement (`reserveStockLua`).     |

---

## 2. Preventing Cache Stampede, Penetration & Avalanche
- **Cache Stampede (Thundering Herd)**:
  - *Problem*: High-traffic key expires, 10,000 concurrent requests miss cache simultaneously and hit MongoDB.
  - *Solution*: **Mutual Exclusion Lock (Mutex)** in Redis (`SET lock:product_123 NX EX 5`). Only 1 request fetches from DB; others wait 50ms and retry cache.
- **Cache Penetration**:
  - *Problem*: Malicious queries for non-existent IDs (`product_999999`) bypass cache and overload DB.
  - *Solution*: Cache null results with short TTL (`SET product_999999 "NULL" EX 60`) + **Bloom Filter** at Gateway.
- **Cache Avalanche**:
  - *Problem*: Thousands of keys expire simultaneously causing massive DB load spike.
  - *Solution*: Add random jitter to key TTLs (`TTL = base_ttl + random(0, 300s)`).

---

## 3. Cache Eviction & Memory Policies
- **Eviction Policy**: `allkeys-lru` (Least Recently Used) in Redis configuration.
- **When NOT to Cache**: Ephemeral cart updates (frequently changing), order status during active Saga transitions, payment payment intent secrets.
