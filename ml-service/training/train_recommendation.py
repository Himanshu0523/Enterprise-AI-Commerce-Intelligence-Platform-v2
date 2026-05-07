import os
import joblib
import pandas as pd
import numpy as np
from sklearn.decomposition import TruncatedSVD

def load_data():
    print("Loading mock user-item interaction data...")
    # Mock data: User ID, Product ID, Rating
    data = {
        'user_id': np.random.randint(1, 100, 1000),
        'product_id': np.random.randint(1, 50, 1000),
        'rating': np.random.randint(1, 6, 1000)
    }
    return pd.DataFrame(data)

def build_user_item_matrix(df):
    print("Building user-item matrix...")
    matrix = df.pivot_table(index='user_id', columns='product_id', values='rating').fillna(0)
    return matrix

def train_collaborative_filtering(matrix):
    print("Training Singular Value Decomposition (SVD) model for recommendations...")
    svd = TruncatedSVD(n_components=10, random_state=42)
    matrix_reduced = svd.fit_transform(matrix)
    
    # We save the reconstructed matrix or the components to generate recommendations
    # For a mock, we'll just save the svd object, matrix indices and components
    model_data = {
        'svd': svd,
        'user_ids': matrix.index.tolist(),
        'product_ids': matrix.columns.tolist(),
        'matrix_reduced': matrix_reduced,
        'components': svd.components_
    }
    return model_data

def save_model(model_data, model_dir):
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'recommendation_model.pkl')
    joblib.dump(model_data, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.join(current_dir, '..', 'models')
    
    df = load_data()
    matrix = build_user_item_matrix(df)
    model_data = train_collaborative_filtering(matrix)
    save_model(model_data, model_dir)
