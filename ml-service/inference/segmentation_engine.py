import os
import joblib

def load_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, '..', 'models', 'customer_segmentation.pkl')
    try:
        return joblib.load(model_path)
    except Exception as e:
        print(f"Error loading segmentation model: {e}")
        return None

def segment_customer(total_spent, total_orders, recency_days):
    model_data = load_model()
    
    if not model_data:
         return {"segment": "Unknown (Model missing)"}
         
    try:
        kmeans = model_data['kmeans']
        scaler = model_data['scaler']
        
        # Scale input
        input_data = scaler.transform([[total_spent, total_orders, recency_days]])
        
        # Predict cluster
        cluster = kmeans.predict(input_data)[0]
        
        segment_names = {
            0: "Lost Customers",
            1: "At Risk",
            2: "Loyal Customers",
            3: "Champions" 
        }
        
        return {
            "cluster_id": int(cluster),
            "segment_name": segment_names.get(int(cluster), "Other")
        }
    except Exception as e:
         return {"error": str(e)}
