# 05. RAG, Qdrant, AI/ML Services & Vector Search

## 1. RAG Support Service (`rag-service` :8001)
- **Pipeline**: User query $\rightarrow$ Text Embedding $\rightarrow$ Qdrant Hybrid Search (Vector + Payload Filter) $\rightarrow$ Context Injection into Prompt $\rightarrow$ LLM Generation.
- **Why RAG over Fine-Tuning?**: Fine-tuning is static and expensive; RAG enables real-time retrieval from live catalog metadata without model retraining.
- **Hallucination Prevention**: Prompt strictly enforces context boundary: *"Answer ONLY using the provided product context. If unknown, state 'Information unavailable'."*

---

## 2. Vector DB: Qdrant vs Alternatives
- **Why Qdrant?**: High throughput, open-source, native HNSW indexing, and powerful payload filtering (filter vectors by category, price range, and `in_stock == true` simultaneously).
- **Rejected Alternatives**:
  - *Pinecone*: Cloud-proprietary, vendor lock-in.
  - *FAISS*: In-memory library only; lacks built-in payload filtering and clustering persistence out of the box.

---

## 3. Specialized AI Intelligence Services (Python / FastAPI)
| Service | Primary Algorithm / Model | Core Objective |
| :--- | :--- | :--- |
| **`forecast-service` (:8002)** | Prophet / LSTM | Time-series SKU demand forecasting based on historical sales & seasonality. |
| **`pricing-service` (:8003)** | Dynamic Price Optimization Model | Adjusts prices real-time based on stock velocity & competitor pricing within min/max margin constraints. |
| **`fraud-service` (:8004)** | Anomaly Detection (0-100 Risk Score) | Real-time risk scoring based on purchase velocity, IP/device mismatch, and transaction size. |
| **`visual-search-service` (:8005)** | OpenAI CLIP Embeddings | Converts uploaded image into 512-dim vector space; queries Qdrant for visual product matches. |
| **`ml-service` (:8006)** | Collaborative + Content Filtering | Personalized product recommendation engine based on implicit user clicks & purchase history. |

---

## 4. Visual Search with CLIP
```
Uploaded Image ──► CLIP Vision Encoder ──► 512-dim Vector ──► Qdrant Vector Search ──► Top-K Products
```
- **Why CLIP?**: Multimodal joint embedding space allows comparing text prompts directly against image vectors or image-to-image similarity.
