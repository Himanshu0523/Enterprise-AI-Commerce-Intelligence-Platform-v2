from fastapi import APIRouter, HTTPException
from inference.recommendation_engine import get_user_recommendations, get_similar_products
from inference.forecast_engine import predict_future_sales
from inference.segmentation_engine import segment_customer

router = APIRouter(prefix="/ai", tags=["AI APIs"])

@router.get("/recommendations/{userId}")
def ai_recommendations(userId: int):
    """
    Get product recommendations for a specific user.
    """
    try:
        results = get_user_recommendations(userId)
        if "error" in results:
             raise HTTPException(status_code=500, detail=results["error"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/similar-products/{productId}")
def ai_similar_products(productId: int):
    """
    Get similar products to a given product ID.
    """
    try:
        results = get_similar_products(productId)
        if "error" in results:
             raise HTTPException(status_code=500, detail=results["error"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/forecast/{productId}")
def ai_forecast(productId: int, days: int = 7):
    """
    Predict future sales for a specific product.
    """
    try:
        results = predict_future_sales(productId, days_ahead=days)
        if "error" in results:
             raise HTTPException(status_code=500, detail=results["error"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/segmentation")
def ai_segment_customer(total_spent: float, total_orders: int, recency_days: int):
    """
    Segment a customer dynamically based on their metrics.
    """
    try:
        results = segment_customer(total_spent, total_orders, recency_days)
        if "error" in results:
             raise HTTPException(status_code=500, detail=results["error"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
