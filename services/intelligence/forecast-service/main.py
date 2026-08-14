from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import random
from datetime import datetime, timedelta

app = FastAPI(title="Demand Forecast Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ForecastItem(BaseModel):
    date: str
    predictedDemand: int
    confidenceIntervalLower: int
    confidenceIntervalUpper: int

class ForecastResponse(BaseModel):
    productId: str
    horizonDays: int
    forecast: List[ForecastItem]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "forecast-service"}

@app.get("/api/forecast/{product_id}", response_model=ForecastResponse)
def get_demand_forecast(product_id: str, days: int = 7):
    forecast_list = []
    base_demand = random.randint(20, 100)
    
    for i in range(days):
        day_date = (datetime.now() + timedelta(days=i+1)).strftime("%Y-%m-%d")
        variation = random.randint(-10, 15)
        pred = max(5, base_demand + variation)
        forecast_list.append(ForecastItem(
            date=day_date,
            predictedDemand=pred,
            confidenceIntervalLower=max(0, pred - 5),
            confidenceIntervalUpper=pred + 8
        ))
        
    return ForecastResponse(productId=product_id, horizonDays=days, forecast=forecast_list)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
