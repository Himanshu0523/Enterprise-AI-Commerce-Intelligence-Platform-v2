# 02. Domain Design, Checkout Flow & Distributed Saga

## 1. Complete Checkout Flow (Sequence)
```
User ──► Order Service ──► Inventory Service ──► Payment Service ──► Shipping Service
 (1)        (2) PENDING       (3) Reserve           (4) Charge          (5) Label
                                 Stock                 Card                Creation
```
1. **User Action**: Clicks "Place Order" with `Cart ID` + `Idempotency-Key` header.
2. **Order Service**: Creates Order in MongoDB with status `PENDING`. Initiates Distributed Saga Workflow.
3. **Inventory Service**: Reserves stock via Redis Lua allocator (`reserveStockLua`). Returns `STOCK_RESERVED`.
4. **Payment Service**: Charges customer card/intent. Returns `PAYMENT_SUCCESSFUL`.
5. **Shipping & Notification**: Shipping Service generates tracking label; Notification Service dispatches transactional SMS/email; Order status updates to `COMPLETED`.

---

## 2. Distributed Saga Architecture: Orchestration vs Choreography

> [!IMPORTANT]
> **Interviewer Precision (Orchestrator vs Choreography)**: The repository explicitly documents a **Distributed Saga Orchestrator & Eventual Consistency Workflow**. The `Order Service` acts as the Saga Orchestrator, managing the explicit state machine transition (`Order: PENDING` $\rightarrow$ `Inventory: RESERVED` $\rightarrow$ `Payment: PAID` $\rightarrow$ `Order: CONFIRMED`). If an interviewer asks whether it uses Choreography or Orchestration:
> - **Orchestration (Repo Primary)**: `order-service` tracks state machine progress, invokes domain service actions, and triggers explicit compensating calls if downstream steps fail.
> - **Event Streaming Transport**: Services communicate asynchronously over Kafka topics (`order-events`, `inventory-events`, `payment-events`), combining the reliability of Orchestrated Saga state tracking with asynchronous Kafka event streaming.

```
                   ┌───────────────────────────────────┐
                   │    Saga Orchestrator (Order Svc)  │
                   └─────────────────┬─────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│  Inventory Service  │   │   Payment Service   │   │  Shipping Service   │
│   (Reserve Stock)   │   │    (Charge Card)    │   │   (Dispatch Label)  │
└──────────┬──────────┘   └──────────┬──────────┘   └─────────────────────┘
           │                         │
     [Out of Stock]           [Payment Failed]
           │                         │
           ▼                         ▼
  Saga Aborts Checkout    Compensating Transaction:
                          Order Svc Triggers Stock Release
                          (Inventory Svc Restores Stock)
```

---

## 3. Compensating Transactions & Eventual Consistency
- **Failure Scenario: Payment Fails After Stock Reserved**:
  1. `payment-service` fails card charge and returns `PAYMENT_FAILED` status to the Saga event bus.
  2. **Saga Compensating Action**: `order-service` emits `COMPENSATE_INVENTORY` event.
  3. `inventory-service` executes compensating transaction: increments Redis Lua stock counter back (`KEYS[1] + ARGV[1]`) and updates MongoDB inventory.
  4. `order-service` updates order status to `FAILED`.

---

## 4. Payment Idempotency Strategy
- **Problem**: Client network drops trigger retry attempts, potentially causing double charges.
- **Solution (`Idempotency-Key`)**:
  1. Client sends header `Idempotency-Key: <UUID>`.
  2. Payment Service executes Redis check: `SET idempotency:<UUID> "PROCESSING" EX 86400 NX`.
  3. If key exists with result, return cached HTTP `200` response immediately.
  4. If key exists with `"PROCESSING"`, return `409 Conflict`.
