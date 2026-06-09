from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from typing import TypedDict
from datetime import datetime, timedelta
import random

class InventoryState(TypedDict):
    products: List[Dict[str, Any]]
    inventory_data: List[Dict[str, Any]]
    availability_summary: Dict[str, Any]
    delivery_info: Dict[str, Any]

class InventoryAgent:
    """
    Inventory Agent - Manages stock availability, delivery estimates, and location-based inventory
    Specialized for Indian market with pincode-based delivery
    """
    
    def __init__(self):
        self.graph = self._build_graph()
        
        # Indian cities with warehouses
        self.warehouses = {
            "delhi": {"lat": 28.6139, "lon": 77.2090, "name": "Delhi NCR Warehouse"},
            "mumbai": {"lat": 19.0760, "lon": 72.8777, "name": "Mumbai Warehouse"},
            "bangalore": {"lat": 12.9716, "lon": 77.5946, "name": "Bangalore Warehouse"},
            "chennai": {"lat": 13.0827, "lon": 80.2707, "name": "Chennai Warehouse"},
            "kolkata": {"lat": 22.5726, "lon": 88.3639, "name": "Kolkata Warehouse"},
            "hyderabad": {"lat": 17.3850, "lon": 78.4867, "name": "Hyderabad Warehouse"},
            "pune": {"lat": 18.5204, "lon": 73.8567, "name": "Pune Warehouse"},
            "ahmedabad": {"lat": 23.0225, "lon": 72.5714, "name": "Ahmedabad Warehouse"}
        }
        
        # Delivery partners
        self.delivery_partners = [
            {"name": "Blue Dart", "rating": 4.5, "reliability": 0.95},
            {"name": "Delhivery", "rating": 4.3, "reliability": 0.92},
            {"name": "DTDC", "rating": 4.1, "reliability": 0.90},
            {"name": "Ecom Express", "rating": 4.2, "reliability": 0.91},
            {"name": "Xpressbees", "rating": 4.0, "reliability": 0.89}
        ]

    def _build_graph(self):
        """Build the LangGraph workflow"""
        workflow = StateGraph(InventoryState)
        
        workflow.add_node("check_stock", self.check_stock)
        workflow.add_node("calculate_delivery", self.calculate_delivery)
        workflow.add_node("check_alternatives", self.check_alternatives)
        workflow.add_node("generate_summary", self.generate_summary)
        
        workflow.set_entry_point("check_stock")
        workflow.add_edge("check_stock", "calculate_delivery")
        workflow.add_edge("calculate_delivery", "check_alternatives")
        workflow.add_edge("check_alternatives", "generate_summary")
        workflow.add_edge("generate_summary", END)
        
        return workflow.compile()

    async def check_stock(self, state: InventoryState) -> InventoryState:
        """Check stock availability for products"""
        products = state["products"]
        inventory_data = []
        
        for product in products:
            # Simulate inventory check
            stock_status = self._get_stock_status()
            
            inventory_data.append({
                "product_id": product["id"],
                "product_name": product["name"],
                "in_stock": stock_status["in_stock"],
                "quantity_available": stock_status["quantity"],
                "stock_status": stock_status["status"],
                "restock_date": stock_status["restock_date"],
                "warehouse_info": self._get_warehouse_info(product),
                "is_fast_moving": stock_status["is_fast_moving"],
                "last_updated": datetime.now().isoformat()
            })
        
        state["inventory_data"] = inventory_data
        return state

    async def calculate_delivery(self, state: InventoryState) -> InventoryState:
        """Calculate delivery estimates"""
        inventory_data = state["inventory_data"]
        delivery_info = {
            "estimated_delivery": {},
            "delivery_options": [],
            "pincode_serviceable": True
        }
        
        for item in inventory_data:
            if item["in_stock"]:
                # Calculate delivery time based on nearest warehouse
                nearest_warehouse = item["warehouse_info"]["nearest_warehouse"]
                base_delivery_days = self._calculate_base_delivery_time(nearest_warehouse)
                
                # Delivery options
                delivery_info["delivery_options"] = [
                    {
                        "type": "standard",
                        "name": "Standard Delivery",
                        "days": base_delivery_days,
                        "cost": 0,  # Free
                        "estimated_date": (datetime.now() + timedelta(days=base_delivery_days)).strftime("%Y-%m-%d")
                    },
                    {
                        "type": "express",
                        "name": "Express Delivery",
                        "days": max(1, base_delivery_days - 2),
                        "cost": 299,
                        "estimated_date": (datetime.now() + timedelta(days=max(1, base_delivery_days - 2))).strftime("%Y-%m-%d")
                    },
                    {
                        "type": "same_day",
                        "name": "Same Day Delivery",
                        "days": 0,
                        "cost": 599,
                        "available": base_delivery_days <= 1,
                        "estimated_date": datetime.now().strftime("%Y-%m-%d")
                    }
                ]
                
                # Assign delivery partner
                delivery_info["delivery_partner"] = random.choice(self.delivery_partners)
                
                # Pincode serviceability
                delivery_info["pincode_serviceable"] = random.random() > 0.05  # 95% serviceable
                
                break  # Use first available product for delivery estimate
        
        state["delivery_info"] = delivery_info
        return state

    async def check_alternatives(self, state: InventoryState) -> InventoryState:
        """Check for alternative products if out of stock"""
        for item in state["inventory_data"]:
            if not item["in_stock"]:
                item["alternatives"] = {
                    "suggestion": "This product is currently out of stock",
                    "restock_eta": item["restock_date"],
                    "notify_me_available": True,
                    "similar_products_available": True,
                    "message": f"Expected back in stock by {item['restock_date']}. Consider checking similar products."
                }
        
        return state

    async def generate_summary(self, state: InventoryState) -> InventoryState:
        """Generate inventory availability summary"""
        inventory_data = state["inventory_data"]
        
        available = [item for item in inventory_data if item["in_stock"]]
        out_of_stock = [item for item in inventory_data if not item["in_stock"]]
        
        summary = {
            "total_products": len(inventory_data),
            "available": len(available),
            "out_of_stock": len(out_of_stock),
            "overall_status": "available" if len(available) > 0 else "out_of_stock",
            "fastest_delivery": None,
            "urgent_notice": None
        }
        
        # Check for urgent notices
        for item in inventory_data:
            if item["is_fast_moving"] and item["quantity_available"] < 10:
                summary["urgent_notice"] = f"⚠️ {item['product_name']} is selling fast! Only {item['quantity_available']} left in stock."
                break
        
        # Find fastest delivery
        if state["delivery_info"]["delivery_options"]:
            summary["fastest_delivery"] = state["delivery_info"]["delivery_options"][0]
        
        state["availability_summary"] = summary
        return state

    def _get_stock_status(self) -> Dict[str, Any]:
        """Get stock status for a product"""
        statuses = [
            {"in_stock": True, "quantity": random.randint(10, 100), "status": "In Stock", "is_fast_moving": True},
            {"in_stock": True, "quantity": random.randint(50, 200), "status": "In Stock", "is_fast_moving": False},
            {"in_stock": True, "quantity": random.randint(1, 10), "status": "Low Stock", "is_fast_moving": True},
            {"in_stock": False, "quantity": 0, "status": "Out of Stock", "is_fast_moving": False},
        ]
        
        status = random.choice(statuses)
        
        if not status["in_stock"]:
            status["restock_date"] = (datetime.now() + timedelta(days=random.randint(3, 14))).strftime("%Y-%m-%d")
        else:
            status["restock_date"] = None
        
        return status

    def _get_warehouse_info(self, product: Dict) -> Dict:
        """Get warehouse information for a product"""
        # Simulate finding nearest warehouse
        warehouse_list = list(self.warehouses.values())
        nearest = random.choice(warehouse_list)
        
        return {
            "nearest_warehouse": nearest["name"],
            "warehouse_location": f"{nearest['lat']}, {nearest['lon']}",
            "available_warehouses": random.sample(warehouse_list, min(3, len(warehouse_list))),
            "stock_distribution": {
                wh["name"]: random.randint(0, 50)
                for wh in random.sample(warehouse_list, 3)
            }
        }

    def _calculate_base_delivery_time(self, warehouse: str) -> int:
        """Calculate base delivery time based on warehouse location"""
        # Simulate delivery time calculation
        # In production, use actual distance calculation
        city = warehouse.lower().split()[0]
        
        delivery_times = {
            "delhi": (1, 3),
            "mumbai": (1, 2),
            "bangalore": (1, 2),
            "chennai": (1, 2),
            "kolkata": (2, 4),
            "hyderabad": (1, 3),
            "pune": (1, 2),
            "ahmedabad": (1, 3)
        }
        
        time_range = delivery_times.get(city, (3, 7))
        return random.randint(time_range[0], time_range[1])

    async def process(self, products: List[Dict[str, Any]], pincode: str = None) -> Dict[str, Any]:
        """Process inventory information"""
        initial_state = {
            "products": products,
            "inventory_data": [],
            "availability_summary": {},
            "delivery_info": {}
        }
        
        result = await self.graph.ainvoke(initial_state)
        return {
            "inventory": result["inventory_data"],
            "availability": result["availability_summary"],
            "delivery": result["delivery_info"]
        }