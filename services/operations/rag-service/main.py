import os
import hashlib
import time
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
from tracing import PythonTracer

load_dotenv()

app = FastAPI(title="RAG Multi-Modal Search Service", version="2.0.0")
tracer = PythonTracer("rag-service")

# Keep existing code...
# (rest of lines up to multimodal_search endpoint definition)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── In-Memory Product Catalog (Would be Qdrant in production) ────────────────
PRODUCT_CATALOG = [
    {"id": "p101", "name": "Classic Leather Jacket", "category": "Outerwear", "tags": ["leather", "jacket", "fall", "winter", "formal", "casual"], "price": 189.99, "stock": 15, "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5"},
    {"id": "p102", "name": "Minimalist White Sneaker", "category": "Footwear", "tags": ["sneaker", "white", "casual", "summer", "spring", "comfort"], "price": 79.99, "stock": 10, "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772"},
    {"id": "p103", "name": "Denim Overcoat", "category": "Outerwear", "tags": ["denim", "coat", "casual", "fall", "layering"], "price": 129.99, "stock": 8, "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0"},
    {"id": "p104", "name": "Floral Summer Dress", "category": "Dresses", "tags": ["floral", "summer", "wedding", "garden", "party", "elegant", "dress"], "price": 59.99, "stock": 12, "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1"},
    {"id": "p105", "name": "Linen Blazer", "category": "Formal", "tags": ["linen", "blazer", "summer", "wedding", "formal", "office", "elegant"], "price": 149.99, "stock": 5, "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf"},
    {"id": "p106", "name": "Silk Evening Gown", "category": "Dresses", "tags": ["silk", "evening", "gown", "wedding", "formal", "elegant", "party"], "price": 299.99, "stock": 3, "image": "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6"},
    {"id": "p107", "name": "Cotton Polo Shirt", "category": "Tops", "tags": ["polo", "cotton", "casual", "summer", "sport"], "price": 39.99, "stock": 20, "image": "https://images.unsplash.com/photo-1625910513413-5fc42b4e7c3b"},
    {"id": "p108", "name": "Running Trail Shoe", "category": "Footwear", "tags": ["running", "trail", "sport", "outdoor", "hiking"], "price": 119.99, "stock": 6, "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff"},
]

# ─── FAQ Knowledge Base ───────────────────────────────────────────────────────
KNOWLEDGE_BASE = [
    {"id": "faq_return", "category": "Returns & Refunds", "question": "What is the return policy?", "answer": "We offer a 30-day money-back guarantee for unused items in original packaging. Refunds are processed within 3-5 business days upon receiving the returned product."},
    {"id": "faq_shipping", "category": "Shipping & Delivery", "question": "How long does shipping take?", "answer": "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Free standard shipping applies to orders over $50."},
    {"id": "faq_payment", "category": "Payment Options", "question": "What payment methods are accepted?", "answer": "We accept major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay."},
    {"id": "faq_tracking", "category": "Order Tracking", "question": "How can I track my order?", "answer": "Once your order ships, you will receive a tracking code via email or you can track directly under your Account > Orders dashboard."},
]


# ─── Scoring Utilities ───────────────────────────────────────────────────────

def lexical_score(query: str, text: str) -> float:
    """Jaccard-style word overlap scoring."""
    query_words = set(query.lower().split())
    text_words = set(text.lower().split())
    if not query_words:
        return 0.0
    intersection = query_words & text_words
    union = query_words | text_words
    return len(intersection) / len(union) if union else 0.0


def semantic_tag_score(query: str, tags: List[str]) -> float:
    """Scores how well query intent matches product tag taxonomy."""
    query_lower = query.lower()
    matches = sum(1 for tag in tags if tag in query_lower)
    return matches / len(tags) if tags else 0.0


def image_fingerprint_score(image_bytes: bytes, product_id: str) -> float:
    """
    Simulates CLIP/ResNet embedding cosine similarity.
    In production, this would:
      1. Encode uploaded image via CLIP model -> 512-dim vector
      2. Query Qdrant for nearest neighbors by cosine distance
    Here we use a deterministic hash-based pseudo-score for reproducibility.
    """
    img_hash = int(hashlib.md5(image_bytes).hexdigest()[:8], 16)
    prod_hash = int(hashlib.md5(product_id.encode()).hexdigest()[:8], 16)
    # Deterministic pseudo-similarity in [0.55, 0.98] range
    raw = ((img_hash ^ prod_hash) % 1000) / 1000.0
    return round(0.55 + raw * 0.43, 3)


def rrf_fuse(scores_list: List[Dict[str, float]], k: int = 60) -> Dict[str, float]:
    """
    Reciprocal Rank Fusion (RRF) to merge multiple ranked lists.
    Each input dict maps product_id -> raw_score.
    Returns fused scores per product_id.
    """
    fused = {}
    for scores in scores_list:
        sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        for rank, (pid, _) in enumerate(sorted_items):
            fused[pid] = fused.get(pid, 0.0) + 1.0 / (k + rank + 1)
    return fused


# ─── Pydantic Models ─────────────────────────────────────────────────────────

class SupportQueryRequest(BaseModel):
    query: str
    userId: Optional[str] = None

class ContextDoc(BaseModel):
    id: str
    category: str
    question: str
    answer: str
    score: float

class SupportQueryResponse(BaseModel):
    query: str
    answer: str
    relevantContext: List[ContextDoc]

class ProductMatch(BaseModel):
    productId: str
    name: str
    category: str
    price: float
    stock: int
    image: str
    fusedScore: float
    scoreSources: Dict[str, float]

class MultiModalSearchResponse(BaseModel):
    textQuery: Optional[str]
    imageProvided: bool
    fusionMethod: str
    totalResults: int
    results: List[ProductMatch]
    latencyMs: int


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "rag-service", "version": "2.0.0"}


@app.post("/api/support/query", response_model=SupportQueryResponse)
def support_query(payload: SupportQueryRequest):
    """RAG-powered customer support Q&A against knowledge base."""
    q = payload.query
    if not q.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    scored_docs = []
    for item in KNOWLEDGE_BASE:
        full_text = f"{item['category']} {item['question']} {item['answer']}"
        score = lexical_score(q, full_text)
        scored_docs.append({**item, "score": round(score, 4)})

    scored_docs.sort(key=lambda x: x["score"], reverse=True)
    top_docs = [ContextDoc(**d) for d in scored_docs[:2]]

    best = top_docs[0] if top_docs and top_docs[0].score > 0.05 else None
    if best:
        answer = f"Based on our support docs ({best.category}): {best.answer}"
    else:
        answer = "I couldn't find an exact match. Please contact support@example.com."

    return SupportQueryResponse(query=q, answer=answer, relevantContext=top_docs)


@app.post("/api/search/multimodal", response_model=MultiModalSearchResponse)
async def multimodal_search(
    query: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    limit: int = Form(5),
    traceparent: Optional[str] = Header(None),
):
    """
    Multi-modal product search using Reciprocal Rank Fusion (RRF) with OpenTelemetry-compatible tracing.
    """
    root_span = tracer.start_span("POST /api/search/multimodal", traceparent=traceparent)
    try:
        start = time.time()

        if not query and not image:
            root_span.set_status("ERROR", "Missing parameters")
            root_span.end()
            raise HTTPException(status_code=400, detail="Provide at least a text query or an image.")

        image_bytes = None
        if image:
            image_bytes = await image.read()

        ranked_lists = []

        # ── Signal 1: Lexical text match ──
        if query:
            span = tracer.start_span("lexical_matching", traceparent=root_span.traceparent)
            text_scores = {}
            for p in PRODUCT_CATALOG:
                searchable = f"{p['name']} {p['category']} {' ' .join(p['tags'])}"
                text_scores[p["id"]] = lexical_score(query, searchable)
            ranked_lists.append(text_scores)
            span.set_status("OK").end()

        # ── Signal 2: Semantic tag intent match ──
        if query:
            span = tracer.start_span("semantic_tag_matching", traceparent=root_span.traceparent)
            tag_scores = {}
            for p in PRODUCT_CATALOG:
                tag_scores[p["id"]] = semantic_tag_score(query, p["tags"])
            ranked_lists.append(tag_scores)
            span.set_status("OK").end()

        # ── Signal 3: Visual similarity (image embedding) ──
        if image_bytes:
            span = tracer.start_span("visual_similarity_matching", traceparent=root_span.traceparent)
            visual_scores = {}
            for p in PRODUCT_CATALOG:
                visual_scores[p["id"]] = image_fingerprint_score(image_bytes, p["id"])
            ranked_lists.append(visual_scores)
            span.set_status("OK").end()

        # ── Reciprocal Rank Fusion ──
        span = tracer.start_span("rrf_fusion", traceparent=root_span.traceparent)
        fused = rrf_fuse(ranked_lists)
        span.set_status("OK").end()

        # Build results sorted by fused score
        results = []
        for pid, fscore in sorted(fused.items(), key=lambda x: x[1], reverse=True)[:limit]:
            product = next(p for p in PRODUCT_CATALOG if p["id"] == pid)
            sources = {}
            if query:
                sources["lexical"] = round(lexical_score(query, f"{product['name']} {product['category']} {' '.join(product['tags'])}"), 4)
                sources["semantic_tags"] = round(semantic_tag_score(query, product["tags"]), 4)
            if image_bytes:
                sources["visual_similarity"] = image_fingerprint_score(image_bytes, pid)
            results.append(ProductMatch(
                productId=pid,
                name=product["name"],
                category=product["category"],
                price=product["price"],
                stock=product.get("stock", 0),
                image=product["image"],
                fusedScore=round(fscore, 4),
                scoreSources=sources,
            ))

        elapsed = int((time.time() - start) * 1000)
        root_span.set_status("OK").end()

        return MultiModalSearchResponse(
            textQuery=query,
            imageProvided=image_bytes is not None,
            fusionMethod="Reciprocal Rank Fusion (RRF, k=60)",
            totalResults=len(results),
            results=results,
            latencyMs=elapsed,
        )
    except Exception as e:
        root_span.set_status("ERROR", str(e)).end()
        raise e


# Import CDC Sync Worker to spin up the Kafka consumer background listener
try:
    import kafka_cdc_worker
except Exception as err:
    print(f"[RAG-CDC] Failed to start CDC listener worker: {err}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
