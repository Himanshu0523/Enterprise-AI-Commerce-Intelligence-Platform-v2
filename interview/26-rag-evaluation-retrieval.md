# 26. RAG Evaluation, Retrieval Tuning & Vector Hygiene

## 1. RAG Retrieval Architecture
```
Query ──► Query Embedding ──► Qdrant Hybrid Search (Dense Vector + Metadata Payload Filter) ──► Top-K Passages ──► LLM Context
```

- **Chunking Strategy**: Product documentation and review text chunked into 256-token segments with 32-token overlap (preserves boundary context).
- **Hybrid Search**: Combines **Dense Retrieval** (semantic similarity) with **Sparse Filters** (`category == 'tech'`, `price <= 500`, `in_stock == true`).

---

## 2. Vector Index Hygiene & Stale Data Elimination
- **CDC Event Sync**: Kafka consumer updates vector metadata in real-time when stock changes to 0 or prices update in MongoDB.
- **Tombstone Deletions**: Product deletions in MongoDB generate CDC deletion events, removing vector point IDs from Qdrant (`qdrant_client.delete(collection, points_selector)`).

---

## 3. RAG Evaluation Metrics (RAGAS Framework)
- **Faithfulness**: Measures whether the generated answer is grounded *strictly* in retrieved context (evaluates hallucination rate).
- **Answer Relevance**: Measures how well the response directly answers the user query.
- **Context Precision & Recall**: Evaluates whether retrieved Top-K vectors contain relevant product specifications.
