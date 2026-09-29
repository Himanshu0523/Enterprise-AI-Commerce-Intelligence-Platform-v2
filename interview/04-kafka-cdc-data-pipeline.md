# 04. Kafka Streaming, CDC & Data Warehouse ETL

## 1. Kafka Event Bus Architecture
- **Why Kafka?**: High-throughput distributed event log, partition-level message ordering, event replayability for microservice sync and CDC.
- **Partitions & Ordering Guarantee**:
  - Events are partitioned by `order_id` or `product_id`.
  - Guarantees strictly ordered delivery for events belonging to the same entity (e.g. `ORDER_CREATED` $\rightarrow$ `PAYMENT_SUCCESSFUL` $\rightarrow$ `SHIPMENT_DISPATCHED`).
- **Consumer Group Lag**: Monitored via OpenTelemetry. If lag grows, auto-scaler provisions additional consumer instances up to the topic partition count.

---

## 2. Kafka CDC to Qdrant Vector DB Synchronization
- **Problem**: Changing a product's price, discount, or stock in MongoDB leaves vector search (RAG / Visual Search) returning stale metadata.
- **CDC Mechanism**:
  1. MongoDB product updates trigger CDC events to Kafka topic `product-mutations`.
  2. `kafka_cdc_worker.py` (Python worker) consumes mutation events.
  3. Updates Qdrant vector point metadata payload (e.g. `price`, `in_stock`, `category`) without re-running expensive CLIP embedding models unless image/text description changed.

```
MongoDB Update ──► Kafka (`product-mutations`) ──► kafka_cdc_worker.py ──► Qdrant Metadata Update
```

- **Idempotency & Versioning**: Each event carries a `version` timestamp. The worker ignores events with version <= current Qdrant point metadata version (prevents out-of-order state overwrites).

---

## 3. MongoDB (OLTP) vs MySQL (OLAP Warehouse)
- **MongoDB (Transactional Layer)**:
  - **Why?**: Document model allows flexible schema for dynamic product attributes, nested order items, dynamic coupons.
  - **Collections**: `users`, `products`, `orders`, `inventory`, `payments`, `reviews`.
  - **Indexes**: Compound index `{ category: 1, price: 1 }`, TTL index for guest cart expiration.
- **MySQL OLAP Data Warehouse**:
  - **Why OLAP on MySQL?**: Running analytical queries (monthly sales, revenue aggregates) on live MongoDB transactional databases degrades production API throughput.
  - **Star Schema**:
    - Fact Table: `fact_orders` (order_id, user_id, product_id, total_amount, timestamp)
    - Dimension Tables: `dim_products`, `dim_customers`, `dim_time`.
- **ETL Pipeline**: Daily Python ETL job (`etl_orders.py`) extracts modified records from MongoDB, normalizes nested JSON into relational rows, and performs batch upserts into MySQL.
