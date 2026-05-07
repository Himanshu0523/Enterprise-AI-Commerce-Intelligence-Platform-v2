# API Specification (v1.0)

Base URL: `/api/v1` (Backend) | `http://localhost:8000` (ML Service)

---

## 1. Authentication Service
Handle user identity and security.

### Register User
`POST /auth/register`
*   **Body:** `{ name, email, password }`
*   **Response:** `201 Created` - `{ message: "User created", user: { ... } }`

### Login & Session
`POST /auth/login`
*   **Body:** `{ email, password }`
*   **Response:** `200 OK` - `{ token: "JWT_TOKEN", user: { ... } }`

---

## 2. Product Management
Handle the e-commerce catalog.

### Get All Products
`GET /products`
*   **Query Params:** `category`, `minPrice`, `maxPrice` (Optional)
*   **Response:** List of product objects.

### Create Product (Admin)
`POST /products`
*   **Body:** `{ name, category, price, stock, description }`

### Update/Delete
*   `PUT /products/:id`
*   `DELETE /products/:id`

---

## 3. Order Processing
Handle transactions and fulfillment.

### Create New Order
`POST /orders`
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Body:** `{ items: [{ productId, quantity }], total_price }`
*   **Action:** Triggers reduction in inventory and logs transaction.

### Get User Orders
`GET /orders/my-orders`
*   **Headers:** `Authorization: Bearer <TOKEN>`

---

## 4. AI & Insights Service
Powered by the **FastAPI ML Microservice**.

### Personalized Recommendations
`GET /ai/recommendations/:userId` [ML Service]
*   **Details:** Uses Matrix Factorization to suggest 5 products.
*   **Response:** `{ user_id, recommendations: [pid1, pid2, ...] }`

### Demand Forecasting
`GET /ai/forecast/:productId` [ML Service]
*   **Details:** Predicts the next 7 days of sales for a product.
*   **Response:** `{ product_id, forecast: [{ day_ahead, predicted_sales }] }`

### Customer Segmentation
`GET /ai/segmentation` [ML Service]
*   **Query Params:** `total_spent`, `total_orders`, `recency_days`
*   **Response:** `{ cluster_id, segment_name }` (e.g., "Loyal Customer")

---

## 5. Analytics Dashboard (Admin)
Aggregated insights from the **MySQL Warehouse**.

### Revenue Analytics
`GET /analytics/revenue`
*   **Details:** Returns monthly revenue trends.

### Conversion Rates
`GET /analytics/conversion`
*   **Details:** Returns calculation of Sales / Views per category.
