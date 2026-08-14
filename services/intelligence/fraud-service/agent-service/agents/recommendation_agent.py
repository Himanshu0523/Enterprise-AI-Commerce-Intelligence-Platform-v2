from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from typing import TypedDict
import numpy as np

class RecommendationState(TypedDict):
    structured_query: Dict[str, Any]
    products: List[Dict[str, Any]]
    scored_products: List[Dict[str, Any]]
    top_recommendations: List[Dict[str, Any]]
    explanation: str

class RecommendationAgent:
    """
    Recommendation Agent - Scores and ranks products based on user preferences
    Uses multi-factor scoring algorithm
    """
    
    def __init__(self):
        self.graph = self._build_graph()
        
        # Weight configurations for different user preferences
        self.preference_weights = {
            "performance": 0.3,
            "battery_life": 0.2,
            "portability": 0.15,
            "gaming": 0.25,
            "camera_quality": 0.2,
            "display_quality": 0.15,
            "build_quality": 0.15,
            "value_for_money": 0.2
        }
        
        # Scoring functions for different specifications
        self.spec_scorers = {
            "ram": self._score_ram,
            "storage": self._score_storage,
            "processor": self._score_processor,
            "gpu": self._score_gpu,
            "display": self._score_display,
            "battery": self._score_battery
        }

    def _build_graph(self):
        """Build the LangGraph workflow"""
        workflow = StateGraph(RecommendationState)
        
        workflow.add_node("filter_products", self.filter_products)
        workflow.add_node("score_products", self.score_products)
        workflow.add_node("rank_products", self.rank_products)
        workflow.add_node("generate_explanation", self.generate_explanation)
        
        workflow.set_entry_point("filter_products")
        workflow.add_edge("filter_products", "score_products")
        workflow.add_edge("score_products", "rank_products")
        workflow.add_edge("rank_products", "generate_explanation")
        workflow.add_edge("generate_explanation", END)
        
        return workflow.compile()

    async def filter_products(self, state: RecommendationState) -> RecommendationState:
        """Filter products based on hard constraints"""
        query = state["structured_query"]
        products = state["products"]
        
        filtered = []
        
        for product in products:
            # Budget filter (strict)
            if query.get("budget") and product["price"] > query["budget"]:
                continue
            
            # Category filter
            if query.get("category") and product.get("category") != query["category"]:
                continue
            
            # Brand filter (if specified)
            if query.get("brands"):
                product_brand = product.get("brand", "").lower()
                if not any(brand in product_brand for brand in query["brands"]):
                    continue
            
            # Color filter
            if query.get("color"):
                available_colors = [c.lower() for c in product.get("colors", [])]
                if query["color"].lower() not in available_colors:
                    continue
            
            # Condition filter
            if query.get("condition") == "new" and product.get("condition") != "new":
                continue
            
            # GPU requirement (for gaming laptops)
            if query.get("specifications", {}).get("gpu"):
                required_gpu = query["specifications"]["gpu"].lower()
                product_gpu = product.get("specs", {}).get("gpu", "").lower()
                if required_gpu not in product_gpu:
                    continue
            
            filtered.append(product)
        
        state["products"] = filtered
        return state

    async def score_products(self, state: RecommendationState) -> RecommendationState:
        """Score products based on user preferences and specifications"""
        query = state["structured_query"]
        products = state["products"]
        preferences = query.get("preferences", {})
        
        scored_products = []
        
        for product in products:
            scores = {
                "total": 0,
                "breakdown": {}
            }
            
            # 1. Price Score (always important)
            price_score = self._score_price(product["price"], query.get("budget"))
            scores["breakdown"]["price"] = price_score
            scores["total"] += price_score * 0.25
            
            # 2. Specification Scores
            spec_scores = self._score_specifications(
                product.get("specs", {}),
                query.get("specifications", {})
            )
            scores["breakdown"]["specifications"] = spec_scores
            scores["total"] += spec_scores["overall"] * 0.35
            
            # 3. Preference-based Scores
            pref_scores = self._score_preferences(product, preferences)
            scores["breakdown"]["preferences"] = pref_scores
            scores["total"] += pref_scores["overall"] * 0.25
            
            # 4. Rating Score
            rating_score = self._score_rating(product.get("rating", 0))
            scores["breakdown"]["rating"] = rating_score
            scores["total"] += rating_score * 0.1
            
            # 5. Popularity Score
            popularity_score = self._score_popularity(product.get("reviews", 0))
            scores["breakdown"]["popularity"] = popularity_score
            scores["total"] += popularity_score * 0.05
            
            product["scores"] = scores
            scored_products.append(product)
        
        state["scored_products"] = scored_products
        return state

    async def rank_products(self, state: RecommendationState) -> RecommendationState:
        """Rank products by total score"""
        scored_products = state["scored_products"]
        
        # Sort by total score descending
        ranked = sorted(
            scored_products,
            key=lambda x: x["scores"]["total"],
            reverse=True
        )
        
        # Add rank position
        for i, product in enumerate(ranked):
            product["rank"] = i + 1
        
        # Get top 5 recommendations
        state["top_recommendations"] = ranked[:5]
        return state

    async def generate_explanation(self, state: RecommendationState) -> RecommendationState:
        """Generate explanation for recommendations"""
        top_products = state["top_recommendations"]
        
        if not top_products:
            state["explanation"] = "No products match your criteria. Try adjusting your filters."
            return state
        
        # Generate summary
        price_range = f"₹{min(p['price'] for p in top_products):,} - ₹{max(p['price'] for p in top_products):,}"
        
        explanation = f"Found {len(state['scored_products'])} products. "
        explanation += f"Top {len(top_products)} recommendations in range {price_range}.\n\n"
        
        for product in top_products[:3]:
            explanation += f"⭐ {product['name']} (Rank #{product['rank']})\n"
            explanation += f"   Price: ₹{product['price']:,}\n"
            explanation += f"   Score: {product['scores']['total']:.2f}/1.00\n"
            
            # Highlight top features
            top_features = sorted(
                product['scores']['breakdown'].get('preferences', {}).items(),
                key=lambda x: x[1],
                reverse=True
            )[:2]
            
            explanation += f"   Best for: {', '.join(f[0] for f in top_features)}\n\n"
        
        state["explanation"] = explanation
        return state

    def _score_price(self, price: float, budget: float = None) -> float:
        """Score based on price - lower is better"""
        if not budget:
            return 0.7  # Neutral score
        
        if price <= budget * 0.7:
            return 1.0  # Great value
        elif price <= budget * 0.85:
            return 0.9  # Good value
        elif price <= budget:
            return 0.8  # Within budget
        else:
            return max(0, 1 - (price - budget) / budget)

    def _score_specifications(self, product_specs: Dict, required_specs: Dict) -> Dict:
        """Score based on specifications"""
        scores = {}
        
        for spec, value in required_specs.items():
            if spec in self.spec_scorers and spec in product_specs:
                scores[spec] = self.spec_scorers[spec](product_specs[spec], value)
        
        scores["overall"] = np.mean(list(scores.values())) if scores else 0.5
        return scores

    def _score_preferences(self, product: Dict, preferences: Dict) -> Dict:
        """Score based on user preferences"""
        scores = {}
        
        for pref, is_preferred in preferences.items():
            if is_preferred:
                # Score based on how well product matches this preference
                scores[pref] = self._evaluate_preference(pref, product)
        
        scores["overall"] = np.mean(list(scores.values())) if scores else 0.5
        return scores

    def _evaluate_preference(self, preference: str, product: Dict) -> float:
        """Evaluate how well a product matches a specific preference"""
        specs = product.get("specs", {})
        
        if preference == "performance":
            return self._score_performance(specs)
        elif preference == "battery_life":
            return self._score_battery(specs.get("battery", "0"))
        elif preference == "portability":
            return self._score_portability(specs)
        elif preference == "gaming":
            return self._score_gaming(specs)
        else:
            return 0.5

    def _score_ram(self, product_ram: str, required: str = None) -> float:
        """Score RAM - higher is better"""
        ram_value = int(''.join(filter(str.isdigit, product_ram)))
        if ram_value >= 32:
            return 1.0
        elif ram_value >= 16:
            return 0.8
        elif ram_value >= 8:
            return 0.6
        else:
            return 0.3

    def _score_storage(self, product_storage: str, required: str = None) -> float:
        """Score storage - bigger is better, SSD preferred"""
        storage_value = int(''.join(filter(str.isdigit, product_storage)))
        is_ssd = 'ssd' in product_storage.lower()
        
        score = min(storage_value / 1000, 1.0)
        if is_ssd:
            score *= 1.2
        
        return min(score, 1.0)

    def _score_processor(self, processor: str, required: str = None) -> float:
        """Score processor performance"""
        processor_lower = processor.lower()
        
        if 'i9' in processor_lower or 'ryzen 9' in processor_lower:
            return 1.0
        elif 'i7' in processor_lower or 'ryzen 7' in processor_lower:
            return 0.8
        elif 'i5' in processor_lower or 'ryzen 5' in processor_lower:
            return 0.6
        else:
            return 0.4

    def _score_gpu(self, gpu: str, required: str = None) -> float:
        """Score GPU performance"""
        gpu_lower = gpu.lower()
        
        if 'rtx 40' in gpu_lower:
            return 1.0
        elif 'rtx 30' in gpu_lower:
            return 0.8
        elif 'rtx 20' in gpu_lower or 'gtx 16' in gpu_lower:
            return 0.6
        else:
            return 0.4

    def _score_display(self, display: str, required: str = None) -> float:
        """Score display quality"""
        size = float(''.join(filter(lambda x: x.isdigit() or x == '.', display)))
        
        if size >= 16:
            return 0.9
        elif size >= 15:
            return 0.8
        elif size >= 14:
            return 0.7
        else:
            return 0.5

    def _score_battery(self, battery: str, required: str = None) -> float:
        """Score battery life"""
        try:
            hours = float(''.join(filter(lambda x: x.isdigit() or x == '.', battery)))
            return min(hours / 10, 1.0)
        except:
            return 0.5

    def _score_rating(self, rating: float) -> float:
        """Normalize rating score"""
        return rating / 5.0

    def _score_popularity(self, reviews: int) -> float:
        """Score based on number of reviews"""
        if reviews > 1000:
            return 1.0
        elif reviews > 500:
            return 0.7
        elif reviews > 100:
            return 0.4
        else:
            return 0.2

    def _score_performance(self, specs: Dict) -> float:
        """Overall performance score"""
        ram_score = self._score_ram(specs.get("ram", "0"))
        processor_score = self._score_processor(specs.get("processor", ""))
        return (ram_score + processor_score) / 2

    def _score_portability(self, specs: Dict) -> float:
        """Portability score - lighter and smaller is better"""
        weight = specs.get("weight", "2kg")
        try:
            weight_kg = float(''.join(filter(lambda x: x.isdigit() or x == '.', weight)))
            return max(0, 1 - (weight_kg - 1) / 3)
        except:
            return 0.5

    def _score_gaming(self, specs: Dict) -> float:
        """Gaming performance score"""
        gpu_score = self._score_gpu(specs.get("gpu", ""))
        ram_score = self._score_ram(specs.get("ram", "0"))
        return (gpu_score * 0.6 + ram_score * 0.4)

    async def process(self, structured_query: Dict[str, Any], products: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Process recommendations"""
        initial_state = {
            "structured_query": structured_query,
            "products": products,
            "scored_products": [],
            "top_recommendations": [],
            "explanation": ""
        }
        
        result = await self.graph.ainvoke(initial_state)
        return {
            "recommendations": result["top_recommendations"],
            "explanation": result["explanation"]
        }