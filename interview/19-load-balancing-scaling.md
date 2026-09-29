# 19. Load Balancing & Traffic Management

## 1. Layer 4 vs Layer 7 Load Balancing
- **L4 (Transport Layer)**: Routes traffic based on IP address and TCP port (e.g. AWS Network Load Balancer). Fast, low CPU overhead.
- **L7 (Application Layer)**: Routes traffic based on HTTP URL path, headers, and cookies (e.g. AWS Application Load Balancer / NGINX). Used at our API Gateway level for path routing (`/api/v1/orders` vs `/api/v1/ai`).

---

## 2. Stateless Service Architecture
- **Stateless Microservices**: All Express and FastAPI service instances store no local session state in memory.
- **Session Externalization**: User sessions and JWT refresh tokens are externalized to Redis. Any instance can serve any incoming request, enabling seamless horizontal autoscaling.

---

## 3. Database Scaling Strategies
- **MongoDB**:
  - *Read Scaling*: Secondary Read Replicas (`readPreference=secondaryPreferred`).
  - *Write Scaling*: Sharding by Compound Shard Key (`{ tenant_id: 1, order_id: 1 }`).
- **Redis**:
  - *Read/Write Scaling*: Redis Cluster with 16,384 hash slots. SKU keys hashed via `{sku_id}:stock`.
- **MySQL Data Warehouse**:
  - Read Replicas for BI reporting dashboards; primary node dedicated to ETL loads.
