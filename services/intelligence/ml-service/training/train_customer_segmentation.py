import os
import joblib
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def load_customer_metrics():
    print("Loading mock customer metrics...")
    # Mock data: Customer ID, Total Spent, Total Orders, Days Since Last Order
    data = {
        'customer_id': np.arange(1, 201),
        'total_spent': np.random.exponential(scale=500, size=200),
        'total_orders': np.random.poisson(lam=5, size=200),
        'recency_days': np.random.randint(1, 365, 200)
    }
    return pd.DataFrame(data)

def normalize_features(df):
    print("Normalizing features...")
    scaler = StandardScaler()
    features = ['total_spent', 'total_orders', 'recency_days']
    scaled_data = scaler.fit_transform(df[features])
    return scaled_data, scaler, df['customer_id'].tolist()

def train_kmeans(scaled_data):
    print("Training KMeans clustering for customer segmentation...")
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    kmeans.fit(scaled_data)
    return kmeans

def save_model(kmeans, scaler, customer_ids, model_dir):
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'customer_segmentation.pkl')
    
    model_data = {
        'kmeans': kmeans,
        'scaler': scaler,
        'customer_ids': customer_ids
    }
    joblib.dump(model_data, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.join(current_dir, '..', 'models')
    
    df = load_customer_metrics()
    scaled_data, scaler, customer_ids = normalize_features(df)
    kmeans = train_kmeans(scaled_data)
    save_model(kmeans, scaler, customer_ids, model_dir)
