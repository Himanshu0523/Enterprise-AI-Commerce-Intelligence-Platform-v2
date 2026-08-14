from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Fraud Detection Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FraudEvaluationRequest(BaseModel):
    orderId: str
    userId: str
    totalAmount: float
    ipAddress: Optional[str] = "127.0.0.1"
    shippingCountry: Optional[str] = "US"
    billingCountry: Optional[str] = "US"

class FraudEvaluationResponse(BaseModel):
    orderId: str
    riskScore: int  # 0 to 100
    riskLevel: str  # LOW, MEDIUM, HIGH
    flags: List[str]
    allowTransaction: bool

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "fraud-service"}

@app.post("/api/fraud/evaluate", response_model=FraudEvaluationResponse)
def evaluate_fraud(payload: FraudEvaluationRequest):
    risk = 10
    flags = []

    if payload.totalAmount > 1000:
        risk += 35
        flags.append("High order value (> $1,000)")

    if payload.shippingCountry != payload.billingCountry:
        risk += 30
        flags.append("Shipping & billing country mismatch")

    if risk < 30:
        level = "LOW"
        allow = True
    elif risk < 70:
        level = "MEDIUM"
        allow = True
    else:
        level = "HIGH"
        allow = False

    return FraudEvaluationResponse(
        orderId=payload.orderId,
        riskScore=risk,
        riskLevel=level,
        flags=flags,
        allowTransaction=allow
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=True)
