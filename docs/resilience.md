# ⚡ Distributed Systems Resilience & Reliability Architecture

## Overview
This document details the reliability, fault tolerance, idempotency, circuit breaking, and Saga-based distributed transaction patterns implemented across the **Enterprise AI Commerce Intelligence Platform**.

---

## 1. Idempotency Key Strategy (Order & Payment Protection)

To prevent duplicate charges, duplicate order creations, or double inventory reservations during network blips and client retry attempts:

- **`Idempotency-Key` Header**: Clients generate a unique UUID v4 header (`Idempotency-Key: e87c64b2-38d5...`) for all mutating requests (`POST /api/orders`, `POST /api/payments/charge`).
- **Distributed Cache Locking (Redis)**: Microservices check Redis for the key before processing (same Redis instance used by the [Lock-Free Inventory Lua Allocator](../README.md#1-algorithmic-lock-free-in-memory-inventory-allocator-redis-lua-scripts)):
  - **In-Progress Lock**: If a request with the same key is currently processing, concurrent requests receive `409 Conflict`.
  - **Cached Result Return**: If the request previously completed successfully, the stored response (`HTTP 201`) is returned immediately without re-executing logic.

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant PaymentSvc as Payment Service
    participant Redis as Redis Cache

    Client->>PaymentSvc: POST /api/payments/charge [Header: Idempotency-Key: K1]
    PaymentSvc->>Redis: GET idempotency:K1
    alt Key Not Found
        PaymentSvc->>Redis: SET idempotency:K1 state="PROCESSING" EX=86400
        PaymentSvc->>PaymentSvc: Charge Gateway
        PaymentSvc->>Redis: SET idempotency:K1 state="COMPLETED" response={status: 200, txId: "TX123"}
        PaymentSvc-->>Client: 200 OK (Payment Processed)
    else Key Found (Retried Request)
        Redis-->>PaymentSvc: Cached Response {txId: "TX123"}
        PaymentSvc-->>Client: 200 OK (Cached - No Re-charge)
    end
```

---

## 2. Circuit Breakers, Timeouts, & Cascading Failure Isolation

To prevent a slow AI inference engine (e.g. `agent-service` or `visual-search-service`) from exhausting connection pools and taking down the API Gateway:

- **Request Timeout Limits**:
  - Standard REST microservices: **3.0s Timeout**
  - AI Inference / RAG services: **5.0s Timeout**
- **Circuit Breaker Tiers (Opossum Pattern)**:
  - **Error Threshold**: If 50% of requests fail or timeout within a 10-second window, the circuit **OPENS**.
  - **Fallback Execution**: Subsequent requests immediately return cached fallbacks (e.g. static recommendations or default search results) instead of waiting.
  - **Half-Open Probe**: After a 30-second reset timeout, a probe request tests the health of the downstream AI service.

---

## 3. Distributed Transactions: Saga Pattern (Choreography)

Because microservices have isolated databases (Database-per-Service pattern), cross-service checkout transactions use a **Choreography Saga via Kafka Event Streaming** with automated compensating transactions on failure.

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Order as Order Service
    participant Inv as Inventory Service
    participant Pay as Payment Service
    participant Ship as Shipping Service
    participant Bus as Kafka Event Bus

    Client->>Order: Create Order
    Order->>Order: Save Order (Status: PENDING)
    Order->>Bus: Emit ORDER_CREATED

    Bus->>Inv: Consume ORDER_CREATED
    alt Stock Available
        Inv->>Inv: Reserve Stock
        Inv->>Bus: Emit STOCK_RESERVED
    else Out of Stock
        Inv->>Bus: Emit STOCK_RESERVATION_FAILED
        Bus->>Order: Consume STOCK_RESERVATION_FAILED
        Order->>Order: Mark Order CANCELLED
    end

    Bus->>Pay: Consume STOCK_RESERVED
    alt Payment Succeeded
        Pay->>Pay: Charge Customer
        Pay->>Bus: Emit PAYMENT_SUCCESSFUL
    else Payment Failed
        Pay->>Bus: Emit PAYMENT_FAILED
        Bus->>Inv: Consume PAYMENT_FAILED
        Inv->>Inv: Compensating Tx: Release Stock
        Bus->>Order: Consume PAYMENT_FAILED
        Order->>Order: Mark Order FAILED
    end

    Bus->>Ship: Consume PAYMENT_SUCCESSFUL
    Ship->>Ship: Create Shipping Label
    Ship->>Bus: Emit SHIPMENT_DISPATCHED
    Bus->>Order: Consume SHIPMENT_DISPATCHED
    Order->>Order: Mark Order COMPLETED
```

---

## 4. Expanded Event-Driven Architecture (Kafka Integration)

Every major domain event is published to dedicated Kafka topics to ensure eventual consistency:

| Domain Event | Emitting Service | Subscribing Services | Eventual Consistency Action |
| :--- | :--- | :--- | :--- |
| `ORDER_CREATED` | `order-service` | `inventory-service`, `fraud-service`, `data-pipeline` | Reserve stock, score fraud risk, log ETL. |
| `STOCK_RESERVED` | `inventory-service` | `payment-service` | Trigger payment charge workflow. |
| `PAYMENT_SUCCESSFUL` | `payment-service` | `shipping-service`, `order-service` | Generate tracking label, update order state to `PROCESSING`. |
| `PAYMENT_FAILED` | `payment-service` | `inventory-service`, `order-service` | **Compensating Tx**: Release reserved stock, mark order `FAILED`. |
| `SHIPMENT_DISPATCHED` | `shipping-service` | `user-service`, `order-service` | Send customer email notification, mark order `SHIPPED`. |
| `FRAUD_FLAGGED` | `fraud-service` | `order-service`, `payment-service` | Freeze order settlement, require manual merchant review. |
