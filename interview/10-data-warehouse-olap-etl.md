# 10. MySQL Data Warehouse, OLAP & ETL Architecture

## 1. OLTP vs OLAP Architecture
- **OLTP (MongoDB)**: Optimized for fast, low-latency single-row read/write operations (checkout, cart updates, user auth).
- **OLAP (MySQL Data Warehouse)**: Optimized for heavy aggregate queries (monthly revenue by category, customer lifetime value) across millions of historical records without degrading MongoDB production API latency.

---

## 2. Dimensional Modeling (Star Schema)
```
         ┌───────────────────┐
         │   dim_customers   │
         └─────────┬─────────┘
                   │
                   ▼
┌──────────────────┐    ┌───────────────────┐
│   dim_products   │───►│    fact_orders    │
└──────────────────┘    └───────────────────┘
                   ▲
                   │
         ┌─────────┴─────────┐
         │     dim_time      │
         └───────────────────┘
```
- **Fact Table (`fact_orders`)**: Contains numerical measurements (`total_price`, `quantity`, `discount_amount`) and foreign keys to dimension tables.
- **Dimension Tables**: `dim_products` (SKU, brand, category), `dim_customers` (tier, signup date), `dim_time` (year, quarter, day).
- **Slowly Changing Dimensions (SCD Type 2)**: Tracks historical product price changes by adding `valid_from`, `valid_to`, and `is_current` columns to `dim_products`.

---

## 3. Python ETL Pipeline & CDC Ingestion
- **Extract**: Python ETL worker extracts change events from Kafka topic `mongodb-cdc` or queries MongoDB updated records since `last_checkpoint_timestamp`.
- **Transform**: Flattens nested MongoDB JSON documents (e.g. unnesting order line-items) and normalizes IDs into warehouse integer keys.
- **Load**: Performs batch upserts into MySQL: `INSERT INTO fact_orders (...) VALUES (...) ON DUPLICATE KEY UPDATE total_price=VALUES(total_price)`.

---

## 4. Resilience & Error Handling in ETL
- **What if ETL Crashes Halfway?**: Jobs are **idempotent**. State is checkpointed in MySQL table `etl_checkpoints(job_name, last_successful_timestamp)`. Re-running the job re-reads from the checkpoint without duplicating records.
- **Deduplication**: Deduplicates records using unique composite keys (`order_id` + `product_id`).
- **Late-Arriving Data**: Pipeline processes events using event generation timestamp (`event_time`) rather than ETL execution timestamp (`processing_time`).
