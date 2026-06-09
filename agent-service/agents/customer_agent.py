from typing import Dict, Any
import json
import re
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

class CustomerAgentState(TypedDict):
    query: str
    intent: str
    entities: Dict[str, Any]
    constraints: Dict[str, Any]
    structured_query: Dict[str, Any]

class CustomerAgent:
    """
    Customer Agent - First agent in the workflow
    Responsible for understanding user intent and converting natural language to structured data
    """
    
    def __init__(self, model_name: str = "llama-3"):
        self.model_name = model_name
        self.graph = self._build_graph()
        
        # Common patterns for Indian market
        self.category_patterns = {
            'laptop': r'\b(laptop|notebook|macbook)\b',
            'phone': r'\b(phone|mobile|smartphone|iphone)\b',
            'tablet': r'\b(tablet|ipad)\b',
            'headphones': r'\b(headphone|earphone|earbuds|earpods)\b',
            'tv': r'\b(tv|television|monitor)\b',
            'camera': r'\b(camera|dslr)\b',
            'gaming': r'\b(gaming|console|playstation|xbox)\b',
        }
        
        self.brand_patterns = [
            'apple', 'samsung', 'dell', 'hp', 'lenovo', 'asus', 'acer',
            'oneplus', 'xiaomi', 'realme', 'oppo', 'vivo', 'nothing',
            'sony', 'lg', 'msi', 'alienware', 'razer'
        ]
        
        self.spec_patterns = {
            'ram': r'(\d+)\s*GB\s*(?:RAM|ram|memory)',
            'storage': r'(\d+)\s*(?:GB|TB)\s*(?:SSD|HDD|storage)',
            'processor': r'(?:intel|amd|ryzen)\s*(i\d|r\d|[\w\s]+)',
            'gpu': r'(?:rtx|gtx|radeon)\s*(\d+\w*)',
            'display': r'(\d+\.?\d*)\s*(?:inch|")',
            'battery': r'(?:battery|backup)\s*(?:life)?\s*(\d+)\s*(?:hours|hrs|h)',
            'camera': r'(\d+)\s*(?:MP|mp|megapixel)',
        }

    def _build_graph(self):
        """Build the LangGraph workflow for customer agent"""
        workflow = StateGraph(CustomerAgentState)
        
        # Add nodes
        workflow.add_node("extract_intent", self.extract_intent)
        workflow.add_node("extract_entities", self.extract_entities)
        workflow.add_node("extract_constraints", self.extract_constraints)
        workflow.add_node("structure_query", self.structure_query)
        
        # Define edges
        workflow.set_entry_point("extract_intent")
        workflow.add_edge("extract_intent", "extract_entities")
        workflow.add_edge("extract_entities", "extract_constraints")
        workflow.add_edge("extract_constraints", "structure_query")
        workflow.add_edge("structure_query", END)
        
        return workflow.compile()

    async def extract_intent(self, state: CustomerAgentState) -> CustomerAgentState:
        """Extract user intent from query"""
        query = state["query"].lower()
        
        intents = []
        
        # Check for purchase intent
        if any(word in query for word in ['buy', 'purchase', 'get', 'want', 'need', 'find', 'show']):
            intents.append('purchase')
        
        # Check for comparison intent
        if any(word in query for word in ['compare', 'vs', 'versus', 'difference', 'better']):
            intents.append('compare')
        
        # Check for information intent
        if any(word in query for word in ['tell', 'what', 'how', 'which', 'suggest', 'recommend']):
            intents.append('information')
        
        # Check for price intent
        if any(word in query for word in ['price', 'cost', 'budget', 'cheap', 'affordable', 'under', 'within']):
            intents.append('price_check')
        
        state["intent"] = intents[0] if intents else 'general'
        return state

    async def extract_entities(self, state: CustomerAgentState) -> CustomerAgentState:
        """Extract entities like category, brands from query"""
        query = state["query"].lower()
        entities = {
            "category": None,
            "brands": [],
            "specifications": {}
        }
        
        # Extract category
        for category, pattern in self.category_patterns.items():
            if re.search(pattern, query):
                entities["category"] = category
                break
        
        # Extract brands
        for brand in self.brand_patterns:
            if brand in query:
                entities["brands"].append(brand)
        
        # Extract specifications
        for spec, pattern in self.spec_patterns.items():
            match = re.search(pattern, query)
            if match:
                entities["specifications"][spec] = match.group(1)
        
        # Special handling for GPU
        if 'rtx' in query:
            rtx_match = re.search(r'rtx\s*(\d+)', query)
            if rtx_match:
                entities["specifications"]["gpu"] = f"rtx{rtx_match.group(1)}"
            else:
                entities["specifications"]["gpu"] = "rtx"
        
        state["entities"] = entities
        return state

    async def extract_constraints(self, state: CustomerAgentState) -> CustomerAgentState:
        """Extract constraints like budget, color, etc."""
        query = state["query"]
        constraints = {
            "budget": None,
            "color": None,
            "condition": "new",
            "urgency": "normal"
        }
        
        # Extract budget (handling Indian number format)
        budget_patterns = [
            r'(?:under|below|within|upto|up to|max|maximum)?\s*(?:rs\.?|inr|₹)?\s*(\d{2,3}(?:,\d{2,3})*(?:k|lakh|lacs)?)',
            r'(\d{2,3}(?:,\d{2,3})*(?:k|lakh|lacs)?)\s*(?:budget|price|range)',
        ]
        
        for pattern in budget_patterns:
            match = re.search(pattern, query.lower())
            if match:
                budget_str = match.group(1).lower().replace(',', '')
                if 'k' in budget_str:
                    budget = float(budget_str.replace('k', '')) * 1000
                elif 'lakh' in budget_str or 'lacs' in budget_str:
                    budget = float(budget_str.replace('lakh', '').replace('lacs', '')) * 100000
                else:
                    budget = float(budget_str)
                constraints["budget"] = int(budget)
                break
        
        # Extract color
        colors = ['black', 'white', 'silver', 'grey', 'gray', 'blue', 'red', 'green', 'gold', 'rose gold']
        for color in colors:
            if color in query.lower():
                constraints["color"] = color
                break
        
        # Check for refurbished/used
        if any(word in query.lower() for word in ['refurbished', 'used', 'second hand', 'pre-owned']):
            constraints["condition"] = "refurbished"
        
        # Check urgency
        if any(word in query.lower() for word in ['urgent', 'immediate', 'today', 'asap', 'quick']):
            constraints["urgency"] = "high"
        
        state["constraints"] = constraints
        return state

    async def structure_query(self, state: CustomerAgentState) -> CustomerAgentState:
        """Convert extracted information into structured format"""
        structured = {
            "intent": state["intent"],
            "category": state["entities"]["category"],
            "brands": state["entities"]["brands"],
            "specifications": state["entities"]["specifications"],
            "budget": state["constraints"]["budget"],
            "color": state["constraints"]["color"],
            "condition": state["constraints"]["condition"],
            "urgency": state["constraints"]["urgency"],
            "preferences": self._extract_preferences(state["query"]),
            "original_query": state["query"]
        }
        
        # Remove None values
        structured = {k: v for k, v in structured.items() if v is not None and v != []}
        
        state["structured_query"] = structured
        return state

    def _extract_preferences(self, query: str) -> Dict[str, Any]:
        """Extract user preferences"""
        query_lower = query.lower()
        preferences = {
            "performance": False,
            "battery_life": False,
            "portability": False,
            "gaming": False,
            "camera_quality": False,
            "display_quality": False,
            "build_quality": False,
            "value_for_money": False
        }
        
        if any(word in query_lower for word in ['performance', 'fast', 'speed', 'powerful']):
            preferences["performance"] = True
        
        if any(word in query_lower for word in ['battery', 'backup', 'long lasting']):
            preferences["battery_life"] = True
        
        if any(word in query_lower for word in ['light', 'thin', 'portable', 'carry', 'travel']):
            preferences["portability"] = True
        
        if any(word in query_lower for word in ['gaming', 'game', 'gamer']):
            preferences["gaming"] = True
        
        if any(word in query_lower for word in ['camera', 'photo', 'selfie']):
            preferences["camera_quality"] = True
        
        return preferences

    async def process(self, query: str) -> Dict[str, Any]:
        """Process query through the agent workflow"""
        initial_state = {
            "query": query,
            "intent": "",
            "entities": {},
            "constraints": {},
            "structured_query": {}
        }
        
        result = await self.graph.ainvoke(initial_state)
        return result["structured_query"]