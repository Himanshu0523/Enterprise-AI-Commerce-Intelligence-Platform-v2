# 48. Project-Derived System Design Architecture Blueprints

> **Overview**: Step-by-step system design blueprints and architectural specifications for all major system design questions derived from the **Enterprise AI Commerce Intelligence Platform v2**.

---

## 1. System Design: Flash-Sale & Inventory Reservation System

### 1. Requirements & Back-of-the-Envelope
- **Requirements**: 1,000,000 buyers targeting 10,000 units of a viral SKU. Latency < 100ms. **Zero overselling**.
- **Metrics**: 20,000 Peak Order QPS. Payload size = 2 KB. Network Ingress = 40 Mbps.

### 2. High-Level Architecture
```
Client ──► API Gateway (:8000) ──► Inventory Service ──► Redis Lua (Atomic Reservation)
                                                                 │
                                                                 ▼
                                                        Async Kafka Event
                                                                 │
                                                                 ▼
                                                        MongoDB Outbox Sync
```

### 3. Core Component Design
- **Single-Threaded Redis Lua Script (`reserveStockLua`)**: Atomic stock decrement inside Redis event loop. Prevents overselling without DB row locking.
- **Write-Behind Persistence**: Stock decrement is committed instantly in Redis memory; an async queue worker updates MongoDB in background.
- **Hot-Key Stock Partitioning**: Split SKU into 10 virtual keys (`stock:sku_123:p1..p10`) to spread single-core Redis load across shards.

---

## 2. System Design: Distributed Checkout & Payment System

### 1. High-Level Architecture
```
Client ──► Order Service (Saga Orchestrator)
                 │
                 ├──(1. Reserve Stock)──► Inventory Service (Redis Lua)
                 │
                 ├──(2. Charge Intent)──► Payment Service ──► Stripe Gateway
                 │                                │
                 │                         (Stripe Webhook)
                 │                                │
                 └──(3. Complete Order)──► Shipping Service
```

### 2. Idempotency & Failure Resolution
- **Idempotency Key Header**: Clients generate UUID `Idempotency-Key`. Payment Service locks key in Redis (`SET idempotency:<uuid> PROCESSING EX 86400 NX`). Retried requests receive stored response without double-charging card.
- **Saga Compensation**: If payment fails, `payment-service` emits `PAYMENT_FAILED`. `order-service` triggers compensating action: `inventory-service` executes Lua script restoring stock, and order state updates to `FAILED`.

---

## 3. System Design: Kafka CDC & Vector-Search Data Pipeline

### 1. High-Level Architecture
```
MongoDB (OLTP Mutations) ──► Kafka Topic (`product-mutations`) ──► kafka_cdc_worker.py ──► Qdrant Vector DB
```

### 2. Synchronization Mechanics
- **Real-Time Vector Payload Sync**: MongoDB product price/stock changes generate Change Streams $\rightarrow$ Kafka topic `product-mutations`.
- **`kafka_cdc_worker.py` (Python)**: Consumes events, verifies event sequence version timestamp, and updates Qdrant vector metadata payload without re-running expensive CLIP vector embedding models.
- **Tombstone Deletions**: Deleting a product in MongoDB emits a deletion CDC event, removing point vector IDs from Qdrant.

---

## 4. System Design: RAG & Multi-Agent Commerce Assistant

### 1. High-Level Architecture
```
User Prompt ──► Express Gateway ──► LangGraph Agent Service (:8007)
                                              │
                                              ▼
                                      Supervisor Router
                                    /        │        \
                             Pricing     Inventory  Support Agent
                                             │
                                             ▼
                                     Qdrant Hybrid Search
```

### 2. AI Guardrail Controls
- **Recursion Guard**: LangGraph state tracks step depth. If iteration count > 5, execution halts returning `422 Unprocessable Entity` with static heuristic response.
- **Session Budget Control**: Atomic Redis counter tracks total spend per user session; halts execution when session spend exceeds `$0.05`.
- **Token-Aware Limiter**: API Gateway calculates input tokens + fixed 512 image tokens, enforcing `20,000 tokens/min` per tenant limit.

---

## 5. System Design: Analytics Warehouse & Data ETL Pipeline

### 1. High-Level Architecture
```
MongoDB (OLTP) ──► Kafka Event Stream ──► etl_orders.py (Python) ──► MySQL Data Warehouse (Star Schema)
```

### 2. Data Warehouse Design
- **Fact Table (`fact_orders`)**: Order measurements (`total_amount`, `discount`, `quantity`) + Foreign Keys to dimensions.
- **Dimension Tables**: `dim_products` (SKU, brand, SCD Type 2 price validation), `dim_customers`, `dim_time`.
- **ETL Idempotency & Checkpointing**: Python worker records processing checkpoint timestamps (`etl_checkpoints`). Re-running job re-reads from last successful timestamp, executing upserts (`ON DUPLICATE KEY UPDATE`) without duplicating rows.

---

## 6. System Design: Real-Time Fraud Detection & Dynamic Pricing Engine

### 1. High-Level Architecture
```
Checkout Request ──► Fraud Service (:8004) ──► Anomaly Risk Score (0-100) ──► Approved / Blocked
                           │
Catalog Request  ──► Pricing Service (:8003) ──► Dynamic Margin Pricing ──► Price Output
```

### 2. Feature & Model Architecture
- **Fraud Detection**: Evaluates purchase velocity, IP/device geolocation mismatch, and transaction magnitude. Uses fallback rule engine if ML model latency exceeds 100ms.
- **Dynamic Pricing**: Evaluates inventory stock depth, sales velocity, and competitor price feeds, applying pricing bounds (min/max profit margin rules) to prevent price oscillations.
