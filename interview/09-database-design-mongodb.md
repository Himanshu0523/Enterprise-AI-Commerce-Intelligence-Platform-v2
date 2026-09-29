# 09. Database Design & MongoDB Deep Dive

## 1. Database-per-Service Architecture
- **Why Database-per-Service?**: Guarantees domain isolation at the data layer. Eliminates hidden cross-domain dependencies, schema migration locks, and database-level tight coupling.
- **Why Services Cannot Direct Query Another Service's DB**: Direct database queries bypass domain business rules, break security authorization boundaries, create schema coupling, and prevent independent database scaling (e.g. if Order Service directly queries Product DB, Product team cannot change their schema without breaking Order Service).
- **Data Consistency Between Services**: Achieved via **Eventual Consistency** using Kafka event streams. When User profile changes, `user-service` emits `USER_UPDATED`; subscribing services update duplicate snapshot data independently.

---

## 2. Why MongoDB for Transactional Microservices vs PostgreSQL?
- **Why MongoDB?**:
  - *Dynamic Catalog Attributes*: Product catalog items have dynamic, heterogeneous attributes (apparel sizes/colors vs computer RAM/GPU specs). Storing this in relational PostgreSQL requires complex EAV (Entity-Attribute-Value) anti-patterns or frequent ALTER TABLE migrations.
  - *Atomic Single-Document Writes*: Orders contain nested order-items, billing addresses, and shipping details inside a single JSON document. Reading/writing an order requires 1 document operation in MongoDB vs 4+ table JOINs in PostgreSQL.
- **Why Not PostgreSQL for Transactional Core?**: Relational migrations hinder rapid schema iteration across 12 microservices. PostgreSQL is utilized downstream in our MySQL/PostgreSQL OLAP Data Warehouse for structured SQL analytics.

---

## 3. Document Modeling: Embedding vs Referencing
- **Embed When**: 1:1 or 1:Few relationships where data is accessed together and does not grow unbounded (e.g., Order Items inside `Order`, Address array inside `User`).
- **Reference When**: 1:Many or Many:Many relationships where entities are accessed independently or grow unbounded (e.g., `user_id` inside `Order`, `product_id` inside `Review`).
- **N+1 Query Problem**: Occurs when referencing requires querying 1 parent document then firing $N$ individual queries for referenced child documents. Solved in MongoDB using `$lookup` aggregation joins or batching queries with `$in: [id1, id2, ...]`.

---

## 4. Indexing Strategy & Query Optimization (`explain()`)
- **Compound Index**: `{ category: 1, price: 1, createdAt: -1 }` matches queries filtering by category and sorting by price/date.
- **Unique Index**: `{ email: 1 }` on Users, `{ code: 1 }` on Coupons.
- **TTL Index**: `{ createdAt: 1 }` with `expireAfterSeconds: 86400` on ephemeral Guest Carts for automatic cleanup.
- **Query Optimization via `explain("executionStats")`**:
  - `IXSCAN` (Index Scan): Desired state. Ratio `totalKeysExamined : nReturned` $\approx 1:1$.
  - `COLLSCAN` (Collection Scan): Bad state (Full table scan; indicates missing index).

---

## 5. Replica Sets, Read/Write Concerns & Failover
- **Replica Set Architecture**: 1 Primary (Writes), 2 Secondaries (Reads/Failover).
- **Primary Crash Failover**: Secondaries elect a new Primary via Raft-like consensus within 10 seconds. In-flight writes fail fast; clients retry via driver connection pool auto-reconnect.
- **Write Concern `w: majority`**: Guarantees write is committed to a majority of replica set nodes before acknowledging, preventing dirty writes during failovers.
- **Read Concern `majority`**: Prevents reading uncommitted data that could be rolled back if a Primary node crashes.

---

## 6. Must-Answer Interview Attack Questions

### Q: "What happens if Inventory DB goes down?"
- **Answer**: Only inventory management and stock checkout checks are blocked. Product catalog browsing, user authentication, reviews, and cart operations remain fully available due to database-per-service isolation.

### Q: "How do you prevent duplicate order creation?"
- **Answer**: Combined **API Gateway Idempotency Key locking in Redis** (`Idempotency-Key` header) + **Unique Index on `{ idempotencyKey: 1 }`** in MongoDB `orders` collection.

### Q: "How do you handle concurrent database updates?"
- **Answer**: Using **Optimistic Concurrency Control** via document version fields (`__v` / `version`):
  `db.orders.updateOne({ _id: id, version: currentVersion }, { $set: { status: 'PAID' }, $inc: { version: 1 } })`. If modified count == 0, another thread updated the document, triggering a controlled retry.
