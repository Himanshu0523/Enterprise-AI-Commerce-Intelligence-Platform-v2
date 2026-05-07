import sys
import os

# Ensure the root of ml-service is in Python path for absolute imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from api.routes import router


app = FastAPI(
    title="ML Recommendation Service",
    description="AI APIs for E-commerce Application",
    version="1.0.0"
)

app.include_router(router)

@app.get("/")
def health_check():
    return {"status" : "ML Service running", "routes": ["/ai/recommendations/{userId}", "/ai/similar-products/{productId}", "/ai/forecast/{productId}"]}