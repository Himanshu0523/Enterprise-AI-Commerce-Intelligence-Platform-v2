# System Design Strategy

This project implements a **Modern Polyglot Data Persistence Architecture**, optimized for both fast transactional operations and complex analytical heavy-lifting.

## 1. The Dual-Database Strategy

The system is split into two distinct data environments:

### **A. Operational Data Layer (MongoDB)**
*   **Role:** Real-time transactions.
*   **Why:** NoSQL provides the flexibility needed for rapidly changing product catalogs and high-write event logging (user clicks, views).
*   **Scope:** User profiles, active orders, sessions, and live product listings.

### **B. Analytical Data Layer (MySQL Warehouse)**
*   **Role:** Business Intelligence and ML Feature Engineering.
*   **Why:** Structured MySQL tables allow for complex JOINs and aggregations that are computationally expensive in NoSQL.
*   **Scope:** Historical metrics, revenue trends, and pre-calculated customer segments.

---

## 2. Structural Components

### **The Backend API (Node.js)**
Acts as the central orchestrator. It handles user authentication and proxies specific requests to either the MongoDB database or the Python ML Service based on the workload type.

### **The ML Service (FastAPI)**
An isolated Python environment that handles computationally heavy machine learning. By separating this, the main web server stays responsive while the ML service performs matrix calculations or regression analysis.

### **The Data-Pipeline (Python)**
The glue between the operational and analytical layers. It uses ETL (Extract, Transform, Load) patterns to periodically sync data from MongoDB to MySQL, ensuring the warehouse stays fresh without impacting the live app performance.

---

## 3. Communication Patterns

*   **Synchronous REST:** Used for user interactions (Login -> Dashboard).
*   **Asynchronous Jobs:** Used for background data syncing and expensive ML model retraining.
*   **Pickled Serialization:** The ML service uses `.pkl` files to store pre-trained models, allowing for near-instant inference responses.

---

## 4. Scalability Logic

1.  **Horizontal Scaling:** Each microservice (Backend, ML, Pipeline) can be independently containerized (Docker) and scaled across multiple instances.
2.  **State Management:** By using Redux on the Frontend and JWT sessions, the application remains stateless and ready for load balancing.
