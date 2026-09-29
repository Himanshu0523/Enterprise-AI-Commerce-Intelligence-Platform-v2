# 33. SQL Deep Dive, Relational Analytics & Live Queries

## 1. Relational Database Fundamentals: ACID & Isolation Levels
- **ACID Properties**:
  - *Atomicity*: All transactions complete successfully or roll back completely.
  - *Consistency*: Data strictly obeys schema constraints (Foreign Keys, Unique constraints).
  - *Isolation*: Concurrent transactions do not interfere with each other.
  - *Durability*: Committed writes persist to disk despite power failure.
- **Transaction Isolation Levels & Concurrency Anomalies**:
  | Level | Dirty Read | Non-Repeatable Read | Phantom Read |
  | :--- | :---: | :---: | :---: |
  | **Read Uncommitted** | Yes | Yes | Yes |
  | **Read Committed** | **No** | Yes | Yes |
  | **Repeatable Read** (MySQL InnoDB Default) | **No** | **No** | **No** (via MVCC & Next-Key Locks) |
  | **Serializable** | **No** | **No** | **No** |

---

## 2. Normalization vs Denormalization & SQL Indexing
- **Normalization (1NF $\rightarrow$ 2NF $\rightarrow$ 3NF)**: Organizes database to reduce redundancy and anomalies.
  - *1NF*: Atomic values, no repeating groups.
  - *2NF*: 1NF + no partial key dependencies.
  - *3NF*: 2NF + no transitive dependencies.
- **Denormalization**: Intentionally adding redundant data to relational tables (`fact_orders`) to eliminate expensive JOINs in OLAP data warehouses.
- **Indexes (Clustered vs Non-Clustered & Composite)**:
  - *Clustered Index*: Physical table rows stored in B+ Tree order by Primary Key (1 per table).
  - *Non-Clustered Index*: Secondary B+ Tree mapping indexed columns to Primary Key lookup pointers.
  - *Composite Index*: Multicolumn index `(category_id, price)`. Follows Leftmost Prefix Rule.

---

## 3. Top Must-Master Live SQL Coding Problems (MySQL Data Warehouse)

### Query 1: Nth Highest Customer Salary / Spend
```sql
SELECT DISTINCT total_amount 
FROM fact_orders 
ORDER BY total_amount DESC 
LIMIT 1 OFFSET 1; -- 2nd Highest
```

### Query 2: Top N Orders per Category (Window Functions)
```sql
WITH RankedOrders AS (
    SELECT 
        order_id, 
        category_id, 
        total_amount,
        ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY total_amount DESC) AS rn
    FROM fact_orders
)
SELECT order_id, category_id, total_amount 
FROM RankedOrders 
WHERE rn <= 3;
```

### Query 3: Consecutive Records / Active Customer Days
```sql
SELECT customer_id 
FROM (
    SELECT customer_id, order_date,
           LAG(order_date, 1) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_date
    FROM fact_orders
) t
WHERE DATEDIFF(order_date, prev_date) = 1;
```

### Query 4: Customers with No Orders (LEFT JOIN vs Subquery)
```sql
SELECT c.customer_id, c.customer_name
FROM dim_customers c
LEFT JOIN fact_orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```
