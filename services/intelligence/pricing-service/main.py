import sys, os, importlib
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../packages/tracing/python')))

try:
    from packages.tracing.python.tracer import init_tracing, instrument_fastapi_app
except ImportError:
    try:
        _tracer_mod = importlib.import_module("tracer")
        init_tracing = getattr(_tracer_mod, "init_tracing")
        instrument_fastapi_app = getattr(_tracer_mod, "instrument_fastapi_app")
    except Exception:
        def init_tracing(*args, **kwargs): pass
        def instrument_fastapi_app(*args, **kwargs): pass

init_tracing("pricing-service")


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Dynamic Pricing Service", version="1.0.0")
instrument_fastapi_app(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PricingRequest(BaseModel):
    productId: str
    basePrice: float
    currentStock: int
    competitorPrice: float = 0.0

class PricingResponse(BaseModel):
    productId: str
    basePrice: float
    recommendedPrice: float
    multiplier: float
    priceStrategyReason: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "pricing-service"}

@app.post("/api/pricing/optimize", response_model=PricingResponse)
def optimize_price(payload: PricingRequest):
    mult = 1.0
    reason = "Standard baseline pricing"

    if payload.currentStock < 10 and payload.currentStock > 0:
        mult += 0.15
        reason = "Low stock surge pricing (+15%)"
    elif payload.currentStock > 200:
        mult -= 0.10
        reason = "High stock clearance incentive (-10%)"

    if payload.competitorPrice > 0 and payload.competitorPrice < payload.basePrice * mult:
        mult = (payload.competitorPrice * 0.98) / payload.basePrice
        reason = "Competitor price match discount"

    recommended = round(payload.basePrice * mult, 2)
    return PricingResponse(
        productId=payload.productId,
        basePrice=payload.basePrice,
        recommendedPrice=recommended,
        multiplier=round(mult, 2),
        priceStrategyReason=reason
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)
