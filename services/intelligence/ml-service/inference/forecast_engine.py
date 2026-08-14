import os
import joblib
import datetime
import pandas as pd

def load_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, '..', 'models', 'demand_forecast.pkl')
    try:
         return joblib.load(model_path)
    except Exception as e:
         print(f"Error loading demand forecast model: {e}")
         return None

def predict_future_sales(product_id: int, days_ahead: int = 7):
    models = load_model()
    
    if not models or product_id not in models:
         # Fallback mock
         return {
             "product_id": product_id,
             "forecast": [{"day_ahead": i, "predicted_sales": 10} for i in range(1, days_ahead + 1)],
             "note": "Fallback mock. Model not found for product."
         }
         
    try:
         model_info = models[product_id]
         model = model_info['model']
         last_day_index = model_info['last_day_index']
         
         # Prepare future indices
         future_indices = pd.DataFrame({'day_index': range(last_day_index + 1, last_day_index + 1 + days_ahead)})
         predicted_sales = model.predict(future_indices)
         
         forecast_results = []
         for i, sales in enumerate(predicted_sales):
             forecast_results.append({
                 "day_ahead": i + 1,
                 "predicted_sales": max(0, int(sales))
             })
             
         return {
             "product_id": product_id,
             "forecast": forecast_results
         }
         
    except Exception as e:
         return {"error": str(e)}
