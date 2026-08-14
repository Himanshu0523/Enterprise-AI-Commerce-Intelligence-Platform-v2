from typing import Dict, Any, List
import aiohttp
import asyncio
from datetime import datetime, timedelta
import random

class InventoryTool:
    """Tool for checking real-time inventory and stock levels"""
    
    def __init__(self, inventory_service_url: str = "http://localhost:3000"):
        self.inventory_service_url = inventory_service_url
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes
    
    async def check_stock(self, product_ids: List[str]) -> Dict[str, Any]:
        """Check stock for multiple products"""
        results = {}
        
        for product_id in product_ids:
            # Check cache first
            if product_id in self.cache:
                cached_data, timestamp = self.cache[product_id]
                if (datetime.now() - timestamp).seconds < self.cache_ttl:
                    results[product_id] = cached_data
                    continue
            
            # Fetch from service
            stock_data = await self._fetch_stock(product_id)
            self.cache[product_id] = (stock_data, datetime.now())
            results[product_id] = stock_data
        
        return results
    
    async def get_warehouse_stock(self, product_id: str, pincode: str) -> Dict[str, Any]:
        """Get warehouse-specific stock based on pincode"""
        # Simulate finding nearest warehouse based on pincode
        warehouses = self._get_nearby_warehouses(pincode)
        
        stock_info = {
            "product_id": product_id,
            "pincode": pincode,
            "warehouses": [],
            "total_available": 0,
            "nearest_available": None
        }
        
        for warehouse in warehouses:
            quantity = random.randint(0, 20)
            stock_info["warehouses"].append({
                "warehouse": warehouse["name"],
                "location": warehouse["location"],
                "distance_km": warehouse["distance"],
                "quantity": quantity,
                "delivery_days": warehouse["delivery_days"]
            })
            stock_info["total_available"] += quantity
            
            if quantity > 0 and not stock_info["nearest_available"]:
                stock_info["nearest_available"] = warehouse
        
        return stock_info
    
    async def set_stock_alert(self, product_id: str, email: str, phone: str = None) -> Dict[str, Any]:
        """Set stock alert notification"""
        alert = {
            "alert_id": f"alert_{random.randint(10000, 99999)}",
            "product_id": product_id,
            "email": email,
            "phone": phone,
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "notification_channels": ["email"]
        }
        
        if phone:
            alert["notification_channels"].append("sms")
        
        # In production, save to database
        return alert
    
    async def get_restock_forecast(self, product_id: str) -> Dict[str, Any]:
        """Get restock forecast for out-of-stock items"""
        return {
            "product_id": product_id,
            "estimated_restock": (datetime.now() + timedelta(days=random.randint(3, 10))).strftime("%Y-%m-%d"),
            "confidence": random.uniform(0.7, 0.95),
            "demand_level": random.choice(["high", "medium", "low"]),
            "notify_count": random.randint(10, 100)
        }
    
    async def _fetch_stock(self, product_id: str) -> Dict[str, Any]:
        """Fetch stock from inventory service"""
        # In production, make actual API call
        await asyncio.sleep(0.1)  # Simulate API call
        
        return {
            "product_id": product_id,
            "in_stock": random.choice([True, True, True, False]),  # 75% in stock
            "quantity": random.randint(0, 50),
            "reserved": random.randint(0, 5),
            "damaged": random.randint(0, 2),
            "last_updated": datetime.now().isoformat()
        }
    
    def _get_nearby_warehouses(self, pincode: str) -> List[Dict]:
        """Get nearby warehouses based on pincode"""
        # Simulate warehouse lookup
        warehouses = [
            {"name": "Mumbai Central", "location": "Mumbai", "distance": 5.2, "delivery_days": 1},
            {"name": "Thane Hub", "location": "Thane", "distance": 25.8, "delivery_days": 2},
            {"name": "Pune Warehouse", "location": "Pune", "distance": 150.5, "delivery_days": 3},
        ]
        
        return sorted(warehouses, key=lambda x: x["distance"])