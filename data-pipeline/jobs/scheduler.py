import time
import os
import schedule
from etl.etl_products import run_etl as update_products
from etl.etl_orders import run_etl as update_orders
from etl.etl_events import run_etl as update_events
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def refresh_metrics():
    """Calls MySQL stored procedures to refresh pre-aggregated metrics."""
    print("Refreshing warehouse metrics...")
    try:
        mysql_conn = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "localhost"),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASS", ""),
            database=os.getenv("MYSQL_DB", "ecommerce_warehouse")
        )
        cursor = mysql_conn.cursor()
        
        # Call the stored procedures created in warehouse/procedures.sql
        cursor.callproc('RefreshProductMetrics')
        cursor.callproc('RefreshCustomerMetrics')
        
        mysql_conn.commit()
        cursor.close()
        mysql_conn.close()
        print("Metrics refreshed successfully.")
    except Exception as e:
        print(f"Error refreshing metrics: {e}")

def daily_job():
    print("--- Starting Daily ETL & Metrics Refresh Job ---")
    update_products()
    update_orders()
    update_events()
    refresh_metrics()
    print("--- Daily Job Completed ---\n")

# Schedule the job to run every day at midnight (or every minute for testing)
schedule.every().day.at("00:00").do(daily_job)

if __name__ == "__main__":
    print("Job Scheduler started. Waiting for jobs...")
    # Initial run for testing
    daily_job()
    
    while True:
        schedule.run_pending()
        time.sleep(1)
