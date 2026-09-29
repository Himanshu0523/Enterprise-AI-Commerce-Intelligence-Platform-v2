# 01. System Architecture & API Gateway

## 1. Project Pitch & Architecture Overview
- **Problem Solved**: High-concurrency flash sales (inventory overselling) + Real-time AI integration without stale vector data or runaway token costs.
- **Architecture Stack**:
  - **Storefront/Admin**: Next.js 14 App Router (Port 3000 / 3001)
  - **API Gateway**: Express.js Proxy (Port 8000)
  - **Core Domain Microservices (12)**: Node.js/Express (Ports 3001-3012: `auth`, `user`, `product`, `inventory`, `cart`, `order`, `payment`, `shipping`, `coupon`, `review`, `notification`, `audit-log`)
  - **AI Intelligence Microservices (7)**: FastAPI Python (Ports 8001-8007: `rag`, `forecast`, `pricing`, `fraud`, `visual-search`, `ml`, `agent`)
  - **Databases & Stores**: MongoDB (Database-per-service), Redis (Stock allocator, rate limits, sessions), Qdrant (Vector DB), MySQL (OLAP Data Warehouse)
  - **Event Bus & Streaming**: Kafka (Domain events, CDC log)

```
Client (Next.js) ──► Express API Gateway (:8000)
                           │
      ┌────────────────────┴────────────────────┐
      ▼                                         ▼
12 Node Core Services                   7 Python AI Services
(Ports 3001 - 3012)                     (Ports 8001 - 8007)
      │                                         │
      ▼                                         ▼
MongoDB (DB-per-service) + Redis            Qdrant Vector DB
      │                                         │
      └───────────────► Kafka Event Bus ────────┘
                            │
                            ▼
                   MySQL OLAP Warehouse
```

> [!NOTE]
> **Interviewer Nuance (Service Count & Diagrams)**: The repository documents **12 Core Domain Microservices**. While primary architectural diagrams highlight 10 main synchronous HTTP API ports (Auth through Review), services 11 (`notification-service` :3011) and 12 (`audit-log-service` :3012) consume Kafka events asynchronously to dispatch notifications and write immutable security audit trails.

---

## 2. Microservices Architecture & Isolation
- **Why Microservices?**: Independent deployment, isolated scaling (`inventory-service` scales 50x during flash sales vs static `auth-service`), bounded contexts.
- **Why Database-per-Service?**: Eliminates database-level schema coupling. No cross-service SQL JOINs or direct MongoDB cross-database queries allowed.
- **Rejected Alternatives**:
  - *Monolith*: Shared DB contention under 100k requests; single point of failure.
  - *Serverless*: High cold-start latencies for PyTorch/CLIP models & active Kafka event consumers.

---

## 3. Express API Gateway (:8000)
- **Gateway Responsibilities**: Single entry point, Helmet security headers, CORS, JWT token verification, path routing, request & token rate limiting.
- **Header Security & Identity Injection**:
  1. Gateway verifies incoming Bearer JWT signature via secret key.
  2. Strips raw client JWT token.
  3. Injects trusted internal headers: `x-user-id`, `x-user-email`, `x-user-role`.
  4. Gateway strips any client-supplied `x-user-*` headers from public requests to prevent header forgery. Microservices accept requests only from private Docker/VPC IPs.
- **Resilience & Fault Isolation**:
  - Timeouts: 3s for core REST endpoints, 5s for heavy AI endpoints.
  - Circuit Breakers (Opossum): Opens circuit when error rate exceeds 50% over 10s, returning fallback static responses instead of hanging connections.
