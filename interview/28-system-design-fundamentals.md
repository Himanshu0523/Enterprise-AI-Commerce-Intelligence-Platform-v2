# 28. System Design Framework & Back-of-the-Envelope Estimation

## 1. Structured 5-Step System Design Interview Framework
1. **Requirements Clarification (5 mins)**:
   - *Functional*: Checkout flow, stock reservation, dynamic pricing, RAG support, AI agents.
   - *Non-Functional*: P99 latency < 200ms, 99.99% availability, zero inventory overselling, token budget enforcement.
2. **Back-of-the-Envelope Estimation (5 mins)**: QPS, network ingress/egress bandwidth, storage capacity over 5 years.
3. **API & Data Model Contract Design (5 mins)**: Define REST endpoints & MongoDB/Redis schemas.
4. **High-Level Architecture Blueprint (10 mins)**: API Gateway, Microservices, Event Bus, Databases, Caching, AI engines.
5. **Deep Dive & Bottlenecks (15 mins)**: Concurrency locking, Saga compensations, cache invalidation, failover.

---

## 2. Standard System Design Practice Case Studies
| Case Study | Key Architecture Challenge | Primary Technology Solution |
| :--- | :--- | :--- |
| **Flash-Sale Inventory** | Overselling under 100k requests. | Redis atomic Lua stock allocation script (`reserveStockLua`). |
| **Payment System** | Network timeouts & double-charging. | `Idempotency-Key` headers + Redis locks + Stripe webhooks. |
| **RAG Support System** | Stale embedded vector data. | Kafka CDC worker (`kafka_cdc_worker.py`) syncing MongoDB to Qdrant. |
| **AI Cost Control** | Infinite LLM loops & token budget spikes. | LangGraph recursion cap (5 loops $\rightarrow$ `422`) + Redis `$0.05` session cap. |
