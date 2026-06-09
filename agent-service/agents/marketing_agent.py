from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from typing import TypedDict
from datetime import datetime
import random

class MarketingState(TypedDict):
    products: List[Dict[str, Any]]
    user_preferences: Dict[str, Any]
    promotions: List[Dict[str, Any]]
    personalized_message: str
    upsell_products: List[Dict[str, Any]]

class MarketingAgent:
    """
    Marketing Agent - Generates personalized marketing content, upsells, and promotional offers
    """
    
    def __init__(self):
        self.graph = self._build_graph()
        
        # Marketing templates
        self.message_templates = {
            "gaming": [
                "🎮 Level up your gaming with the {product}! Experience next-gen performance.",
                "⚡ Dominate the battlefield with {product}'s powerful RTX graphics!",
                "🏆 Champion's choice: {product} - Built for serious gamers like you!"
            ],
            "professional": [
                "💼 Boost your productivity with {product}. Perfect for professionals!",
                "🚀 Take your work to the next level with {product}'s powerful performance.",
                "✨ {product} - Where productivity meets portability!"
            ],
            "budget": [
                "💰 Best value for money! {product} packs premium features at an amazing price.",
                "🎯 Smart choice! {product} gives you the best bang for your buck.",
                "💎 Hidden gem alert: {product} offers flagship features at a budget-friendly price!"
            ]
        }
        
        # Upsell suggestions
        self.upsell_categories = {
            "laptop": [
                {"product": "Laptop Cooling Pad", "price": 999, "relevance": 0.9},
                {"product": "Wireless Mouse", "price": 1499, "relevance": 0.85},
                {"product": "Laptop Stand", "price": 799, "relevance": 0.7},
                {"product": "USB-C Hub", "price": 2499, "relevance": 0.8},
                {"product": "External SSD", "price": 4999, "relevance": 0.75}
            ],
            "phone": [
                {"product": "Phone Case", "price": 499, "relevance": 0.9},
                {"product": "Screen Protector", "price": 299, "relevance": 0.95},
                {"product": "Wireless Charger", "price": 1999, "relevance": 0.8},
                {"product": "Phone Ring Holder", "price": 199, "relevance": 0.6}
            ]
        }

    def _build_graph(self):
        """Build the LangGraph workflow"""
        workflow = StateGraph(MarketingState)
        
        workflow.add_node("analyze_user", self.analyze_user)
        workflow.add_node("generate_promotions", self.generate_promotions)
        workflow.add_node("create_message", self.create_message)
        workflow.add_node("suggest_upsells", self.suggest_upsells)
        
        workflow.set_entry_point("analyze_user")
        workflow.add_edge("analyze_user", "generate_promotions")
        workflow.add_edge("generate_promotions", "create_message")
        workflow.add_edge("create_message", "suggest_upsells")
        workflow.add_edge("suggest_upsells", END)
        
        return workflow.compile()

    async def analyze_user(self, state: MarketingState) -> MarketingState:
        """Analyze user preferences and behavior"""
        preferences = state.get("user_preferences", {})
        
        # Determine user persona
        persona = self._determine_persona(preferences, state["products"])
        preferences["detected_persona"] = persona
        
        # Analyze price sensitivity
        avg_price = sum(p["price"] for p in state["products"]) / len(state["products"]) if state["products"] else 0
        preferences["price_sensitivity"] = "high" if avg_price < 50000 else "medium" if avg_price < 100000 else "low"
        
        state["user_preferences"] = preferences
        return state

    async def generate_promotions(self, state: MarketingState) -> MarketingState:
        """Generate personalized promotions"""
        products = state["products"]
        user_prefs = state["user_preferences"]
        promotions = []
        
        for product in products[:2]:  # Top 2 products
            # Seasonal offers
            seasonal_promo = self._get_seasonal_promotion()
            if seasonal_promo:
                promotions.append({
                    "type": "seasonal",
                    "product": product["name"],
                    "title": seasonal_promo["title"],
                    "discount": seasonal_promo["discount"],
                    "code": seasonal_promo["code"],
                    "valid_till": seasonal_promo["valid_till"],
                    "urgency": seasonal_promo["urgency"]
                })
            
            # Bundle deals
            bundle = self._create_bundle_deal(product)
            promotions.append({
                "type": "bundle",
                "product": product["name"],
                "title": bundle["title"],
                "savings": bundle["savings"],
                "items": bundle["items"]
            })
            
            # Loyalty rewards
            promotions.append({
                "type": "loyalty",
                "product": product["name"],
                "title": "Loyalty Bonus",
                "reward_points": int(product["price"] * 0.05),
                "benefits": ["Early access to sales", "Free shipping", "Priority support"]
            })
        
        state["promotions"] = promotions
        return state

    async def create_message(self, state: MarketingState) -> MarketingState:
        """Create personalized marketing message"""
        products = state["products"]
        persona = state["user_preferences"].get("detected_persona", "general")
        
        if not products:
            state["personalized_message"] = "Discover amazing products tailored just for you!"
            return state
        
        # Select best product
        best_product = max(products, key=lambda x: x.get("scores", {}).get("total", 0))
        
        # Choose template based on persona
        templates = self.message_templates.get(persona, self.message_templates["budget"])
        template = random.choice(templates)
        
        # Generate personalized message
        message = template.format(product=best_product["name"])
        
        # Add price insight
        if best_product.get("scores", {}).get("breakdown", {}).get("price", 0) > 0.8:
            message += " Great value deal!"
        
        # Add urgency if applicable
        if best_product.get("inventory", {}).get("quantity_available", 100) < 10:
            message += " ⚡ Almost sold out!"
        
        state["personalized_message"] = message
        return state

    async def suggest_upsells(self, state: MarketingState) -> MarketingState:
        """Suggest complementary products"""
        products = state["products"]
        upsell_products = []
        
        for product in products:
            category = product.get("category", "")
            if category in self.upsell_categories:
                # Select relevant upsells
                possible_upsells = self.upsell_categories[category]
                
                # Filter by relevance and price ratio
                for upsell in possible_upsells:
                    if upsell["relevance"] > 0.7 and upsell["price"] < product["price"] * 0.15:
                        upsell_products.append({
                            "original_product": product["name"],
                            "upsell_product": upsell["product"],
                            "price": upsell["price"],
                            "relevance_score": upsell["relevance"],
                            "message": f"Customers also bought {upsell['product']} with {product['name']}"
                        })
        
        # Sort by relevance
        upsell_products.sort(key=lambda x: x["relevance_score"], reverse=True)
        state["upsell_products"] = upsell_products[:5]
        
        return state

    def _determine_persona(self, preferences: Dict, products: List[Dict]) -> str:
        """Determine user persona"""
        if preferences.get("gaming"):
            return "gaming"
        elif preferences.get("performance") and not preferences.get("gaming"):
            return "professional"
        elif preferences.get("value_for_money"):
            return "budget"
        
        # Check product prices
        if products:
            avg_price = sum(p["price"] for p in products) / len(products)
            if avg_price > 80000:
                return "professional"
            elif avg_price < 40000:
                return "budget"
        
        return "general"

    def _get_seasonal_promotion(self) -> Dict:
        """Get current seasonal promotion"""
        promotions = [
            {
                "title": "Flash Sale",
                "discount": random.randint(10, 25),
                "code": f"FLASH{random.randint(100, 999)}",
                "valid_till": (datetime.now().strftime("%Y-%m-%d")),
                "urgency": "Ends today!"
            },
            {
                "title": "Festival Special",
                "discount": random.randint(15, 30),
                "code": f"FEST{random.randint(100, 999)}",
                "valid_till": (datetime.now().strftime("%Y-%m-%d")),
                "urgency": "Limited time offer!"
            },
            {
                "title": "Weekend Bonanza",
                "discount": random.randint(5, 20),
                "code": f"WEEKEND{random.randint(100, 999)}",
                "valid_till": (datetime.now().strftime("%Y-%m-%d")),
                "urgency": "This weekend only!"
            }
        ]
        
        return random.choice(promotions) if random.random() > 0.3 else None

    def _create_bundle_deal(self, product: Dict) -> Dict:
        """Create bundle deal for product"""
        bundles = [
            {
                "title": "Complete Setup Bundle",
                "savings": random.randint(2000, 5000),
                "items": ["Product", "Accessories Kit", "Extended Warranty"]
            },
            {
                "title": "Productivity Bundle",
                "savings": random.randint(1500, 3000),
                "items": ["Product", "Office Suite", "Cloud Storage"]
            },
            {
                "title": "Gaming Bundle",
                "savings": random.randint(3000, 7000),
                "items": ["Product", "Gaming Mouse", "Mousepad", "Game Pass"]
            }
        ]
        
        return random.choice(bundles)

    async def process(self, products: List[Dict[str, Any]], user_preferences: Dict[str, Any] = {}) -> Dict[str, Any]:
        """Process marketing content generation"""
        initial_state = {
            "products": products,
            "user_preferences": user_preferences,
            "promotions": [],
            "personalized_message": "",
            "upsell_products": []
        }
        
        result = await self.graph.ainvoke(initial_state)
        return {
            "message": result["personalized_message"],
            "promotions": result["promotions"],
            "upsells": result["upsell_products"]
        }