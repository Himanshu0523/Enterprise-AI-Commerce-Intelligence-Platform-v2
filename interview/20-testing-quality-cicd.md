# 20. Testing Pyramid, Quality Assurance & CI/CD Pipelines

## 1. Testing Strategy Pyramid
```
        /  E2E Tests (Playwright)  \          <-- 10%
       / Integration / Saga Tests   \         <-- 20%
      / Contract Testing (Pact JS)   \        <-- 20%
     / Unit Tests (Jest & PyTest)     \       <-- 50%
```

- **Unit Testing (50%)**: Tests isolated domain logic, utility functions, state machine transitions (Jest for Node.js, PyTest for Python).
- **Contract Testing (Pact - 20%)**: Verifies API schema compatibility between API Gateway and microservices.
- **Integration Testing (20%)**: Tests Saga event workflows across Kafka and Redis Lua stock reservation correctness.
- **End-to-End (E2E) Testing (10%)**: Playwright tests full customer checkout flow in staging container environment.

---

## 2. GitHub Actions CI/CD Pipeline
- **Continuous Integration (CI) Workflow**:
  1. **Lint & Type Check**: ESLint + TypeScript `tsc --noEmit` + Python `flake8` / `mypy`.
  2. **Automated Test Matrix**: Parallel job execution for Jest, PyTest, and Pact contract verifications.
  3. **Multi-Stage Docker Build**: Builds optimized runtime images using Docker build cache.
- **Deployment Strategies**:
  - *Blue-Green Deployment*: Provisions new container group alongside active containers; switches ALB router traffic instantly upon passing health checks.
  - *Canary Deployment*: Routes 5% of traffic to new version for 15 minutes while monitoring error rates via OpenTelemetry.
