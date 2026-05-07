# AI-powered decision system with e-commerce interface

An enterprise-grade, full-stack E-Commerce ecosystem empowered with Artificial Intelligence. This platform merges traditional e-commerce functionalities (authentications, product catalogs, order management, and payments) with advanced machine learning capabilities, including AI-driven personalized product recommendations, dynamic customer segmentation, and intelligent demand forecasting.

## 🚀 Key Features

* **Complete E-Commerce Workflows:** User authentication, catalog browsing, shopping cart, and final checkout.
* **AI & Machine Learning Engine:**
  * **Personalized Recommendations:** Matrix-factorization models automatically suggesting products tailored to individual user behaviors.
  * **Customer Segmentation:** Automated KMeans clustering that labels users dynamically (e.g., "At Risk", "Champions", "Loyal").
  * **Demand Forecasting:** Regression/ARIMA systems to predict future sales trends by product, preventing out-of-stock scenarios.
* **Real-time Analytics Dashboard:** Visual charts and statistics aggregating top-selling products and customer insights on the fly.
* **Separation of Concerns:** Deeply modular architecture cleanly separating Frontend, Backend, ML inferences, ETL workflows, and Data Warehousing.

---

## 🏗️ System Architecture

The project is divided into distinct operational bounded contexts:

### 1. Frontend (`/frontend`)
React.js Single Page Application (SPA).
* **Pages:** Dashboard, Home, Cart, Product Detail.
* **Components:** Reusable UI components including Product Cards, dynamic Recommendation Panels, and Analytics Charts.
* **Services:** Organized functional APIs to securely communicate with the backend proxy.

### 2. Backend (`/backend`)
Node.js & Express.js REST API using MongoDB.
* Extensively layered standard design: `Routes` → `Controllers` → `Services` → `Models`.
* Integrates robust Middlewares for JWT security, Rate Limiting, and intelligent Request Logging.
* Manages orders, authentications, inventory, and analytics aggregation.

### 3. Machine Learning Microservice (`/ml-service`)
FastAPI application running Python.
* **Training Models:** Headless training scripts (`training/`) using Pandas and Scikit-Learn to digest data and pickle outputs (`models/`).
* **Inference Engines:** Dynamic logic (`inference/`) running live classifications based directly on API triggers.
* Provides real-time isolated routes like `GET /ai/recommendations/{userId}` and `GET /ai/forecast/{productId}`.

### 4. Data Engineering & Insights
* **Data-Pipeline (`/data-pipeline`):** ETL automation ensuring clean transformations of orders, products, and user events for the AI model to ingest.
* **Warehouse (`/warehouse`):** Relational SQL footprints tailored specifically for heavy analytics polling and ad-hoc BI visualization queries.

---

## 📂 Project Structure

```text
AI-Powered-E-Commerce/
├── frontend/             # React application containing UI and State Handling
├── backend/              # Node.js Server containing primary Business Logic
├── ml-service/           # FastAPI Python Application containing ML inference
├── data-pipeline/        # ETL Python scripts & Schedulers
├── warehouse/            # SQL query definitions, Schemas, & Procedures
└── docs/                 # Primary architectural specifications and designs
```

---

## 📡 Core API Specification Summary

*All endpoints map to `/api/v1`*

**Authentication:** 
* `POST /auth/register` - Create user
* `POST /auth/login` - Generates JWT

**Products & Orders:** 
* `GET /products` - Retrieve items
* `POST /orders` - Trigger secure checkout pipeline

**Analytics & AI:**
* `GET /analytics/revenue` - Return revenue data visualizations
* `GET /ai/recommendations/{userId}` - Returns top 5 AI-identified products for that user
* `GET /ai/forecast/{productId}` - Generates the next 7-day predictive sales trajectory array

*(Refer to `docs/api-spec.md` for a comprehensive breakdown.)*

---

## 💻 Getting Started

### Prerequisites
* Node.js & NPM
* Python 3.9+
* MongoDB setup mapping (or connection string)

### 1. Launching the Machine Learning Service
```bash
cd ml-service
python -m venv venv
source venv/Scripts/activate  # (On Windows)
pip install -r requirements.txt

# Start the uvicorn server locally
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*API docs auto-generate at `http://localhost:8000/docs`*

### 2. Launching the Node Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Launching the React Frontend
```bash
cd frontend
npm install
npm start
```
