# 17. Distributed Systems Fundamentals

## 1. CAP Theorem & PACELC Theorem
- **CAP Theorem**: In a distributed system during a Network Partition (**P**), you must choose between **Consistency (C)** or **Availability (A)**.
  - *Our Microservices Architecture*: **AP (Available / Partition Tolerant)** using eventual consistency via Kafka events.
  - *Inventory Allocation*: **CP (Consistent / Partition Tolerant)** inside single-threaded Redis Lua scripts to guarantee zero stock overselling.
- **PACELC Theorem**: **If Partition (P)**, trade off Availability (**A**) vs Consistency (**C**); **Else (E)**, trade off Latency (**L**) vs Consistency (**C**).
  - *System Choice*: **PA/EL** — prioritizes low latency during normal operation and availability during network partitions.

---

## 2. Distributed Transactions: 2PC vs Saga Architecture
- **Two-Phase Commit (2PC)**:
  - Phase 1 (Prepare) $\rightarrow$ Phase 2 (Commit).
  - *Why Avoided*: Requires blocking locks across microservice databases; low throughput; single point of failure (Coordinator).
- **Distributed Saga Orchestrator Pattern**:
  - Non-blocking local database transactions coordinated via `order-service` state machine and Kafka event streams, with automated compensating actions on failure.

---

## 3. Network Partitions, Split-Brain & Consensus (Raft)
- **Split-Brain Problem**: Network partition splits cluster into sub-groups, each believing it is the sole active cluster and electing separate primary leaders.
- **Consensus (Raft / Paxos)**: Prevents split-brain by requiring a strict **Quorum Majority** ($N/2 + 1$ nodes) to elect a Primary leader and commit writes. Used in MongoDB Replica Sets and Kafka KRaft controller nodes.

---

## 4. Resilience: Exponential Backoff with Jitter & Idempotency
- **Exponential Backoff with Full Jitter**:
  `sleep = min(cap, base * 2 ^ attempt) + random_between(0, 100ms)`
  Prevents retry storms (thundering herd problem) when a recovering service comes back online.
- **Atomic Lua vs Redlock Distributed Locks**:
  - Redlock requires acquiring locks across a majority of Redis master nodes (higher latency).
  - Redis Lua executes in a single-threaded event loop, providing atomic execution on a single Redis shard with zero lock acquiring overhead.
