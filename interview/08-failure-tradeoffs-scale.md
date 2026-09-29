# 08. Failure Scenarios, Trade-Offs & 10x/100x Scale

## 1. Top Failure Recovery Scenarios
| Failure Event | System Response & Automated Recovery |
| :--- | :--- |
| **Redis crashes mid-checkout** | Container auto-reboots; state recovered from Redis AOF (`fsync everysec`). In-flight stock requests fail fast; clients retry. |
| **Payment fails after stock reserved** | Choreography Saga emits `PAYMENT_FAILED`. Inventory Service consumes event and executes compensating Redis Lua stock release. |
| **Kafka broker temporarily down** | Services store outgoing events in local database **Transactional Outbox** tables. Outbox poller flushes queued events once Kafka recovers. |
| **Qdrant DB down during RAG call** | Circuit breaker (Opossum) opens. RAG service falls back to basic MongoDB keyword lookup response. |
| **Agent LLM gets stuck in a loop** | LangGraph recursion guard detects step count > 5 $\rightarrow$ terminates loop and returns `422 Unprocessable Entity` with static heuristic. |

---

## 2. Core Architectural Trade-Offs
- **Database-per-Service vs Shared DB**:
  - *Trade-off*: Sacrificed simple SQL cross-table JOINs for true service independence and failure domain isolation.
  - *Mitigation*: Asynchronous event data duplication via Kafka.
- **Write-Behind Redis Inventory vs Write-Through**:
  - *Trade-off*: Sacrificed immediate DB persistence for sub-millisecond stock allocation speed under 100k requests.
  - *Mitigation*: AOF persistence + background sync workers.
- **Eventual Consistency vs Strong Consistency**:
  - *Trade-off*: System accepts eventual consistency across order status/shipping to ensure high availability and sub-second API response times.
  - *Strong Consistency Boundary*: Strictly enforced inside Redis Lua stock decrement and payment idempotency locks.

---

## 3. Scaling Strategy (10x $\rightarrow$ 100x Growth)
```
         10x Growth                             100x Growth
 ┌────────────────────────┐             ┌────────────────────────┐
 │ Gateway Replicas       │             │ Redis Cluster Sharding │
 │ Kafka Partition Scale  │ ──────────► │ Mongo Sharding by SKU  │
 │ Read Replicas (Mongo)  │             │ Ray / vLLM AI Clusters │
 └────────────────────────┘             └────────────────────────┘
```
- **10x Scale**:
  - API Gateway: Scale to 10 instances behind AWS ALB.
  - Kafka: Increase topic partitions from 3 to 12.
  - MongoDB: Provision 3-node Replica Sets with primary/secondary read splitting.
- **100x Scale**:
  - Redis Inventory: Migrate to **Redis Cluster** with slot sharding by SKU Hash (`{sku_123}:stock`).
  - MongoDB: Enable **Sharding** using `{ tenant_id: 1, order_id: 1 }` compound shard key.
  - AI Serving: Offload heavy PyTorch/CLIP inference to a distributed **Ray / vLLM cluster** with GPU autoscale.

---

## 4. Master Technology "Why" Cheat Sheet
- **Next.js 14**: Server-side rendering (SSR) for e-commerce SEO + dynamic caching.
- **Express API Gateway**: Lightweight JS routing, unified header stripping & token rate-limiting.
- **FastAPI**: Async ASGI Python execution for fast ML model inference endpoints.
- **MongoDB**: Flexible JSON schema for dynamic catalog attributes, nested orders & cart objects.
- **Redis Lua**: Lock-free sub-millisecond atomic inventory decrement.
- **Kafka**: Event streaming, partition ordering, replayable CDC event logs.
- **Qdrant**: Vector search with rich payload filtering (price, category, stock).
- **MySQL OLAP**: Normalized relational warehouse for decoupled analytics without impacting MongoDB OLTP.
- **LangGraph**: Cyclic state graph engine with recursion loop & token budget guardrails.
