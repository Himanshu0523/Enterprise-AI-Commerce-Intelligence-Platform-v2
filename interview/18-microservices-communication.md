# 18. Microservices Communication Protocols & Inter-Service Messaging

## 1. Synchronous vs Asynchronous Communication
- **Synchronous (HTTP REST / gRPC)**: Used when an immediate response is required (e.g. Gateway authentication check, user profile retrieval).
- **Asynchronous (Kafka Event Bus)**: Used for state mutations and cross-domain events (e.g. `ORDER_CREATED`, `PAYMENT_SUCCESSFUL`, `CDC_PRODUCT_MUTATED`).

---

## 2. REST vs gRPC Evaluation
| Protocol | Transport | Serialization | Best Used For |
| :--- | :--- | :--- | :--- |
| **REST** | HTTP/1.1 | JSON | External public APIs (API Gateway $\rightarrow$ Storefront). |
| **gRPC** | HTTP/2 Multiplexed | Protobuf (Binary) | High-performance internal inter-service communication (Node Core $\rightarrow$ Python AI). |

---

## 3. Resilience: Circuit Breakers, Bulkheads & Timeouts
- **Circuit Breaker Pattern (Opossum)**:
  - *Closed*: Normal operation.
  - *Open*: Error rate exceeds 50% over 10s window. Requests immediately return static fallbacks without hitting downstream service.
  - *Half-Open*: After 30s timeout, probe request tests downstream recovery.
- **Bulkhead Isolation**: Restricts concurrent connection pools per downstream service (e.g. max 50 concurrent sockets for `pricing-service` to prevent resource exhaustion).
- **Correlation ID & W3C Traceparent**: Gateway generates `X-Correlation-ID` and W3C `traceparent` headers, propagating them through HTTP headers and Kafka headers across all 19 microservices.

---

## 4. Consumer-Driven Contract Testing (Pact)
- **Why Contract Testing?**: Verifies API schema compatibility between Express Gateway and microservices in CI pipelines without launching expensive full E2E environments.
- **Workflow**: Consumer service defines expected JSON contract in Pact file. Provider service runs automated CI tests validating its response matches the Pact schema.
