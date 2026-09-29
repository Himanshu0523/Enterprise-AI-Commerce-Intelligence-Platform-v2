# 06. Agentic AI (LangGraph), AI Guardrails & Security

## 1. Agentic AI Architecture (`agent-service` :8007)
- **Framework**: LangGraph (Cyclic state graph execution).
- **Multi-Agent Supervisor Pattern**: A central **Supervisor Router Agent** interprets user intent and delegates tasks to specialized tool-calling worker agents (`PricingAgent`, `InventoryAgent`, `MarketingAgent`, `SupportAgent`).

```
                              ┌────────────────────┐
                              │  User Request      │
                              └─────────┬──────────┘
                                        │
                                        ▼
                              ┌────────────────────┐
                              │ Supervisor Router  │
                              └─────────┬──────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
┌───────────────────┐        ┌───────────────────┐        ┌───────────────────┐
│   Pricing Agent   │        │ Inventory Agent   │        │   Support Agent   │
└───────────────────┘        └───────────────────┘        └───────────────────┘
```

---

## 2. AI Guardrail Controls
1. **Loop Execution Depth Guard**:
   - LangGraph tracks recursion iteration step in execution state.
   - If iteration count > 5, execution halts and returns `422 Unprocessable Entity` with a heuristic fallback response (prevents infinite recursive tool calling).
2. **Session Cost Budget Control**:
   - Uses atomic Redis key `INCRBYFLOAT session:<id>:cost <call_cost>`.
   - Hard threshold: `$0.05` per user session. Once exceeded, requests reject immediately with `429 Token/Budget Exceeded`.
3. **Token-Aware Rate Limiter**:
   - Enforces a `20,000 tokens/min` ceiling per tenant at the API Gateway using token bucket counters in Redis.

---

## 3. Security & Prompt Injection Mitigation
- **Prompt Injection Defense**:
  - Direct Injection: User input is isolated inside explicit `<user_query>` XML blocks with system prompts instructing LLM to ignore embedded system instructions.
  - Indirect Injection: Retrieved documents/catalog items are sanitized before context injection.
- **API & JWT Security**:
  - JWT tokens signed via RS256 / SHA-256 algorithm with 15-minute expiration.
  - Role-Based Access Control (RBAC): `USER`, `ADMIN`, `SERVICE_ACCOUNT`. Admin routes protected via middleware.
  - Helmet headers: Enforces HTTP Strict Transport Security (HSTS), X-Content-Type-Options, and X-Frame-Options.
