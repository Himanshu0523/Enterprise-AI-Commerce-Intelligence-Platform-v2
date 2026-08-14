from typing import Dict, Any, List
import aiohttp
import asyncio
from datetime import datetime, timedelta
import random

class PricingTool:
    """Tool for dynamic pricing calculations and price comparisons"""
    
    def __init__(self, pricing_service_url: str = "http://localhost:3000"):
        self.pricing_service_url = pricing_service_url
        
    async def get_current_price(self, product_id: str) -> Dict[str, Any]:
        """Get current price for a product"""
        # In production, fetch from pricing service
        await asyncio.sleep(0.1)
        
        return {
            "product_id": product_id,
            "current_price": random.randint(30000, 150000),
            "mrp": random.randint(35000, 200000),
            "last_updated": datetime.now().isoformat(),
            "price_trend": random.choice(["increasing", "stable", "decreasing"])
        }
    
    async def compare_prices(self, product_ids: List[str]) -> Dict[str, Any]:
        """Compare prices across multiple products"""
        comparisons = []
        
        for product_id in product_ids:
            # Get prices from different sellers
            seller_prices = []
            for seller in ["Amazon", "Flipkart", "Croma", "Reliance Digital"]:
                price = random.randint(25000, 100000)
                seller_prices.append({
                    "seller": seller,
                    "price": price,
                    "delivery_charge": random.choice([0, 49, 99]),
                    "in_stock": random.choice([True, True, True, False]),
                    "rating": round(random.uniform(3.5, 5.0), 1),
                    "warranty": "1 Year"
                })
            
            # Sort by price
            seller_prices.sort(key=lambda x: x["price"])
            
            comparisons.append({
                "product_id": product_id,
                "lowest_price": seller_prices[0]["price"],
                "highest_price": seller_prices[-1]["price"],
                "average_price": sum(s["price"] for s in seller_prices) / len(seller_prices),
                "sellers": seller_prices,
                "best_deal": seller_prices[0]
            })
        
        return {"comparisons": comparisons}
    
    async def calculate_emi(self, amount: float, tenure_months: int = 12) -> Dict[str, Any]:
        """Calculate EMI options"""
        interest_rates = {
            3: 0,    # No cost EMI
            6: 0,    # No cost EMI
            9: 12,   # 12% per annum
            12: 14,  # 14% per annum
            18: 15,  # 15% per annum
            24: 16   # 16% per annum
        }
        
        emi_options = []
        
        for months, rate in interest_rates.items():
            if months <= tenure_months:
                if rate == 0:
                    emi = amount / months
                    total_amount = amount
                else:
                    monthly_rate = rate / (12 * 100)
                    emi = amount * monthly_rate * (1 + monthly_rate) ** months / ((1 + monthly_rate) ** months - 1)
                    total_amount = emi * months
                
                emi_options.append({
                    "months": months,
                    "monthly_emi": round(emi, 2),
                    "total_amount": round(total_amount, 2),
                    "interest_rate": rate,
                    "processing_fee": 199 if rate == 0 else 0
                })
        
        return {
            "principal": amount,
            "emi_options": emi_options,
            "recommended": emi_options[0] if emi_options else None
        }
    
    async def apply_coupon(self, product_id: str, coupon_code: str, amount: float) -> Dict[str, Any]:
        """Apply coupon code to product"""
        # Validate coupon (mock)
        valid_coupons = {
            "FIRST10": {"discount": 10, "max_discount": 500, "min_purchase": 10000},
            "SAVE20": {"discount": 20, "max_discount": 1000, "min_purchase": 20000},
            "FEST15": {"discount": 15, "max_discount": 750, "min_purchase": 15000},
            "NEWYEAR": {"discount": 25, "max_discount": 1500, "min_purchase": 25000}
        }
        
        if coupon_code in valid_coupons:
            coupon = valid_coupons[coupon_code]
            
            if amount >= coupon["min_purchase"]:
                discount_amount = min(
                    amount * coupon["discount"] / 100,
                    coupon["max_discount"]
                )
                
                return {
                    "valid": True,
                    "coupon": coupon_code,
                    "discount_percentage": coupon["discount"],
                    "discount_amount": round(discount_amount, 2),
                    "final_amount": round(amount - discount_amount, 2),
                    "savings": round(discount_amount, 2)
                }
            else:
                return {
                    "valid": False,
                    "reason": f"Minimum purchase of ₹{coupon['min_purchase']:,} required",
                    "shortfall": round(coupon["min_purchase"] - amount, 2)
                }
        
        return {
            "valid": False,
            "reason": "Invalid or expired coupon code"
        }
    
    async def get_price_history(self, product_id: str, days: int = 30) -> Dict[str, Any]:
        """Get price history for a product"""
        history = []
        base_price = random.randint(30000, 80000)
        
        for i in range(days, 0, -1):
            date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
            # Simulate price variations
            variation = random.uniform(-0.05, 0.05)
            price = int(base_price * (1 + variation))
            
            history.append({
                "date": date,
                "price": price,
                "discount_percentage": random.randint(0, 30)
            })
        
        current_price = history[-1]["price"]
        lowest_price = min(h["price"] for h in history)
        highest_price = max(h["price"] for h in history)
        
        return {
            "product_id": product_id,
            "current_price": current_price,
            "lowest_price_30_days": lowest_price,
            "highest_price_30_days": highest_price,
            "average_price": sum(h["price"] for h in history) / len(history),
            "price_trend": "decreasing" if current_price < history[0]["price"] else "increasing",
            "history": history
        }