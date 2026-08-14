# 🔄 End-to-End Sequence Diagrams & Failure Flows

## Overview
This document specifies the end-to-end execution flows and failure compensation paths for critical commerce workflows across the **Enterprise AI Commerce Intelligence Platform**.

---

## 1. Successful E-Commerce Checkout Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Gateway as API Gateway (Port 8000)
    participant Cart as Cart Service (Port 3005)
    participant Order as Order Service (Port 3006)
    participant Inv as Inventory Service (Port 3004)
    participant Pay as Payment Service (Port 3007)
    participant Ship as Shipping Service (Port 3008)
    participant Notif as Notification Service (Port 3011)

    Customer->>Gateway: POST /api/orders (Items, Address, Idempotency-Key)
    Gateway->>Order: Create Order Request
    Order->>Order: Save Order (Status: PENDING)
    
    Order->>Inv: Reserve Inventory (SKUs, Quantities)
    Inv-->>Order: 200 Stock Reserved
    
    Order->>Pay: Charge Payment (Token, Amount, Idempotency-Key)
    Pay-->>Order: 200 Payment Authorized (TX_9988)
    
    Order->>Ship: Generate Carrier Tracking Label
    Ship-->>Order: 200 Shipping Label Created (TRK_5544)
    
    Order->>Cart: Clear Customer Active Cart
    Order->>Notif: Send Order Confirmation Email
    Notif-->>Order: 200 Notification Dispatched
    
    Order->>Order: Update Status: COMPLETED
    Order-->>Gateway: 201 Order Completed Response
    Gateway-->>Customer: 201 Order Completed (Order Details + Tracking)
```

---

## 2. Payment Failure & Compensating Refund Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Gateway as API Gateway
    participant Order as Order Service
    participant Inv as Inventory Service
    participant Pay as Payment Service
    participant Audit as Audit Log Service (Port 3012)

    Customer->>Gateway: POST /api/orders (Checkout)
    Gateway->>Order: Create Order Request
    Order->>Order: Save Order (Status: PENDING)
    
    Order->>Inv: Reserve Inventory Stock
    Inv-->>Order: 200 Stock Reserved
    
    Order->>Pay: Charge Payment Token
    Pay-->>Order: 402 Payment Declined (Insufficient Funds)
    
    rect rgb(255, 230, 230)
        Note over Order,Inv: COMPENSATING TRANSACTION TRIGGERED
        Order->>Inv: Release Reserved Stock (Restock SKU)
        Inv-->>Order: 200 Stock Released
        Order->>Audit: Record Order Execution Failure
        Order->>Order: Update Status: PAYMENT_FAILED
    end
    
    Order-->>Gateway: 402 Payment Failed
    Gateway-->>Customer: 402 Card Declined. Please retry with a valid card.
```

---

## 3. Fraud-Flagged Order Suspension Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Gateway as API Gateway
    participant Order as Order Service
    participant Fraud as Fraud Service (Port 8004)
    participant Gate as HITL Approval Gate
    participant Audit as Audit Log Service

    Customer->>Gateway: POST /api/orders (High-Value Order)
    Gateway->>Order: Create Order Request
    Order->>Fraud: Evaluate Transaction Risk
    Fraud->>Fraud: Compute Anomaly Risk Score (Score: 89/100)
    Fraud-->>Order: 200 Risk Flagged (HIGH_RISK)
    
    rect rgb(255, 255, 200)
        Note over Order,Gate: SUSPENSION & HUMAN APPROVAL GATE
        Order->>Order: Update Status: FRAUD_REVIEW_PENDING
        Order->>Gate: Create Merchant Review Task
        Order->>Audit: Log Security Fraud Alert Event
    end
    
    Order-->>Gateway: 202 Order Placed (Under Verification Review)
    Gateway-->>Customer: 202 Order received and pending security verification.
```
