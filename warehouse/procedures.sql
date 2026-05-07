-- Stored Procedures for Data Warehouse Maintenance

DELIMITER //

-- Procedure to refresh Product Metrics based on new sales/views
CREATE PROCEDURE IF NOT EXISTS RefreshProductMetrics()
BEGIN
    -- Update Sales and Revenue
    INSERT INTO product_metrics (product_id, total_sales, total_revenue)
    SELECT 
        product_id, 
        SUM(quantity), 
        SUM(price * quantity)
    FROM fact_order_items
    GROUP BY product_id
    ON DUPLICATE KEY UPDATE 
        total_sales = VALUES(total_sales),
        total_revenue = VALUES(total_revenue);

    -- Update Views
    UPDATE product_metrics pm
    INNER JOIN (
        SELECT product_id, COUNT(*) as view_count
        FROM fact_events
        WHERE event_type = 'view'
        GROUP BY product_id
    ) ev ON pm.product_id = ev.product_id
    SET pm.total_views = ev.view_count;

    -- Update Conversion Rate
    UPDATE product_metrics
    SET conversion_rate = CASE WHEN total_views > 0 THEN total_sales / total_views ELSE 0 END;
END //

-- Procedure to refresh Customer Metrics
CREATE PROCEDURE IF NOT EXISTS RefreshCustomerMetrics()
BEGIN
    INSERT INTO customer_metrics (user_id, total_orders, total_spent, last_purchase_date, avg_order_value)
    SELECT 
        user_id, 
        COUNT(order_id), 
        SUM(total_price), 
        MAX(created_at),
        AVG(total_price)
    FROM fact_orders
    WHERE status = 'completed'
    GROUP BY user_id
    ON DUPLICATE KEY UPDATE 
        total_orders = VALUES(total_orders),
        total_spent = VALUES(total_spent),
        last_purchase_date = VALUES(last_purchase_date),
        avg_order_value = VALUES(avg_order_value);
END //

DELIMITER ;
