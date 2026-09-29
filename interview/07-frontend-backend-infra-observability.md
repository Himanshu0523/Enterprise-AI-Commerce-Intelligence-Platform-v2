# 07. Frontend, Frameworks, Observability & CI/CD

## 1. Storefront & Admin (Next.js 14 App Router)
- **Why Next.js?**: Server-Side Rendering (SSR) for product pages (SEO critical), Static Site Generation (SSG) for static landing pages, Incremental Static Regeneration (ISR) for updating catalog caches without full site rebuilds.
- **Server Components vs Client Components**:
  - *Server Components*: Data fetching, direct DB/API queries (Zero JS bundle overhead).
  - *Client Components*: Interactive UI elements (Cart drawer, forms, stateful buttons with `"use client"`).

---

## 2. Backend Framework Selection ("Why?")
- **Express.js (Node.js)**:
  - *Why?*: High I/O throughput, non-blocking asynchronous event loop ideal for microservice routing, lightweight middleware pipeline.
- **FastAPI (Python)**:
  - *Why?*: Native Python async ASGI support, built-in Pydantic data validation, fast execution for ML model inference serving.

---

## 3. Observability & Distributed Tracing
- **OpenTelemetry & W3C Traceparent**:
  - API Gateway generates a W3C trace header: `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`.
  - Header is propagated downstream across Express (Node) $\rightarrow$ FastAPI (Python) $\rightarrow$ Kafka headers.
  - Enables unified trace visualization in Jaeger / Zipkin to identify P99 latency bottlenecks across all 19 microservices.
- **Key Metrics Monitored**: P99 Latency, Kafka Consumer Lag, Redis Cache Hit Ratio, AI Token Spend, Circuit Breaker State.

---

## 4. Infrastructure & Testing Strategy
- **Docker & Compose**: Master `docker-compose.yml` orchestrates all 19 microservices + MongoDB, Redis, Kafka, Qdrant, MySQL into an isolated virtual network.
- **Testing Pyramid**:
  - *Unit Tests*: Jest (Node) & PyTest (Python) for domain logic.
  - *Contract Testing (Pact)*: Consumer-driven contract tests verify API compatibility between Gateway and microservices before deployment.
  - *Integration Tests*: Tests Saga event flows and Redis Lua script atomicity.
