import time
import json
import hashlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

app = FastAPI(title="ML Recommendation & Feature Store Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── In-Memory Feature Store (Simulates Redis) ───────────────────────────────
# In production this is backed by Redis with TTL-based expiry.
# Keys: "features:{user_id}" -> dict of real-time behavior signals.

_feature_store: Dict[str, Dict[str, Any]] = {}

# Pre-seed some user feature vectors for demo
_feature_store["user_001"] = {
    "clicks_last_5m": 12,
    "cart_adds_last_5m": 2,
    "page_views_last_5m": 8,
    "avg_session_duration_sec": 340,
    "last_category_viewed": "Electronics",
    "device_type": "mobile",
    "geo_region": "US-West",
    "is_returning_customer": True,
    "lifetime_order_count": 7,
    "lifetime_spend_usd": 892.50,
    "updated_at": time.time(),
}

_feature_store["user_002"] = {
    "clicks_last_5m": 47,
    "cart_adds_last_5m": 0,
    "page_views_last_5m": 52,
    "avg_session_duration_sec": 15,
    "last_category_viewed": "Gift Cards",
    "device_type": "desktop",
    "geo_region": "EU-East",
    "is_returning_customer": False,
    "lifetime_order_count": 0,
    "lifetime_spend_usd": 0.0,
    "updated_at": time.time(),
}

_feature_store["user_003"] = {
    "clicks_last_5m": 3,
    "cart_adds_last_5m": 1,
    "page_views_last_5m": 5,
    "avg_session_duration_sec": 620,
    "last_category_viewed": "Dresses",
    "device_type": "tablet",
    "geo_region": "US-East",
    "is_returning_customer": True,
    "lifetime_order_count": 22,
    "lifetime_spend_usd": 3410.00,
    "updated_at": time.time(),
}


# ─── Feature Engineering Logic ───────────────────────────────────────────────

def compute_fraud_features(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Derives fraud-relevant signals from raw user behavior features.
    These would be consumed by fraud-service for real-time scoring.
    """
    clicks = features.get("clicks_last_5m", 0)
    session = features.get("avg_session_duration_sec", 0)
    is_returning = features.get("is_returning_customer", False)
    lifetime_orders = features.get("lifetime_order_count", 0)

    # High click velocity + short session = bot/fraud signal
    velocity_ratio = clicks / max(session, 1) * 60  # clicks per minute equivalent
    is_suspicious_velocity = velocity_ratio > 8.0

    # New account + high value cart = elevated risk
    new_account_risk = not is_returning and lifetime_orders == 0

    return {
        "click_velocity_per_min": round(velocity_ratio, 2),
        "is_suspicious_velocity": is_suspicious_velocity,
        "new_account_risk": new_account_risk,
        "risk_score_contribution": round(
            (30.0 if is_suspicious_velocity else 0.0) +
            (25.0 if new_account_risk else 0.0) +
            (10.0 if features.get("device_type") == "desktop" and not is_returning else 0.0),
            1
        ),
    }


def compute_pricing_features(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Derives pricing-relevant signals for dynamic price optimization.
    """
    lifetime_spend = features.get("lifetime_spend_usd", 0.0)
    lifetime_orders = features.get("lifetime_order_count", 0)
    is_returning = features.get("is_returning_customer", False)

    # High-value loyal customers get better dynamic pricing
    loyalty_tier = "STANDARD"
    if lifetime_spend > 2000:
        loyalty_tier = "PLATINUM"
    elif lifetime_spend > 500:
        loyalty_tier = "GOLD"

    return {
        "loyalty_tier": loyalty_tier,
        "avg_order_value": round(lifetime_spend / max(lifetime_orders, 1), 2),
        "price_sensitivity_score": round(
            0.8 if loyalty_tier == "PLATINUM" else (0.5 if loyalty_tier == "GOLD" else 0.2), 2
        ),
        "eligible_for_dynamic_discount": loyalty_tier in ("GOLD", "PLATINUM"),
    }


# ─── Pydantic Models ─────────────────────────────────────────────────────────

class RecommendationResponse(BaseModel):
    userId: str
    recommendedProductIds: List[str]
    modelVariant: str

class FeatureIngestRequest(BaseModel):
    userId: str
    eventType: str  # "click", "page_view", "cart_add", "purchase"
    metadata: Optional[Dict[str, Any]] = None

class FeatureVector(BaseModel):
    userId: str
    rawFeatures: Dict[str, Any]
    fraudSignals: Dict[str, Any]
    pricingSignals: Dict[str, Any]
    featureStalenessSec: float


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ml-service", "version": "2.0.0", "featureStore": "active"}


@app.get("/api/recommendations/{user_id}", response_model=RecommendationResponse)
def get_recommendations(user_id: str, count: int = 5):
    """Collaborative filtering recommendations with feature-store context."""
    # In production: query feature store for user preferences, then run NCF model
    features = _feature_store.get(user_id, {})
    category = features.get("last_category_viewed", "General")

    # Deterministic mock recommendations seeded by user_id + category
    seed = int(hashlib.md5(f"{user_id}:{category}".encode()).hexdigest()[:8], 16)
    mock_ids = [f"prod_{(seed + i * 37) % 500 + 100}" for i in range(count)]

    return RecommendationResponse(
        userId=user_id,
        recommendedProductIds=mock_ids,
        modelVariant="NCF-v2.1-hybrid"
    )


@app.post("/api/features/ingest")
def ingest_user_event(payload: FeatureIngestRequest):
    """
    Ingests a real-time user behavior event and updates the feature store.
    In production this writes to Redis with TTL-based sliding windows.
    """
    uid = payload.userId
    if uid not in _feature_store:
        _feature_store[uid] = {
            "clicks_last_5m": 0,
            "cart_adds_last_5m": 0,
            "page_views_last_5m": 0,
            "avg_session_duration_sec": 0,
            "last_category_viewed": "Unknown",
            "device_type": "unknown",
            "geo_region": "unknown",
            "is_returning_customer": False,
            "lifetime_order_count": 0,
            "lifetime_spend_usd": 0.0,
            "updated_at": time.time(),
        }

    event = payload.eventType.lower()
    if event == "click":
        _feature_store[uid]["clicks_last_5m"] += 1
    elif event == "page_view":
        _feature_store[uid]["page_views_last_5m"] += 1
    elif event == "cart_add":
        _feature_store[uid]["cart_adds_last_5m"] += 1
    elif event == "purchase":
        _feature_store[uid]["lifetime_order_count"] += 1
        amount = (payload.metadata or {}).get("amount", 0)
        _feature_store[uid]["lifetime_spend_usd"] += amount

    if payload.metadata:
        if "category" in payload.metadata:
            _feature_store[uid]["last_category_viewed"] = payload.metadata["category"]
        if "device" in payload.metadata:
            _feature_store[uid]["device_type"] = payload.metadata["device"]

    _feature_store[uid]["updated_at"] = time.time()

    return {
        "success": True,
        "userId": uid,
        "eventType": event,
        "featureStoreUpdated": True,
    }


@app.get("/api/features/{user_id}", response_model=FeatureVector)
def get_user_features(user_id: str):
    """
    Retrieves the real-time feature vector for a user, including derived
    fraud and pricing signals for downstream model consumption.
    """
    features = _feature_store.get(user_id)
    if not features:
        return FeatureVector(
            userId=user_id,
            rawFeatures={},
            fraudSignals={"risk_score_contribution": 0},
            pricingSignals={"loyalty_tier": "UNKNOWN"},
            featureStalenessSec=-1,
        )

    staleness = round(time.time() - features.get("updated_at", time.time()), 2)

    return FeatureVector(
        userId=user_id,
        rawFeatures={k: v for k, v in features.items() if k != "updated_at"},
        fraudSignals=compute_fraud_features(features),
        pricingSignals=compute_pricing_features(features),
        featureStalenessSec=staleness,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8006, reload=True)