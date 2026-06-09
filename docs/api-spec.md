
# API Specification (v1.0)

## Base URLs

### Backend API

```http
/api/v1
```

### AI Services

```http
http://localhost:8000
```

---

# Authentication Module

Authentication and authorization services.

## Register User

```http
POST /auth/register
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "message": "User registered successfully"
}
```

---

## Login

```http
POST /auth/login
```

### Response

```json
{
  "token": "JWT_TOKEN",
  "user": {}
}
```

---

## Get Current User

```http
GET /auth/me
```

Authorization Required

---

## Logout

```http
POST /auth/logout
```

---

# User Module

## Get User Profile

```http
GET /users/profile
```

---

## Update Profile

```http
PUT /users/profile
```

---

## Change Password

```http
PUT /users/change-password
```

---

# Product Module

## Get Products

```http
GET /products
```

### Query Parameters

```text
category
minPrice
maxPrice
search
page
limit
sort
```

---

## Get Product By ID

```http
GET /products/:id
```

---

## Create Product

```http
POST /products
```

Admin Only

---

## Update Product

```http
PUT /products/:id
```

Admin Only

---

## Delete Product

```http
DELETE /products/:id
```

Admin Only

---

## Upload Product Image

```http
POST /products/:id/images
```

---

# Cart Module

## Get Cart

```http
GET /cart
```

---

## Add To Cart

```http
POST /cart/add
```

### Request

```json
{
  "productId": "123",
  "quantity": 2
}
```

---

## Update Cart Item

```http
PUT /cart/update
```

---

## Remove Cart Item

```http
DELETE /cart/remove/:productId
```

---

## Clear Cart

```http
DELETE /cart/clear
```

---

# Order Module

## Create Order

```http
POST /orders
```

### Request

```json
{
  "items": [
    {
      "productId": "123",
      "quantity": 2
    }
  ]
}
```

---

## Get My Orders

```http
GET /orders/my-orders
```

---

## Get Order Details

```http
GET /orders/:id
```

---

## Update Order Status

```http
PUT /orders/:id/status
```

Admin Only

---

# Inventory Module

## Get Inventory

```http
GET /inventory
```

---

## Update Stock

```http
PUT /inventory/:productId
```

---

## Low Stock Alerts

```http
GET /inventory/low-stock
```

---

# Review Module

## Create Review

```http
POST /reviews
```

---

## Get Product Reviews

```http
GET /reviews/product/:productId
```

---

## Delete Review

```http
DELETE /reviews/:id
```

---

# Analytics Module

## Revenue Analytics

```http
GET /analytics/revenue
```

---

## Product Analytics

```http
GET /analytics/products
```

---

## Customer Analytics

```http
GET /analytics/customers
```

---

## Conversion Analytics

```http
GET /analytics/conversion
```

---

## Sales Trends

```http
GET /analytics/trends
```

---

# Recommendation Service

## Personalized Recommendations

```http
GET /ai/recommendations/:userId
```

### Response

```json
{
  "recommendations": []
}
```

---

## Similar Products

```http
GET /ai/similar-products/:productId
```

---

## Frequently Bought Together

```http
GET /ai/frequently-bought/:productId
```

---

# Customer Segmentation Service

## Predict Segment

```http
GET /ai/segmentation
```

### Query Parameters

```text
total_spent
total_orders
recency_days
```

---

# Forecast Service

## Product Demand Forecast

```http
GET /ai/forecast/:productId
```

---

## Sales Forecast

```http
GET /ai/sales-forecast
```

---

# Dynamic Pricing Service

## Pricing Recommendation

```http
GET /pricing/recommend/:productId
```

---

## Pricing Analytics

```http
GET /pricing/analytics
```

---

# Fraud Detection Service

## Fraud Risk Score

```http
POST /fraud/check
```

### Request

```json
{
  "userId": "123",
  "orderId": "456"
}
```

---

## Fraud Alerts

```http
GET /fraud/alerts
```

Admin Only

---

# RAG Service

## Product Question Answering

```http
POST /rag/ask
```

### Request

```json
{
  "question": "Which laptop is best for gaming?"
}
```

---

## Product Knowledge Search

```http
GET /rag/search
```

### Query

```text
query
```

---

# Agent Service

## AI Shopping Assistant

```http
POST /agent/chat
```

### Request

```json
{
  "message": "Suggest a laptop under 80000"
}
```

---

## Inventory Agent

```http
GET /agent/inventory-insights
```

---

## Pricing Agent

```http
GET /agent/pricing-insights
```

---

## Marketing Agent

```http
GET /agent/marketing-insights
```

---

# Visual Search Service

## Upload Product Image

```http
POST /visual-search/upload
```

Content-Type:

```text
multipart/form-data
```

---

## Find Similar Products

```http
POST /visual-search/search
```

### Response

```json
{
  "similar_products": []
}
```

---

# Admin Dashboard APIs

## Dashboard Summary

```http
GET /admin/dashboard
```

---

## KPI Metrics

```http
GET /admin/kpis
```

---

## Revenue Overview

```http
GET /admin/revenue
```

---

## User Growth

```http
GET /admin/user-growth
```

---

## Inventory Insights

```http
GET /admin/inventory-insights
```

---

# Health Check APIs

## Backend Health

```http
GET /health
```

---

## ML Service Health

```http
GET /ml/health
```

---

## RAG Service Health

```http
GET /rag/health
```

---

## Agent Service Health

```http
GET /agent/health
```

---

# Security Standards

## Authentication

```text
JWT Authentication
```

## Authorization

```text
Role Based Access Control (RBAC)
```

Roles:

```text
Admin
Customer
```

## API Security

```text
HTTPS
Rate Limiting
Input Validation
Password Hashing
CORS Protection
```

---

# API Response Format

## Success Response

```json
{
  "success": true,
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```
