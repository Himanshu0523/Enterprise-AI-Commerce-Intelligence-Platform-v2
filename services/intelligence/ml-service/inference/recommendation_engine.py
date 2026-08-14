import os
import joblib
import pandas as pd
import numpy as np

def load_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, '..', 'models', 'recommendation_model.pkl')
    try:
        model_data = joblib.load(model_path)
        return model_data
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def get_user_recommendations(user_id: int):
    model_data = load_model()
    
    if not model_data:
        # Fallback to random if model fails or does not exist
        return {"user_id": user_id, "recommendations": np.random.choice(range(1, 50), 5).tolist()}
        
    try:
        # Complex SVD lookup mock...
        user_ids = np.array(model_data['user_ids'])
        
        if user_id in user_ids:
            # We just return random choice from products for simplicity of mock
            # In a real SVD it would be finding top-K reconstructed scores
            products = np.array(model_data['product_ids'])
            recs = np.random.choice(products, 5, replace=False).tolist()
            return {"user_id": user_id, "recommendations": recs}
        else:
             return {"user_id": user_id, "recommendations": np.random.choice(range(1, 50), 5).tolist(), "note": "Cold start"}
    except Exception as e:
        return {"error": str(e)}

def get_similar_products(product_id: int):
    model_data = load_model()
    
    if not model_data:
         return {"product_id": product_id, "similar_products": np.random.choice(range(1, 50), 5).tolist()}
         
    products = np.array(model_data['product_ids'])
    
    # Just a mock to return different products
    if len(products) > 0:
         recs = np.random.choice(products, 5, replace=False).tolist()
         return {"product_id": product_id, "similar_products": recs}
    
    return {"product_id": product_id, "similar_products": []}
