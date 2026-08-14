import os
from pymongo import MongoClient
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def run_etl():
    """Extract Orders from MongoDB and Load into MySQL Warehouse."""
    print("Starting ETL for Orders...")
    
    # Connect to MongoDB
    mongo_client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/ecommerce"))
    mongo_db = mongo_client.get_database()
    orders_col = mongo_db.orders
    
    # Connect to MySQL Warehouse
    mysql_conn = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASS", ""),
        database=os.getenv("MYSQL_DB", "ecommerce_warehouse")
    )
    cursor = mysql_conn.cursor()
    
    # 1. Fetch orders from MongoDB
    # In a real scenario, we would only fetch orders since the last ETL run
    all_orders = orders_col.find()
    
    for order in all_orders:
        order_id = str(order['_id'])
        user_id = str(order['user_id'])
        total_price = order['total_price']
        status = order['status']
        created_at = order['created_at']
        
        # Insert/Update fact_orders in MySQL
        sql_order = """INSERT INTO fact_orders (order_id, user_id, total_price, status, created_at) 
                       VALUES (%s, %s, %s, %s, %s) 
                       ON DUPLICATE KEY UPDATE status=%s"""
        cursor.execute(sql_order, (order_id, user_id, total_price, status, created_at, status))
        
        # Insert fact_order_items for each item in the order
        for item in order.get('items', []):
            product_id = str(item['product_id'])
            quantity = item['quantity']
            price = item['price']
            
            sql_item = """INSERT INTO fact_order_items (order_id, product_id, quantity, price) 
                          VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql_item, (order_id, product_id, quantity, price))
            
    mysql_conn.commit()
    cursor.close()
    mysql_conn.close()
    print("ETL for Orders completed successfully.")

if __name__ == "__main__":
    run_etl()
