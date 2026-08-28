
# Database Design

# AI-Powered E-Commerce Intelligence Platform

---

# 1. Database Architecture Overview

The platform follows a Polyglot Persistence Architecture where different databases are used for different workloads.

```text
                    ┌─────────────────┐
                    │   Frontend UI   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Backend API     │
                    │ Node.js         │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼

 ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
 │ MongoDB     │     │ Qdrant      │     │ Kafka       │
 │ Operational │     │ Vector DB   │     │ Events      │
 └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
        │                   │                   │
        │                   │                   │
        ▼                   ▼                   ▼

 ┌─────────────────────────────────────────────┐
 │            Data Pipeline (ETL)              │
 └───────────────────┬─────────────────────────┘
                     │
                     ▼

           ┌──────────────────────┐
           │ MySQL Warehouse      │
           │ Analytics Database   │
           └──────────┬───────────┘
                      │
                      ▼

          ┌───────────────────────────┐
          │ AI & ML Services          │
          │ Recommendation            │
          │ Forecasting               │
          │ Pricing                   │
          │ Fraud Detection           │
          └───────────────────────────┘
```

---

# 2. Database Responsibilities

| Database | Purpose                  |
| -------- | ------------------------ |
| MongoDB  | Operational transactions |
| MySQL    | Analytics and reporting  |
| Qdrant   | Semantic search and RAG  |
| Kafka    | Event streaming          |

---

# 3. MongoDB Design — Database-per-Service Pattern

Each core microservice owns its **isolated MongoDB database instance**. No cross-service database sharing is permitted — this enforces strict service boundaries, enables independent scaling, and aligns with the Distributed Saga pattern described in [`resilience.md`](resilience.md).

| Microservice | Dedicated Database | Primary Collections |
| :--- | :--- | :--- |
| `auth-service` | `auth_db` | `users`, `refresh_tokens`, `otp_records` |
| `user-service` | `user_db` | `profiles`, `addresses` |
| `product-service` | `product_db` | `products`, `categories` |
| `inventory-service` | `inventory_db` | `inventory`, `reservations` |
| `cart-service` | `cart_db` | `carts` |
| `order-service` | `order_db` | `orders` |
| `payment-service` | `payment_db` | `transactions`, `refunds` |
| `shipping-service` | `shipping_db` | `shipments`, `tracking_events` |
| `coupon-service` | `coupon_db` | `coupons`, `redemptions` |
| `review-service` | `review_db` | `reviews`, `helpfulness_votes` |
| `notification-service` | `notification_db` | `notifications`, `templates` |
| `audit-log-service` | `audit_db` | `audit_logs` |

> ⚠️ **Cross-service data access is strictly prohibited via direct database connections.** Services communicate only through REST API calls or Kafka event streaming. See [`resilience.md`](resilience.md#3-distributed-transactions-saga-pattern-choreography) for cross-service transaction handling via the Choreography Saga pattern.

---

# 3.1 Users Collection

Purpose:

Stores customer and admin accounts.

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password_hash": "...",
  "role": "customer",
  "created_at": "Date",
  "last_login": "Date"
}
```

Indexes:

```text
email (Unique)
created_at
role
```

---

# 3.2 Products Collection

Purpose:

Stores product catalog information.

```json
{
  "_id": "ObjectId",
  "name": "Wireless Mouse",
  "category": "Electronics",
  "price": 799,
  "stock": 120,
  "description": "...",
  "image_url": "...",
  "created_at": "Date",
  "updated_at": "Date"
}
```

Indexes:

```text
category
price
created_at
stock
```

---

# 3.3 Orders Collection

Purpose:

Stores customer purchases.

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "items": [
    {
      "product_id": "ObjectId",
      "quantity": 2,
      "price": 799
    }
  ],
  "total_price": 1598,
  "status": "completed",
  "created_at": "Date"
}
```

Indexes:

```text
user_id
status
created_at
```

---

# 3.4 Cart Collection

Purpose:

Stores temporary shopping cart data.

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "items": [
    {
      "product_id": "ObjectId",
      "quantity": 1
    }
  ],
  "updated_at": "Date"
}
```

Indexes:

```text
user_id
updated_at
```

---

# 3.5 Reviews Collection

Purpose:

Stores product reviews.

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "product_id": "ObjectId",
  "rating": 5,
  "review": "Excellent product",
  "created_at": "Date"
}
```

Indexes:

```text
product_id
user_id
rating
```

---

# 3.6 Events Collection

Purpose:

Tracks customer behavior.

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "product_id": "ObjectId",
  "event_type": "view",
  "timestamp": "Date"
}
```

Event Types:

```text
view
click
search
add_to_cart
purchase
wishlist
```

Indexes:

```text
user_id
product_id
timestamp
event_type
```

---

# 3.7 Inventory Collection

Purpose:

Tracks stock movement.

```json
{
  "_id": "ObjectId",
  "product_id": "ObjectId",
  "available_stock": 120,
  "reserved_stock": 10,
  "updated_at": "Date"
}
```

Indexes:

```text
product_id
updated_at
```

---

# 4. MySQL Warehouse Design

Purpose:

Business Intelligence and Machine Learning.

Architecture:

```text
                 dim_users
                      │
                      │
                      ▼

dim_products ─── fact_orders ─── fact_order_items
      │                │
      │                │
      ▼                ▼

product_metrics   customer_metrics

      │
      ▼

fact_events
```

---

# 4.1 Dimension Tables

## dim_users

Stores customer dimensions.

Columns:

```text
user_id (PK)
name
email
country
created_at
```

---

## dim_products

Stores product dimensions.

Columns:

```text
product_id (PK)
name
category
price
created_at
```

Indexes:

```text
category
price
```

---

# 4.2 Fact Tables

## fact_orders

Columns:

```text
order_id (PK)
user_id (FK)
total_price
status
created_at
```

Indexes:

```text
user_id
created_at
```

---

## fact_order_items

Columns:

```text
id (PK)
order_id (FK)
product_id (FK)
quantity
price
```

Indexes:

```text
order_id
product_id
```

---

## fact_events

Columns:

```text
event_id (PK)
user_id
product_id
event_type
timestamp
```

Indexes:

```text
user_id
product_id
timestamp
```

---

# 5. Analytics Tables

## customer_metrics

Purpose:

Customer segmentation and recommendation.

Columns:

```text
user_id
total_orders
total_spent
average_order_value
last_purchase_date
customer_lifetime_value
```

Used By:

* Recommendation Engine
* Marketing Agent
* Segmentation Models

---

## product_metrics

Purpose:

Product analytics.

Columns:

```text
product_id
total_sales
total_revenue
total_views
conversion_rate
average_rating
```

Used By:

* Recommendation Engine
* Pricing Service
* Analytics Dashboard

---

# 6. Vector Database Design

Database:

```text
Qdrant
```

Collections:

```text
product_embeddings
review_embeddings
faq_embeddings
policy_embeddings
```

Purpose:

* Semantic search
* RAG retrieval
* AI assistant
* Product recommendations
* Visual search

---

# 7. Data Flow

## Order Flow

```text
Customer
    │
    ▼
Backend API
    │
    ▼
MongoDB (Orders)
    │
    ▼
Kafka Event
    │
    ▼
ETL Pipeline
    │
    ▼
MySQL Warehouse
```

---

## Recommendation Flow

```text
Customer
    │
    ▼
Product Page
    │
    ▼
Backend API
    │
    ▼
Recommendation Service
    │
    ▼
MySQL Metrics + MongoDB Data
    │
    ▼
Recommended Products
```

---

## RAG Flow

```text
Products
Reviews
FAQs
Policies
      │
      ▼
Chunking
      │
      ▼
Embeddings
      │
      ▼
Qdrant
      │
      ▼
Retriever
      │
      ▼
LLM Response
```

---

# 8. Scalability Strategy

MongoDB:

* Sharding
* Replica Sets

MySQL:

* Read Replicas
* Partitioning

Qdrant:

* Distributed Collections

Kafka:

* Topic Partitioning

Caching:

* Redis

This architecture supports high transaction throughput while enabling advanced analytics, machine learning, and AI-powered search capabilities.
