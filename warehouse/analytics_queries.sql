-- Analytics Queries for Business Intelligence

-- 1. Top K = 10  Best Selling Products by Revenue
SELECT 
    p.name, 
    pm.total_revenue, 
    pm.total_sales
FROM product_metrics pm
JOIN dim_products p ON pm.product_id = p.product_id
ORDER BY pm.total_revenue DESC
LIMIT 10;

-- 2. Monthly Revenue Trend
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    SUM(total_price) AS monthly_revenue
FROM fact_orders
WHERE status = 'completed'
GROUP BY month
ORDER BY month DESC;

-- 3. Customer Segmentation (RFM Basic)
SELECT 
    user_id,
    total_orders,
    total_spent,
    DATEDIFF(NOW(), last_purchase_date) AS recency_days,
    CASE 
        WHEN total_spent > 5000 AND total_orders > 10 THEN 'Champion'
        WHEN total_spent > 1000 THEN 'Loyal Customer'
        WHEN DATEDIFF(NOW(), last_purchase_date) > 90 THEN 'At Risk'
        ELSE 'Regular'
    END AS customer_segment
FROM customer_metrics;

-- 4. Conversion Analysis per Category
SELECT 
    p.category,
    SUM(pm.total_views) AS total_views,
    SUM(pm.total_sales) AS total_sales,
    (SUM(pm.total_sales) / SUM(pm.total_views)) * 100 AS conversion_rate
FROM product_metrics pm
JOIN dim_products p ON pm.product_id = p.product_id
GROUP BY p.category
HAVING total_views > 0
ORDER BY conversion_rate DESC;

-- 5. Peak Order Times (Hour of Day)
SELECT 
    HOUR(created_at) AS order_hour,
    COUNT(*) AS order_count
FROM fact_orders
GROUP BY order_hour
ORDER BY order_count DESC;
