-- MySQL Data Warehouse Schema for E-commerce Analytics
-- This schema follows a Star Schema design for optimized analytical queries.

CREATE DATABASE IF NOT EXISTS ecommerce_warehouse;
USE ecommerce_warehouse;

-- 1. Users Dimension Table
CREATE TABLE IF NOT EXISTS dim_users (
    user_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    country VARCHAR(100),
    created_at DATETIME,
    INDEX (email),
    INDEX (created_at)
);

-- 2. Products Dimension Table
CREATE TABLE IF NOT EXISTS dim_products (
    product_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME,
    INDEX (category),
    INDEX (price)
);

-- 3. Orders Fact Table
CREATE TABLE IF NOT EXISTS fact_orders (
    order_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50),
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES dim_users(user_id),
    INDEX (user_id),
    INDEX (created_at),
    INDEX (status)
);

-- 4. Order Items Fact Table
CREATE TABLE IF NOT EXISTS fact_order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255),
    product_id VARCHAR(255),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES fact_orders(order_id),
    FOREIGN KEY (product_id) REFERENCES dim_products(product_id),
    INDEX (order_id),
    INDEX (product_id)
);

-- 5. Events Fact Table (User Behavior)
CREATE TABLE IF NOT EXISTS fact_events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255),
    product_id VARCHAR(255),
    event_type ENUM('view', 'add_to_cart', 'purchase', 'click') NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES dim_users(user_id),
    FOREIGN KEY (product_id) REFERENCES dim_products(product_id),
    INDEX (user_id),
    INDEX (product_id),
    INDEX (timestamp),
    INDEX (event_type)
);

-- 6. Customer Metrics (Pre-aggregated for ML/Dashboard)
CREATE TABLE IF NOT EXISTS customer_metrics (
    user_id VARCHAR(255) PRIMARY KEY,
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(15, 2) DEFAULT 0.00,
    avg_order_value DECIMAL(10, 2) DEFAULT 0.00,
    last_purchase_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES dim_users(user_id)
);

-- 7. Product Metrics (Pre-aggregated for Recommendations)
CREATE TABLE IF NOT EXISTS product_metrics (
    product_id VARCHAR(255) PRIMARY KEY,
    total_sales INT DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0.00,
    total_views INT DEFAULT 0,
    conversion_rate DECIMAL(5, 4) DEFAULT 0.0000,
    FOREIGN KEY (product_id) REFERENCES dim_products(product_id)
);
