# 27. LLM Cost, Latency & Token Optimization

## 1. Token Budgeting & Cost Attribution
- **Per-Session Budget Cap**: Hard `$0.05` cap tracked via Redis `INCRBYFLOAT session:<id>:spend <cost>`. Halts execution if budget exhausted.
- **Model Routing**: Routing simple queries (e.g. FAQ status, stock checks) to lightweight models (GPT-3.5-Turbo / Claude Haiku) and reserving heavy reasoning for complex multi-agent tasks.

---

## 2. Latency Optimization Techniques
- **Semantic Prompt Caching**: Queries with high similarity score (> 0.95) return cached responses stored in Redis without hitting external LLM provider APIs.
- **Streaming Responses**: Returns LLM responses via Server-Sent Events (SSE) to lower perceived latency for customers.

---

## 3. Token-Aware Rate Limiting at API Gateway
- **Token Rate Calculation**:
  - `Total Tokens = Input Tokens (Text + Image Weight) + Estimated Output Tokens`.
  - Image payloads (Visual Search) assigned weight of `512 tokens`.
- Enforces tenant limit: `20,000 tokens/minute`.
