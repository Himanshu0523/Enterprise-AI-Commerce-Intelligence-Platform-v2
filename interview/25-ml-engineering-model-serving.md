# 25. ML Engineering, Feature Pipelines & Model Serving

## 1. Offline vs Online Feature Pipelines
- **Offline Training**: Weekly scheduled jobs compute user recommendation matrix and Prophet demand forecasting parameters using MySQL OLAP warehouse historical data.
- **Online Inference**: FastAPI endpoints consume real-time inputs (user's active search session, current cart, item stock) combined with pre-computed offline features stored in Redis.

---

## 2. Model Evaluation Metrics
| Domain | Model | Target Metrics |
| :--- | :--- | :--- |
| **Demand Forecasting** | Prophet / LSTM | **RMSE**, **MAE**, **MAPE** (Mean Absolute Percentage Error). |
| **Fraud Detection** | Anomaly Classification | **PR-AUC** (Precision-Recall AUC) prioritizing high precision to minimize customer false positives. |
| **Recommendations** | Collaborative / Content | **NDCG@10**, **Precision@K**, **Recall@K**. |
| **Visual Search** | CLIP + Qdrant | **Top-1 / Top-5 Accuracy** on item retrieval. |

---

## 3. Model Drift Monitoring & Retraining
- **Concept Drift**: Customer purchasing behavior changes due to seasonal trends or economic shifts.
- **Drift Detection**: Python background worker compares real-time prediction distribution against baseline training distribution using **Kolmogorov-Smirnov (KS) test**. Retraining job triggers automatically if drift exceeds threshold.
