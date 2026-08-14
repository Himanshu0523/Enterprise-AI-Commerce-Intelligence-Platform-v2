# System Design Specification

# Enterprise AI Commerce Intelligence Platform

---

## 1. Microservices Breakdown & Port Allocation

Here is the exact mapping for all deployed microservices in the platform:

| Service Category | Service Name | Protocol | Port | Primary Responsibility |
| :--- | :--- | :---: | :---: | :--- |
| **Gateway** | `api-gateway` | HTTP/REST | `8000` | Single entry point for clients. Routes requests & validates tokens. |
| **Core Domain (10)** | `auth-service` | HTTP/REST | `3001` | JWT, Google OAuth2, Speakeasy TOTP MFA, Kafka events. |
| | `user-service` | HTTP/REST | `3002` | User profiles, addresses, role management. |
| | `product-service` | HTTP/REST | `3003` | Product catalog CRUD, multi-attribute search. |
| | `inventory-service` | HTTP/REST | `3004` | Stock levels, checkout reservations, release logic. |
| | `cart-service` | HTTP/REST | `3005` | User cart persistence & guest cart merging. |
| | `order-service` | HTTP/REST | `3006` | Order processing pipeline & status workflow. |
| | `payment-service` | HTTP/REST | `3007` | Payment transactions, mock gateway, refunds. |
| | `shipping-service` | HTTP/REST | `3008` | Carrier selection, rate calculation, tracking. |
| | `coupon-service` | HTTP/REST | `3009` | Promotional discounts, coupon validation. |
| | `review-service` | HTTP/REST | `3010` | Product ratings, customer reviews, helpfulness votes. |
| **Intelligence (7)** | `rag-service` | HTTP/REST | `8001` | Vector search QA, FAQ assistance, review summary. |
| | `forecast-service` | HTTP/REST | `8002` | Time-series demand forecasting (Prophet/LSTM). |
| | `pricing-service` | HTTP/REST | `8003` | Dynamic price optimization based on demand/stock. |
| | `fraud-service` | HTTP/REST | `8004` | Transaction risk scoring & anomaly detection. |
| | `visual-search-service` | HTTP/REST | `8005` | Image similarity search using CLIP embeddings. |
| | `ml-service` | HTTP/REST | `8006` | Collaborative & content recommendation models. |
| | `agent-service` | HTTP/REST | `8007` | LangChain / LangGraph multi-agent orchestration. |

---

## 2. High-Level Communication Flow

```mermaid
graph TD
    %% Clients
    Client[Web/Mobile Storefront Client] --> Gateway[API Gateway - Port 8000]

    %% Gateway Routes to Core Services
    Gateway --> Auth[Auth Service - Port 3001]
    Gateway --> User[User Service - Port 3002]
    Gateway --> Product[Product Service - Port 3003]
    Gateway --> Cart[Cart Service - Port 3005]
    Gateway --> Order[Order Service - Port 3006]
    Gateway --> Payment[Payment Service - Port 3007]
    Gateway --> Shipping[Shipping Service - Port 3008]
    Gateway --> Coupon[Coupon Service - Port 3009]
    Gateway --> Review[Review Service - Port 3010]

    %% Gateway Routes to AI Intelligence Services
    Gateway --> Pricing[Pricing Service - Port 8003]
    Gateway --> Visual[Visual Search Service - Port 8005]
    Gateway --> RAG[RAG Service - Port 8001]
    Gateway --> ML[ML Service - Port 8006]
    Gateway --> Agent[Agent Service - Port 8007]

    %% Database per Service
    Auth --> AuthDB[(Auth MongoDB)]
    User --> UserDB[(User MongoDB)]
    Product --> ProductDB[(Product MongoDB)]
    Order --> OrderDB[(Order MongoDB)]
    Payment --> PaymentDB[(Payment MongoDB)]

    %% Event Bus for Async Communication
    Auth -- "Emits: USER_REGISTERED" --> Kafka[Kafka Broker]
    Order -- "Emits: ORDER_CREATED" --> Kafka

    %% Data Warehouse ETL
    Kafka --> DataPipeline[Python Data Pipeline]
    AuthDB & OrderDB & ProductDB --> DataPipeline
    DataPipeline --> Warehouse[(MySQL Data Warehouse)]
```