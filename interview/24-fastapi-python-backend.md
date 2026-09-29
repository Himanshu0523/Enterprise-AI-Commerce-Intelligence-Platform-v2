# 24. FastAPI & Python Async AI Architecture

## 1. FastAPI ASGI Architecture
- **ASGI (Asynchronous Server Gateway Interface)**: Powered by `Uvicorn` server and `uvloop` (C-based event loop).
- **Async vs Sync Endpoints**:
  - `async def`: Used for IO-bound tasks (fetching data from Qdrant vector DB or sending HTTP requests). Runs on event loop thread.
  - `def`: FastAPI automatically runs synchronous blocking code inside an external thread pool (`ThreadPoolExecutor`) to avoid blocking the event loop.

---

## 2. Python GIL (Global Interpreter Lock) & CPU-Bound ML
- **Python GIL**: Restricts execution of raw Python bytecode to a single OS thread per process.
- **Overcoming GIL for AI Models**: PyTorch and CLIP C-extensions release the GIL during native tensor calculations. For multi-core CPU scaling, FastAPI runs multiple worker processes via `uvicorn main:app --workers 4`.

---

## 3. Model Loading & Memory Optimization
- **Singleton Model Loading**: Machine learning models (CLIP, Prophet) are loaded **once** during FastAPI application startup (`@app.on_event("startup")` or `lifespan`) into global memory.
- **Model Warmup**: Executes a dummy inference call during container startup to prevent cold-start latency penalty on initial customer requests.
