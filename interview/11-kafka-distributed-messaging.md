# 11. Kafka Deep Dive & Distributed Messaging

## 1. Core Kafka Components
- **Topic**: Category feed to which records are published.
- **Partition**: Unit of parallelism. Messages within a partition are strictly ordered by offset.
- **Offset**: Unique sequential integer assigned to each message within a partition.
- **Consumer Group**: Group of consumers sharing workload. Each partition in a topic is assigned to exactly one consumer within a group.

---

## 2. Partition Strategy & Ordering Guarantees
- **Global vs Partition Ordering**: Kafka guarantees message ordering **only within a single partition**, NOT across topics.
- **Partition Key Selection**:
  - `order-events` topic uses `order_id` as partition key (`hash(order_id) % num_partitions`).
  - Ensures all state transition events for a given order (`ORDER_CREATED`, `PAYMENT_SUCCESSFUL`, `SHIPMENT_DISPATCHED`) land on the exact same partition and process in order.

---

## 3. Producer Delivery Semantics & Idempotency
- **Delivery Guarantees**:
  - *At-Most-Once*: Fire and forget (`acks=0`). Data loss possible.
  - *At-Least-Once*: Retries enabled (`acks=all` / `acks=1`). Duplicates possible. (Used in our platform).
- **Idempotent Producer (`enable.idempotence=true`)**:
  - Assigns a Producer ID (PID) and Sequence Number to every message batch.
  - Kafka broker rejects duplicate sequence numbers, guaranteeing exactly-once persistence to the topic log without duplicate events.

---

## 4. Consumer Resilience: DLQ & Poison Messages
```
Main Topic ──(Error/Retry)──► Retry Topic (Exp Backoff) ──(Max Retries Exceeded)──► Dead Letter Queue (DLQ)
```
- **Poison Messages**: Malformed payload that crashes consumer logic repeatedly.
- **DLQ Flow**:
  1. Consumer catches processing exception; pushes message to `order-events-retry` with delay.
  2. If processing fails 3 times, message is moved to `order-events-dlq`.
  3. Operational alert fires for manual inspection; main topic processing continues unblocked.

---

## 5. Kafka vs Alternatives
| Messaging Tech | Primary Use Case | Why Selected / Rejected |
| :--- | :--- | :--- |
| **Kafka** | Event Streaming & CDC Log | **Selected**: High throughput, log retention, multi-consumer group replayability. |
| **RabbitMQ** | AMQP Task Queuing | *Rejected*: Complex routing, but lacks long-term replayable log for CDC vector sync. |
| **Redis Pub/Sub** | Ephemeral Notification | *Rejected*: No persistence; messages lost if consumer is offline. |
