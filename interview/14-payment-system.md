# 14. Payment System Architecture & Double-Spending Defense

## 1. Payment Lifecycle & State Machine
```
   INITIATED ──► AUTHORIZED ──► CAPTURED (SUCCESS)
       │              │              │
       ▼              ▼              ▼
     FAILED        CANCELLED      REFUNDED
```
- **States**: `INITIATED` $\rightarrow$ `AUTHORIZED` $\rightarrow$ `CAPTURED` $\rightarrow$ `REFUNDED` / `FAILED`.
- **Auth & Capture Pattern**:
  - *Authorization*: Customer's credit card funds are reserved (held) when placing the order.
  - *Capture*: Funds are transferred (settled) only when `shipping-service` confirms item dispatch.

---

## 2. Mandatory Killer Interview Scenario: Network Timeout on Payment
**Question**: *Client submits a payment request, payment gateway processes charge successfully, but network connection drops before client receives HTTP response. How do you know whether the customer was charged, and how do you prevent double-charging?*

```
Client ──► POST /api/payments ──► Payment Service ──► Stripe Gateway (SUCCESS)
   ▲                                                       │
   X── Network Timeout / Connection Drop ──────────────────┘
```

- **Step 1: Client Retries with Same `Idempotency-Key`**:
  Client library automatically retries the HTTP call sending header `Idempotency-Key: e87c64b2-38d5...`.
- **Step 2: Redis Distributed Lock Check**:
  Payment Service executes `GET idempotency:e87c64b2-38d5...`. Finds state `COMPLETED` with stored payload `{ status: 200, transactionId: "tx_99182" }`.
- **Step 3: Instant Cached Response**:
  Payment Service returns cached `200 OK` response **without invoking the payment gateway API a second time**.
- **Step 4: Asynchronous Webhook Reconciliation**:
  If client network died completely and never retried, Stripe sends asynchronous `payment_intent.succeeded` webhook to `payment-service`.
- **Step 5: Webhook Signature Verification & State Reconciliation**:
  Payment Service verifies cryptographic signature (`Stripe-Signature` header using HMAC-SHA256 secret key), matches `payment_intent_id`, and updates payment ledger state to `CAPTURED`.

---

## 3. Double-Spending & Reconciliation Ledger
- **Optimistic Locking on Payment Ledger**: Payment document updates enforce strict version checks:
  `db.payments.updateOne({ _id: paymentId, status: 'INITIATED' }, { $set: { status: 'CAPTURED', txId: 'tx_123' } })`.
  If modified count == 0, a concurrent webhook or retry thread already processed the transaction.
- **Daily Reconciliation Job**: Python reconciliation background job compares payment gateway transaction logs against database `payments` collection records to identify any un-captured authorized holds or missing settlement records.
