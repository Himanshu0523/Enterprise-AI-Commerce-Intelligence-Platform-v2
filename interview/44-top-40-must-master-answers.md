# 44. Top 40 Must-Master Interview Answers (Ultimate Cram Guide)

> **Overview**: This master cheat sheet contains direct, high-density, bullet-proof answers for the 40 most critical interview questions for the **Enterprise AI Commerce Intelligence Platform v2**.

---

### 1. Draw and explain the complete architecture.
- **Answer**: Next.js 14 Storefront/Admin $\rightarrow$ Express API Gateway (:8000) $\rightarrow$ 12 Node.js Core Microservices (Ports 3001-3012) + 7 Python FastAPI AI Microservices (Ports 8001-8007). Core services use Database-per-service (MongoDB) + Redis in-memory allocation. Events stream asynchronously over Kafka, feeding a Python CDC worker updating Qdrant Vector DB, and a daily ETL job loading MySQL OLAP Data Warehouse for business intelligence.

---

### 2. Why microservices?
- **Answer**: Isolated container scaling (`inventory-service` scales 50x during flash sales while `auth-service` remains static), independent deployment cycles, bounded domain contexts, and preventing CPU-heavy Python AI tensor workloads from blocking Node.js async event loops.

---

### 3. Why database-per-service?
- **Answer**: Complete data isolation. Prevents cross-service schema locks and direct database coupling. If `InventoryDB` goes down, product catalog browsing and user authentication remain 100% available.

---

### 4. Why API Gateway?
- **Answer**: Single public entry point on port 8000. Unifies CORS, Helmet security headers, centralized JWT verification, path routing (`/api/v1/orders` $\rightarrow$ `:3006`), correlation ID injection, and token-aware rate limiting.

---

### 5. Explain complete checkout flow.
- **Answer**: User POSTs order $\rightarrow$ `order-service` creates Order (`PENDING`) $\rightarrow$ `inventory-service` reserves stock in Redis via Lua $\rightarrow$ `payment-service` authorizes card charge $\rightarrow$ `shipping-service` generates tracking label $\rightarrow$ Order updates to `COMPLETED` and `notification-service` dispatches email.

---

### 6. Explain inventory reservation.
- **Answer**: Lock-free in-memory reservation. `inventory-service` executes a single-threaded Redis Lua script checking stock count against requested quantity, decrementing stock atomically in sub-milliseconds before writing asynchronously to MongoDB.

---

### 7. Why Redis Lua?
- **Answer**: Redis executes Lua scripts **atomically** in its single-threaded event loop. Eliminates race conditions and network round-trips without expensive distributed database row locks or Redlock overhead.

---

### 8. How does Lua prevent overselling?
- **Answer**: 100,000 requests hit the Redis event loop sequentially. The Lua script evaluates `if stock >= requested_qty then decrement and return 1 else return 0`. No two commands can execute concurrently, ensuring stock never drops below 0.

---

### 9. What happens if Redis succeeds but MongoDB fails?
- **Answer**: Inventory Service retries background MongoDB write via exponential backoff. If permanent failure occurs, a compensating Redis Lua script increments stock back, and the order is marked `FAILED`.

---

### 10. How would you recover inventory?
- **Answer**: Configured Redis Append-Only File (AOF) with `fsync everysec` for container reboot persistence. On cold restarts, a background sync reconciliation job recalculates Redis stock keys against authoritative MongoDB physical inventory records.

---

### 11. Explain Saga.
- **Answer**: Architectural pattern for managing distributed transactions across microservices with isolated databases without 2-Phase Commit (2PC). Uses local database transactions and compensating actions on failure.

---

### 12. Explain compensating transactions.
- **Answer**: Explicit undo actions executed when a downstream Saga step fails. (e.g. If payment fails, Saga invokes Inventory Service to release reserved stock).

---

### 13. What happens when payment fails?
- **Answer**: `payment-service` emits `PAYMENT_FAILED`. Saga Orchestration triggers compensating action: `inventory-service` executes Lua stock release, and `order-service` transitions order status to `FAILED`.

---

### 14. Explain Kafka.
- **Answer**: Distributed append-only event streaming log. Provides high-throughput event publishing, partition-level message ordering, consumer groups, and event replayability.

---

### 15. Kafka vs Redis.
- **Answer**: Kafka is a persistent, partitioned, replayable log for domain events and CDC. Redis is an in-memory key-value store used for sub-millisecond stock allocation, caching, and ephemeral sessions.

---

### 16. Explain Kafka consumer groups and partitions.
- **Answer**: Topic partitions enable parallelism. Each partition within a topic is consumed by exactly one consumer instance within a Consumer Group, ensuring ordered processing per partition.

---

### 17. How do you handle duplicate events?
- **Answer**: Consumers implement **Idempotent Processing**: track processed event UUIDs in Redis (`SET event:<id> EX 86400 NX`). If key exists, ignore event; also enforce database unique constraints.

---

### 18. Explain Kafka CDC → Qdrant.
- **Answer**: MongoDB product changes emit CDC events onto Kafka topic `product-mutations`. `kafka_cdc_worker.py` consumes events and updates vector payload metadata in Qdrant real-time without re-running expensive CLIP embedding models.

---

### 19. Why Qdrant?
- **Answer**: Open-source, high-performance vector DB supporting HNSW indexes and rich JSON payload metadata filtering (filtering vectors by category, price, and `in_stock == true` simultaneously).

---

### 20. Explain complete RAG pipeline.
- **Answer**: User prompt $\rightarrow$ Embedding Generation $\rightarrow$ Qdrant Hybrid Search (Vector + Payload filter) $\rightarrow$ Context Injection into Prompt $\rightarrow$ LLM generation with strict non-hallucination system instructions.

---

### 21. How do you prevent stale RAG answers?
- **Answer**: Kafka CDC pipeline updates Qdrant metadata payloads in real-time when stock/price changes in MongoDB. Out-of-stock items are filtered out during vector retrieval (`in_stock == true`).

---

### 22. Why Prophet/LSTM?
- **Answer**: Prophet captures macro sales seasonality, holiday spikes, and linear trends; LSTM neural networks capture non-linear SKU time-series demand patterns.

---

### 23. Explain recommendation architecture.
- **Answer**: Hybrid filtering in `ml-service` (:8006). Combines Collaborative Filtering (user interaction matrix) + Content-Based Filtering (product metadata similarity) evaluated via NDCG@10.

---

### 24. Explain fraud detection.
- **Answer**: `fraud-service` (:8004) evaluates transaction risk (0-100 score) using purchase velocity, IP/device geolocation mismatch, and transaction magnitude before authorizing payment.

---

### 25. Explain visual search using CLIP.
- **Answer**: User uploads image $\rightarrow$ `visual-search-service` converts image into a 512-dim vector via OpenAI CLIP $\rightarrow$ Queries Qdrant vector space for nearest product image embeddings.

---

### 26. Explain dynamic pricing.
- **Answer**: `pricing-service` (:8003) optimizes SKU prices dynamically based on stock velocity and competitor prices while enforcing strict business margin bounds (min/max price limits).

---

### 27. Explain Agentic AI.
- **Answer**: Autonomous LLM-driven system using tool calls to accomplish multi-step domain tasks (e.g. checking stock, computing discounts, resolving support issues).

---

### 28. Explain LangGraph.
- **Answer**: Cyclic state graph engine for multi-agent workflows. Uses a Supervisor Router node to delegate tasks to specialized worker sub-agents with state persistence.

---

### 29. How do you prevent agent infinite loops?
- **Answer**: Execution depth guard: LangGraph state tracks recursion count. If loop iteration > 5, execution halts and returns `422 Unprocessable Entity` with static heuristic fallback.

---

### 30. Why token-aware rate limiting?
- **Answer**: Standard HTTP request rate limiting fails for AI because 1 LLM request with an image consumes 100x more compute/cost than a simple REST query.

---

### 31. How does the 20,000-token/minute protection work?
- **Answer**: API Gateway calculates request token weight (assigning fixed 512 tokens for image uploads) and tracks consumption per tenant in a Redis token bucket (`20,000 tokens/min`). Returns `429` if exceeded.

---

### 32. Explain authentication.
- **Answer**: Dual JWT pattern. Access Token (15-min expiry, RS256 signed) + Refresh Token (7-day expiry, stored in HTTP-Only SameSite=Strict cookie and Redis).

---

### 33. Explain authorization.
- **Answer**: API Gateway verifies JWT, strips client headers, and injects `x-user-id` & `x-user-role`. Microservices enforce Role-Based Access Control (RBAC: `CUSTOMER`, `ADMIN`, `SERVICE_ACCOUNT`).

---

### 34. Explain distributed tracing.
- **Answer**: OpenTelemetry instrumentation propagating trace context across Express, FastAPI, and Kafka to measure P99 latency and identify bottlenecks across microservice hops.

---

### 35. Explain traceparent.
- **Answer**: W3C standard header (`traceparent: 00-4bf92f...-01`) generated at API Gateway, passing `trace_id` and `parent_span_id` down HTTP and Kafka headers across all 19 services.

---

### 36. Explain OLTP vs OLAP.
- **Answer**: OLTP (MongoDB) handles low-latency transactional writes (checkout/cart). OLAP (MySQL Warehouse) handles complex analytical aggregate queries without impacting production MongoDB API latency.

---

### 37. Explain MongoDB → MySQL ETL.
- **Answer**: Daily Python job (`etl_orders.py`) extracts updated records from MongoDB, flattens nested JSON, transforms IDs, and performs batch idempotent upserts into MySQL star schema (`fact_orders`, `dim_products`).

---

### 38. What happens if any critical service goes down?
- **Answer**: Circuit breakers (Opossum) open to return fallback responses; database isolation keeps unaffected services running; Docker/Kubernetes auto-restarts failed containers.

---

### 39. How do you scale the entire system 10×?
- **Answer**: API Gateway ALB scaling, Redis Cluster sharding by SKU Hash, MongoDB primary/secondary read splitting, and increasing Kafka partitions from 3 to 12.

---

### 40. Redesign for 1 Million Concurrent Flash-Sale Buyers (100×).
- **Answer**: Sub-partition 1 SKU stock key into 10 virtual Redis keys (`stock:sku:p1..p10`), introduce 500ms local RAM micro-caching at Node layer, deploy MongoDB Atlas Proxy, and use vLLM Ray GPU clusters with semantic prompt caching.
