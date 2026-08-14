# 🧪 Testing Strategy, API Contract Testing, & CI/CD Pipelines

## Overview
This document specifies the testing methodology, consumer-driven API contract testing framework, and matrix-based GitHub Actions CI/CD deployment pipelines implemented across the **Enterprise AI Commerce Intelligence Platform**.

---

## 1. Multi-Tier Testing Strategy

The platform enforces a 3-tier testing pyramid to guarantee quality across all 17 microservices:

```text
                       ┌───────────────────┐
                       │  E2E Playwright   │  (Storefront Checkout Flows)
                       ├───────────────────┤
                       │ Consumer Contract │  (Pact API Gateway Tests)
                       ├───────────────────┤
                       │ Integration Tests │  (Mongoose DB & FastAPI In-Memory)
                       ├───────────────────┤
                       │    Unit Tests     │  (Jest & PyTest Business Logic)
                       └───────────────────┘
```

### Testing Framework Selection:
- **Node.js Core Microservices**: **Jest** + **Supertest** (In-memory MongoDB Memory Server).
- **Python AI Microservices**: **PyTest** + **FastAPI TestClient**.
- **Storefront / Admin Dashboards**: **Playwright** cross-browser E2E suite.
- **Contract Verification**: **Pact.js** / **Pact Python**.

---

## 2. Consumer-Driven API Contract Testing (Pact)

To ensure independent microservice teams can deploy changes without breaking the API Gateway or storefront apps:

1. **Contract Definition**: The API Gateway (Consumer) defines JSON contracts specifying expected request paths, headers, and response payloads for downstream services (Providers).
2. **Contract Publishing**: Contracts are published to a central **Pact Broker**.
3. **Provider Verification**: During CI runs, downstream microservices (`order-service`, `pricing-service`, etc.) fetch contracts from the Pact Broker and verify their response models against the active contract. Breaking changes fail the build before deployment.

---

## 3. GitHub Actions Matrix CI/CD Pipeline

The `.github/workflows/ci.yml` pipeline optimizes build speeds by using **path change filtering** and **parallel matrix jobs**:

### Pipeline Execution Flow:
1. **Path Filter**: Evaluates git diffs to trigger builds *only* for modified microservices.
2. **Node Matrix Execution**: Parallel matrix jobs spawn independent containers for modified Node microservices (`auth-service`, `order-service`, etc.).
3. **Python Matrix Execution**: Parallel matrix jobs validate dependencies and run PyTest for modified Python AI services (`rag-service`, `agent-service`, etc.).
4. **Artifact Build**: On success, Docker images are built and pushed to **GitHub Container Registry (GHCR)**.

```mermaid
flowchart TD
    Push[Git Push / PR] --> Filter[Path Filter Check]
    
    Filter -->|Changes in services/cors/*| NodeMatrix[Node Matrix Jobs (10 Services Parallel)]
    Filter -->|Changes in services/intelligence/*| PyMatrix[Python Matrix Jobs (7 Services Parallel)]
    
    NodeMatrix --> TestNode[Run Jest & Supertest]
    PyMatrix --> TestPy[Run PyTest & FastAPI Specs]
    
    TestNode --> ContractCheck[Pact Contract Verification]
    TestPy --> ContractCheck
    
    ContractCheck --> DockerBuild[Build Docker Container Images]
    DockerBuild --> GHCR[Push to Container Registry]
```
