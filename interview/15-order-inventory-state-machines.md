# 15. Order & Inventory State Machines

## 1. Explicit Order State Machine
```
                ┌──────────────┐
                │   CREATED    │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │   PENDING    │
                └──────┬───────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
 ┌──────────────┐              ┌──────────────┐
 │     PAID     │              │    FAILED    │
 └──────┬───────┘              └──────────────┘
        │                             ▲
        ▼                             │
 ┌──────────────┐              ┌──────────────┐
 │  CONFIRMED   │              │  CANCELLED   │
 └──────┬───────┘              └──────────────┘
        │
        ▼
 ┌──────────────┐
 │   SHIPPED    │
 └──────┬───────┘
        │
        ▼
 ┌──────────────┐
 │  DELIVERED   │
 └──────────────┘
```

- **Valid Transitions**:
  - `CREATED` $\rightarrow$ `PENDING` $\rightarrow$ `PAID` $\rightarrow$ `CONFIRMED` $\rightarrow$ `SHIPPED` $\rightarrow$ `DELIVERED`.
  - `PENDING` $\rightarrow$ `FAILED` / `CANCELLED`.
- **Enforcement**: State transitions execute via explicit state machine functions:
  ```typescript
  const ALLOWED_TRANSITIONS: Record<OrderState, OrderState[]> = {
    [OrderState.PENDING]: [OrderState.PAID, OrderState.FAILED, OrderState.CANCELLED],
    [OrderState.PAID]: [OrderState.CONFIRMED, OrderState.CANCELLED],
    [OrderState.SHIPPED]: [OrderState.DELIVERED],
    [OrderState.DELIVERED]: [] // Terminal state
  };
  ```
- Any attempt to transition `DELIVERED` $\rightarrow$ `CREATED` throws `422 InvalidStateTransitionError`.

---

## 2. Inventory State Machine & Allocation Ownership
```
  AVAILABLE ──(Reserve Lua)──► RESERVED ──(Ship Order)──► SOLD
      ▲                           │
      └──────(Compensate)─────────┘
```
- **State States**:
  - `AVAILABLE`: Unallocated stock in warehouse.
  - `RESERVED`: Held temporarily for pending checkout (TTL: 15 minutes in Redis).
  - `SOLD`: Finalized upon order shipment.
- **Domain Ownership**:
  - `Order Service` owns Order State; `Inventory Service` owns Inventory State.
  - Services modify state exclusively within their DB boundaries and communicate via Kafka events (`ORDER_CREATED`, `STOCK_RESERVED`, `PAYMENT_FAILED`).
