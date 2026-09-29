# 42. Quantitative Capacity-Estimation Drills

## 1. Flash-Sale System Capacity Math
- **Scenario Assumptions**:
  - Total Active User Base: 1,000,000 users.
  - Participating Flash-Sale Buyers: 10% = 100,000 buyers.
  - Spike Concurrency: 20% place an order concurrently in the first 5 seconds.
- **QPS Calculations**:
  - Total Concurrent Requests = $100,000 \times 0.20 = 20,000$ buyers.
  - Peak Order QPS = $20,000 / 5 \text{ seconds} = 4,000 \text{ Peak QPS}$.

---

## 2. Bandwidth & Storage Estimates
- **Payload Ingress Bandwidth**:
  - Payload Size = $2 \text{ KB}$ per order submission POST.
  - Network Ingress = $4,000 \text{ QPS} \times 2 \text{ KB} = 8,000 \text{ KB/s} \approx 8 \text{ MB/sec}$.
- **Storage Volume**:
  - Storage Write = $100,000 \text{ completed orders} \times 2 \text{ KB/order} = 200,000 \text{ KB} \approx 200 \text{ MB}$ written per flash sale.

---

## 3. Storage & Bottleneck Scaling Breakdown
- **Redis Memory Sizing for Stock Allocation**:
  - 10,000 SKUs $\times 64 \text{ bytes per key} \approx 640 \text{ KB}$ RAM requirement.
- **System Bottleneck Identification**:
  - Primary Bottleneck: Database Write Connection Pool limits on MongoDB.
  - Secondary Bottleneck: Network socket limits on single Express node instances.
- **Scaling Sequence**:
  1. Offload stock decrement to single-threaded Redis Lua scripts (`sub-millisecond`).
  2. Scale Gateway and Core instances horizontally behind AWS Application Load Balancer.
  3. Stream persistent MongoDB writes asynchronously through Kafka outbox consumers to smooth out write spikes.
