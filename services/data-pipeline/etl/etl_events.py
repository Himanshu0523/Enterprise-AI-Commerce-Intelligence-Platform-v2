import os
from pymongo import MongoClient
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def run_etl():
    """Extract Behavioral Events from MongoDB and Load into MySQL Warehouse."""
    print("Starting ETL for Events...")
    
    mongo_client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/ecommerce"))
    mongo_db = mongo_client.get_database()
    events_col = mongo_db.events
    
    mysql_conn = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASS", ""),
        database=os.getenv("MYSQL_DB", "ecommerce_warehouse")
    )
    cursor = mysql_conn.cursor()
    
    all_events = events_col.find()
    
    for event in all_events:
        user_id = str(event['user_id'])
        product_id = str(event['product_id'])
        event_type = event['event_type']
        timestamp = event['timestamp']
        
        # Insert into fact_events
        sql = """INSERT INTO fact_events (user_id, product_id, event_type, timestamp) 
                 VALUES (%s, %s, %s, %s)"""
        cursor.execute(sql, (user_id, product_id, event_type, timestamp))
        
    mysql_conn.commit()
    cursor.close()
    mysql_conn.close()
    print("ETL for Events completed successfully.")

if __name__ == "__main__":
    run_etl()
