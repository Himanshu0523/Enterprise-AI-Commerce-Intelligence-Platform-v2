import os
import joblib
import pandas as pd
import numpy as np

# ARIMA can be slow and requires statsmodels.
# We will use a simple heuristic or mock linear model to act as our "ARIMA" placeholder.
from sklearn.linear_model import LinearRegression

def load_sales_data():
    print("Loading mock sales data for forecasting...")
    # Mock data: Product ID, Date, Sales Quantity
    dates = pd.date_range(start='1/1/2026', periods=90)
    product_ids = [1, 2, 3, 4, 5] # Mock high demanding products
    
    data = []
    for pid in product_ids:
        for i, date in enumerate(dates):
            # Introduce a slight trend and noise
            sales = max(0, int(10 + i * 0.5 + np.random.normal(0, 5)))
            data.append({'product_id': pid, 'date': date, 'day_index': i, 'sales': sales})
    
    return pd.DataFrame(data)

def train_arima_model(df):
    print("Training Linear Regression (mock ARIMA) for demand forecast...")
    models = {}
    
    # Dictionary mapping product IDs to a trained forecasting model
    for pid in df['product_id'].unique():
        product_data = df[df['product_id'] == pid]
        
        X = product_data[['day_index']]
        y = product_data['sales']
        
        model = LinearRegression()
        model.fit(X, y)
        
        # Save last date info to project future dates
        last_day_index = product_data['day_index'].max()
        last_date = product_data['date'].max()
        
        models[pid] = {
            'model': model,
            'last_day_index': last_day_index,
            'last_date': last_date
        }
        
    return models

def save_model(models, model_dir):
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'demand_forecast.pkl')
    joblib.dump(models, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.join(current_dir, '..', 'models')
    
    df = load_sales_data()
    models = train_arima_model(df)
    save_model(models, model_dir)
