# 29. Data Structures & Algorithms (DSA) Mapped to System Design

## 1. Algorithmic Patterns Mapped to System Components
| System Feature | Data Structure / Algorithm | Purpose |
| :--- | :--- | :--- |
| **Redis Lua Allocator** | Atomic Decrement + Hash Map | Sub-millisecond single-threaded key lookup & decrement. |
| **Token Rate Limiter** | Token Bucket Algorithm / Sliding Window | Tracks request timestamps in Redis Sorted Set (`ZREMRANGEBYSCORE`). |
| **Kafka Partitioning** | MurmurHash2 Consistent Hashing | Distributes message keys evenly across topic partitions without reshuffling. |
| **LRU Cache Eviction** | Doubly Linked List + Hash Map | Achieves $O(1)$ key lookup and $O(1)$ eviction. |
| **Visual Search Vector Lookup** | Hierarchical Navigable Small World (HNSW Graph) | $O(\log N)$ approximate nearest neighbor (ANN) vector search in Qdrant. |
| **Top-K Trending Products** | Min-Heap / Priority Queue | Maintains real-time Top-K products without sorting millions of items. |
