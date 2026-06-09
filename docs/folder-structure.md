# Project Folder Structure

This document outlines the final directory structure of the AI-Powered E-Commerce Platform.

```text
ai-ecommerce-platform/
│
├── frontend/                 # React.js SPA (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page-level components
│   │   ├── services/         # API service layers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helper functions
│   │   └── context/          # React context providers
│   └── public/               # Static assets
│
├── backend/                  # Node.js & Express.js API
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── services/         # Business logic layer
│   │   ├── models/           # MongoDB (Mongoose) schemas
│   │   ├── routes/           # API router definitions
│   │   └── middleware/       # JWT auth, logging, etc.
│   ├── server.js             # Entry point
│   └── .env                  # Backend environment variables
│
├── ml-service/               # Python (FastAPI) AI Microservice
│   ├── api/                  # FastAPI routes
│   │   └── routes.py
│   ├── inference/            # Prediction logic (Loads models)
│   │   ├── recommendation_engine.py
│   │   ├── segmentation_engine.py
│   │   └── forecast_engine.py
│   ├── training/             # Model training scripts
│   │   ├── train_recommendation.py
│   │   ├── train_customer_segmentation.py
│   │   └── train_demand_forecast.py
│   ├── models/               # Pickle (.pkl) binaries
│   ├── main.py               # FastAPI entry point
│   └── requirements.txt      # Python dependencies
│
├── data-pipeline/            # Python ETL & Scheduling
│   ├── etl/                  # Transformation scripts
│   │   ├── etl_orders.py     # MongoDB -> MySQL (Orders)
│   │   ├── etl_events.py     # MongoDB -> MySQL (Events)
│   │   └── etl_products.py   # MongoDB -> MySQL (Products)
│   ├── jobs/                 # Cron/Task scheduling
│   │   └── scheduler.py      # Main job orchestrator
│   └── requirements.txt
│
├── warehouse/                # Analytical Data Storage (MySQL)
│   ├── schema.sql            # Star schema DDL
│   ├── analytics_queries.sql # Ready-to-use BI queries
│   └── procedures.sql        # Stored procedures for metric updates
│
├── docs/                     # Architectural & API Documentation
│   ├── srs.md                # Software Requirements Specification
│   ├── system-design.md      # High-level architecture
│   ├── database-design.md    # MongoDB & MySQL hybrid design
│   └── api-spec.md           # API endpoint definitions
│
├── agent-service/                 # NEW
│   ├── agents/
│   │   ├── customer_agent.py
│   │   ├── recommendation_agent.py
│   │   ├── pricing_agent.py
│   │   ├── inventory_agent.py
│   │   └── marketing_agent.py
│   │
│   ├── workflows/
│   │   └── shopping_workflow.py
│   │
│   ├── tools/
│   │   ├── product_search_tool.py
│   │   ├── inventory_tool.py
│   │   └── pricing_tool.py
│   │
│   └── main.py
│
├── rag-service/                   # NEW
│   ├── embeddings/
│   ├── vectorstore/
│   ├── ingestion/
│   ├── retrieval/
│   └── main.py
│
├── visual-search-service/         # NEW
│   ├── clip/
│   ├── embeddings/
│   ├── faiss_index/
│   └── main.py
│
├── fraud-service/                 # NEW
│   ├── models/
│   ├── training/
│   ├── inference/
│   └── main.py
│
├── pricing-service/               # NEW
│   ├── models/
│   ├── training/
│   ├── inference/
│   └── main.py
│
├── forecast-service/              # NEW
│   ├── lstm/
│   ├── prophet/
│   ├── tft/
│   └── main.py
│
├── kafka/
│   ├── producers/
│   ├── consumers/
│   └── topics.md
│
├── mlops/                         # NEW
│   ├── mlflow/
│   ├── dvc/
│   ├── airflow/
│   ├── model_registry/
│   └── pipelines/
│
├── vector-db/                     # NEW
│   ├── qdrant/
│   └── collections/
│
├── monitoring/                    # NEW
│   ├── prometheus/
│   ├── grafana/
│   └── dashboards/
│
├── docker/
│   ├── backend/
│   ├── frontend/
│   ├── agent-service/
│   └── docker-compose.yml
│
├── README.md                 # Main project overview & setup guide
├── ToDo.txt                  # Improvement ideas
└── .gitignore                # Global ignore rules
```
