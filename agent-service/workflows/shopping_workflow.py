from typing import Dict, Any
from datetime import datetime
import asyncio

from agents.customer_agent import CustomerAgent
from agents.recommendation_agent import RecommendationAgent
from agents.pricing_agent import PricingAgent
from agents.inventory_agent import InventoryAgent
from agents.marketing_agent import MarketingAgent
from tools.product_search_tool import ProductSearchTool
from tools.inventory_tool import InventoryTool
from tools.pricing_tool import PricingTool

class ShoppingWorkflow:
    """Main workflow orchestrating all agents"""
    
    def __init__(self):
        # Initialize agents
        self.customer_agent = CustomerAgent()
        self.recommendation_agent = RecommendationAgent()
        self.pricing_agent = PricingAgent()
        self.inventory_agent = InventoryAgent()
        self.marketing_agent = MarketingAgent()
        
        # Initialize tools
        self.product_search = ProductSearchTool()
        self.inventory_tool = InventoryTool()
        self.pricing_tool = PricingTool()
        
        # Metrics
        self.total_queries = 0
        self.response_times = []
    
    async def process(self, query: str, context: Dict[str, Any] = {}) -> Dict[str, Any]:
        """Process user query through all agents"""
        start_time = datetime.now()
        self.total_queries += 1
        
        try:
            # Step 1: Customer Agent - Understand query
            structured_query = await self.customer_agent.process(query)
            
            # Step 2: Search products based on structured query
            products = await self.product_search.search_products(structured_query)
            
            if not products:
                return {
                    "message": "No products found matching your criteria. Try adjusting your requirements.",
                    "recommendations": [],
                    "pricing": {},
                    "inventory": {},
                    "marketing": {}
                }
            
            # Step 3: Get recommendations
            recommendation_result = await self.recommendation_agent.process(
                structured_query,
                products
            )
            
            # Step 4: Get pricing information
            pricing_result = await self.pricing_agent.process(
                recommendation_result["recommendations"]
            )
            
            # Step 5: Check inventory
            inventory_result = await self.inventory_agent.process(
                recommendation_result["recommendations"],
                context.get("pincode")
            )
            
            # Step 6: Generate marketing content
            marketing_result = await self.marketing_agent.process(
                recommendation_result["recommendations"],
                structured_query.get("preferences", {})
            )
            
            # Combine all results
            final_response = {
                "query": query,
                "structured_query": structured_query,
                "message": marketing_result["message"],
                "explanation": recommendation_result["explanation"],
                "recommendations": recommendation_result["recommendations"],
                "pricing": pricing_result,
                "inventory": inventory_result,
                "marketing": marketing_result,
                "metadata": {
                    "processed_at": datetime.now().isoformat(),
                    "processing_time_ms": (datetime.now() - start_time).total_seconds() * 1000,
                    "agents_used": [
                        "customer_agent",
                        "recommendation_agent",
                        "pricing_agent",
                        "inventory_agent",
                        "marketing_agent"
                    ]
                }
            }
            
            # Record response time
            self.response_times.append(
                (datetime.now() - start_time).total_seconds()
            )
            
            return final_response
            
        except Exception as e:
            return {
                "error": str(e),
                "message": "Sorry, I encountered an error processing your request. Please try again.",
                "recommendations": [],
                "metadata": {
                    "error": True,
                    "timestamp": datetime.now().isoformat()
                }
            }
    
    def get_average_time(self) -> float:
        """Get average response time"""
        if not self.response_times:
            return 0
        return sum(self.response_times) / len(self.response_times)