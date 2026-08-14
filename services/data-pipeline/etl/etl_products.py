import os
from pymongo import MongoClient
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def run_etl():
    """Extract Products from MongoDB and Load into MySQL Warehouse."""
    print("Starting ETL for Products...")
    
    mongo_client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/ecommerce"))
    mongo_db = mongo_client.get_database()
    products_col = mongo_db.products
    
    mysql_conn = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASS", ""),
        database=os.getenv("MYSQL_DB", "ecommerce_warehouse")
    )
    cursor = mysql_conn.cursor()
    
    # Fetch products from MongoDB
    all_products = products_col.find()
    
    for product in all_products:
        p_id = str(product['_id'])
        name = product['name']
        category = product.get('category', 'Uncategorized')
        price = product['price']
        created_at = product.get('created_at')
        
        # Insert into dim_products
        sql = """INSERT INTO dim_products (product_id, name, category, price, created_at) 
                 VALUES (%s, %s, %s, %s, %s) 
                 ON DUPLICATE KEY UPDATE name=%s, category=%s, price=%s"""
        cursor.execute(sql, (p_id, name, category, price, created_at, name, category, price))
        
    mysql_conn.commit()
    cursor.close()
    mysql_conn.close()
    print("ETL for Products completed successfully.")

if __name__ == "__main__":
    run_etl()
