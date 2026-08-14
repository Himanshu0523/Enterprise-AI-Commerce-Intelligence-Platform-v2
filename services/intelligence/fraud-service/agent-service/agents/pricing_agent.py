from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from typing import TypedDict
from datetime import datetime, timedelta
import random

class PricingState(TypedDict):
    products: List[Dict[str, Any]]
    pricing_data: List[Dict[str, Any]]
    deals: List[Dict[str, Any]]
    summary: Dict[str, Any]

class PricingAgent:
    """
    Pricing Agent - Provides dynamic pricing information, deals, and price comparisons
    Handles Indian market-specific pricing logic
    """
    
    def __init__(self):
        self.graph = self._build_graph()
        
        # Indian festival calendar for special deals
        self.festival_calendar = {
            "diwali": {"discount_range": (10, 30), "name": "Diwali Special"},
            "holi": {"discount_range": (5, 20), "name": "Holi Sale"},
            "republic_day": {"discount_range": (10, 25), "name": "Republic Day Sale"},
            "independence_day": {"discount_range": (10, 25), "name": "Independence Day Sale"},
            "dussehra": {"discount_range": (10, 25), "name": "Dussehra Offers"},
            "new_year": {"discount_range": (15, 40), "name": "New Year Sale"}
        }
        
        # Bank offers
        self.bank_offers = [
            {"bank": "HDFC", "discount": 10, "max_discount": 5000, "min_purchase": 50000},
            {"bank": "SBI", "discount": 10, "max_discount": 4000, "min_purchase": 40000},
            {"bank": "ICICI", "discount": 10, "max_discount": 3000, "min_purchase": 30000},
            {"bank": "Axis", "discount": 5, "max_discount": 2000, "min_purchase": 25000}
        ]

    def _build_graph(self):
        """Build the LangGraph workflow"""
        workflow = StateGraph(PricingState)
        
        workflow.add_node("fetch_current_prices", self.fetch_current_prices)
        workflow.add_node("calculate_deals", self.calculate_deals)
        workflow.add_node("apply_offers", self.apply_offers)
        workflow.add_node("generate_summary", self.generate_summary)
        
        workflow.set_entry_point("fetch_current_prices")
        workflow.add_edge("fetch_current_prices", "calculate_deals")
        workflow.add_edge("calculate_deals", "apply_offers")
        workflow.add_edge("apply_offers", "generate_summary")
        workflow.add_edge("generate_summary", END)
        
        return workflow.compile()

    async def fetch_current_prices(self, state: PricingState) -> PricingState:
        """Fetch current market prices"""
        products = state["products"]
        pricing_data = []
        
        for product in products:
            current_price = product["price"]
            mrp = int(current_price * random.uniform(1.1, 1.4))  # MRP usually higher
            
            # Get price history (last 30 days)
            price_history = self._generate_price_history(current_price)
            
            pricing_data.append({
                "product_id": product["id"],
                "product_name": product["name"],
                "current_price": current_price,
                "mrp": mrp,
                "discount_percentage": round((1 - current_price/mrp) * 100, 1),
                "price_history": price_history,
                "lowest_price_30_days": min(p["price"] for p in price_history),
                "highest_price_30_days": max(p["price"] for p in price_history),
                "average_price_30_days": sum(p["price"] for p in price_history) / len(price_history)
            })
        
        state["pricing_data"] = pricing_data
        return state

    async def calculate_deals(self, state: PricingState) -> PricingState:
        """Calculate available deals and offers"""
        pricing_data = state["pricing_data"]
        deals = []
        
        for item in pricing_data:
            product_deals = []
            
            # 1. Festival offers
            festival_deal = self._get_festival_deal()
            if festival_deal:
                festival_discount = festival_deal["discount"] / 100
                festival_price = int(item["current_price"] * (1 - festival_discount))
                product_deals.append({
                    "type": "festival",
                    "name": festival_deal["name"],
                    "discount_percentage": festival_deal["discount"],
                    "special_price": festival_price,
                    "savings": item["current_price"] - festival_price,
                    "valid_till": (datetime.now() + timedelta(days=7)).isoformat()
                })
            
            # 2. Exchange offers
            exchange_value = int(item["current_price"] * random.uniform(0.05, 0.15))
            product_deals.append({
                "type": "exchange",
                "name": "Exchange Offer",
                "exchange_value": exchange_value,
                "final_price": item["current_price"] - exchange_value,
                "savings": exchange_value
            })
            
            # 3. EMI options
            product_deals.append({
                "type": "emi",
                "name": "No-Cost EMI",
                "options": [
                    {"months": 3, "monthly": item["current_price"] / 3},
                    {"months": 6, "monthly": item["current_price"] / 6},
                    {"months": 9, "monthly": item["current_price"] / 9},
                    {"months": 12, "monthly": item["current_price"] / 12}
                ]
            })
            
            # 4. Bundle offers
            if item["current_price"] > 50000:
                product_deals.append({
                    "type": "bundle",
                    "name": "Bundle Offer",
                    "description": "Free accessories worth up to ₹3,000",
                    "free_items": ["Laptop Bag", "Wireless Mouse", "Mousepad"]
                })
            
            deals.append({
                "product_id": item["product_id"],
                "product_name": item["product_name"],
                "deals": product_deals
            })
        
        state["deals"] = deals
        return state

    async def apply_offers(self, state: PricingState) -> PricingState:
        """Apply additional offers like bank discounts"""
        for deal in state["deals"]:
            # Add random bank offer
            bank_offer = random.choice(self.bank_offers)
            
            product_price = next(
                p["current_price"] 
                for p in state["pricing_data"] 
                if p["product_id"] == deal["product_id"]
            )
            
            if product_price >= bank_offer["min_purchase"]:
                discount_amount = min(
                    int(product_price * bank_offer["discount"] / 100),
                    bank_offer["max_discount"]
                )
                
                deal["deals"].append({
                    "type": "bank_offer",
                    "name": f"{bank_offer['bank']} Bank Offer",
                    "discount_amount": discount_amount,
                    "description": f"Get {bank_offer['discount']}% instant discount up to ₹{bank_offer['max_discount']:,} with {bank_offer['bank']} Bank cards"
                })
        
        return state

    async def generate_summary(self, state: PricingState) -> PricingState:
        """Generate pricing summary"""
        pricing_data = state["pricing_data"]
        
        if not pricing_data:
            state["summary"] = {"message": "No pricing data available"}
            return state
        
        total_original = sum(item["mrp"] for item in pricing_data)
        total_current = sum(item["current_price"] for item in pricing_data)
        total_savings = total_original - total_current
        
        # Find best deal
        best_deal_product = min(pricing_data, key=lambda x: x["discount_percentage"])
        
        summary = {
            "total_products": len(pricing_data),
            "price_range": {
                "min": min(item["current_price"] for item in pricing_data),
                "max": max(item["current_price"] for item in pricing_data),
                "average": sum(item["current_price"] for item in pricing_data) / len(pricing_data)
            },
            "total_savings_possible": total_savings,
            "average_discount": round(
                sum(item["discount_percentage"] for item in pricing_data) / len(pricing_data),
                1
            ),
            "best_discount": {
                "product": best_deal_product["product_name"],
                "discount": f"{best_deal_product['discount_percentage']}%",
                "savings": best_deal_product["mrp"] - best_deal_product["current_price"]
            },
            "recommendation": self._generate_price_recommendation(pricing_data)
        }
        
        state["summary"] = summary
        return state

    def _generate_price_history(self, current_price: float) -> List[Dict]:
        """Generate mock price history for last 30 days"""
        history = []
        base_price = current_price * random.uniform(0.9, 1.1)
        
        for days_ago in range(30, 0, -1):
            # Simulate price fluctuations
            variation = random.uniform(-0.05, 0.05)
            price = int(base_price * (1 + variation))
            
            history.append({
                "date": (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d"),
                "price": price
            })
        
        return history

    def _get_festival_deal(self) -> Dict:
        """Get current festival deal if any"""
        current_date = datetime.now()
        
        # Check if we're near any festival
        for festival, details in self.festival_calendar.items():
            # In production, use actual festival dates
            if random.random() < 0.3:  # 30% chance of festival deal
                return {
                    "name": details["name"],
                    "discount": random.randint(
                        details["discount_range"][0],
                        details["discount_range"][1]
                    )
                }
        
        return None

    def _generate_price_recommendation(self, pricing_data: List[Dict]) -> str:
        """Generate price recommendation"""
        avg_price = sum(item["current_price"] for item in pricing_data) / len(pricing_data)
        avg_discount = sum(item["discount_percentage"] for item in pricing_data) / len(pricing_data)
        
        if avg_discount > 25:
            return "Great time to buy! Prices are significantly lower than MRP."
        elif avg_discount > 15:
            return "Good deals available. Consider checking bank offers for additional savings."
        else:
            return "Prices are close to MRP. You may want to wait for upcoming sales."

    async def process(self, products: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Process pricing information"""
        initial_state = {
            "products": products,
            "pricing_data": [],
            "deals": [],
            "summary": {}
        }
        
        result = await self.graph.ainvoke(initial_state)
        return {
            "pricing": result["pricing_data"],
            "deals": result["deals"],
            "summary": result["summary"]
        }