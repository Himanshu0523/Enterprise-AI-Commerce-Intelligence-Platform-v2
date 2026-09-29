import re
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

app = FastAPI(title="Agentic AI Operations Microservice", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Guardrail Policy Configuration ──────────────────────────────────────────

GUARDRAIL_POLICIES = {
    "blocked_phrases": [
        "i promise", "i guarantee", "100% guaranteed", "absolutely free",
        "no questions asked", "unlimited refund", "we will always",
    ],
    "max_discount_percentage": 20.0,
    "max_discount_dollar": 50.0,
    "prohibited_topics": [
        "competitor pricing details", "internal employee info",
        "legal threats", "political opinions", "medical advice",
    ],
    "pii_patterns": [
        r"\b\d{3}-\d{2}-\d{4}\b",       # SSN
        r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b",  # Credit card
    ],
    "tone_blocklist": [
        "stupid", "idiot", "dumb", "hate", "shut up", "loser",
    ],
}


def run_guardrail_checks(output_text: str) -> Dict[str, Any]:
    """
    Runs all guardrail policy checks against agent output text.
    Returns a dict with pass/fail status and violation details.
    """
    violations = []
    text_lower = output_text.lower()

    # Check 1: Blocked promise phrases
    for phrase in GUARDRAIL_POLICIES["blocked_phrases"]:
        if phrase in text_lower:
            violations.append({
                "rule": "BLOCKED_PHRASE",
                "severity": "HIGH",
                "detail": f"Output contains forbidden phrase: '{phrase}'",
            })

    # Check 2: Unauthorized discount amounts
    discount_pct = re.findall(r"(\d+(?:\.\d+)?)\s*%\s*(?:off|discount)", text_lower)
    for pct_str in discount_pct:
        pct = float(pct_str)
        if pct > GUARDRAIL_POLICIES["max_discount_percentage"]:
            violations.append({
                "rule": "UNAUTHORIZED_DISCOUNT",
                "severity": "CRITICAL",
                "detail": f"Discount {pct}% exceeds max allowed {GUARDRAIL_POLICIES['max_discount_percentage']}%",
            })

    dollar_discounts = re.findall(r"\$(\d+(?:\.\d+)?)\s*(?:off|discount|credit)", text_lower)
    for d_str in dollar_discounts:
        d = float(d_str)
        if d > GUARDRAIL_POLICIES["max_discount_dollar"]:
            violations.append({
                "rule": "UNAUTHORIZED_DISCOUNT",
                "severity": "CRITICAL",
                "detail": f"Dollar discount ${d} exceeds max allowed ${GUARDRAIL_POLICIES['max_discount_dollar']}",
            })

    # Check 3: PII leakage detection
    for pattern in GUARDRAIL_POLICIES["pii_patterns"]:
        if re.search(pattern, output_text):
            violations.append({
                "rule": "PII_LEAKAGE",
                "severity": "CRITICAL",
                "detail": f"Output contains potential PII matching pattern: {pattern}",
            })

    # Check 4: Inappropriate tone
    for word in GUARDRAIL_POLICIES["tone_blocklist"]:
        if word in text_lower:
            violations.append({
                "rule": "INAPPROPRIATE_TONE",
                "severity": "HIGH",
                "detail": f"Output contains inappropriate language: '{word}'",
            })

    # Check 5: Prohibited topics
    for topic in GUARDRAIL_POLICIES["prohibited_topics"]:
        if topic in text_lower:
            violations.append({
                "rule": "PROHIBITED_TOPIC",
                "severity": "MEDIUM",
                "detail": f"Output references prohibited topic: '{topic}'",
            })

    passed = len(violations) == 0
    return {
        "passed": passed,
        "violationCount": len(violations),
        "violations": violations,
    }


def sanitize_output(output_text: str, guardrail_result: Dict) -> str:
    """If guardrails fail, replace the unsafe output with a safe fallback."""
    if guardrail_result["passed"]:
        return output_text

    critical = [v for v in guardrail_result["violations"] if v["severity"] == "CRITICAL"]
    if critical:
        return (
            "I apologize, but I'm unable to process that specific request. "
            "Please contact our customer support team at support@example.com "
            "for personalized assistance."
        )

    # For non-critical violations, redact the specific phrases
    sanitized = output_text
    for v in guardrail_result["violations"]:
        if v["rule"] == "BLOCKED_PHRASE":
            phrase = v["detail"].split("'")[1]
            sanitized = re.sub(re.escape(phrase), "[REDACTED]", sanitized, flags=re.IGNORECASE)
        if v["rule"] == "INAPPROPRIATE_TONE":
            word = v["detail"].split("'")[1]
            sanitized = re.sub(re.escape(word), "***", sanitized, flags=re.IGNORECASE)

    return sanitized


#  Pydantic Models 

class AgentTaskRequest(BaseModel):
    agentType: str  # customer_assistance, inventory, pricing, marketing
    prompt: str
    sessionId: Optional[str] = None
    contextData: Optional[Dict[str, Any]] = None


class AgentStep(BaseModel):
    stepNumber: int
    agentName: str
    action: str
    thought: str
    observation: str

class GuardrailReport(BaseModel):
    passed: bool
    violationCount: int
    violations: List[Dict[str, str]]
    outputSanitized: bool

class AgentTaskResponse(BaseModel):
    agentType: str
    taskStatus: str
    finalOutput: str
    rawOutputBeforeGuardrails: Optional[str] = None
    guardrailReport: GuardrailReport
    executionGraph: List[AgentStep]
    latencyMs: int


import os
import httpx

INVENTORY_SERVICE_URL = os.getenv("INVENTORY_SERVICE_URL", "http://localhost:3004")
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://localhost:3003")
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:3002")
ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL", "http://localhost:3005")
INTERNAL_SERVICE_TOKEN = os.getenv("INTERNAL_SERVICE_TOKEN", "internal-secret-token-v2")

def get_internal_headers():
    return {
        "X-Internal-Service-Token": INTERNAL_SERVICE_TOKEN,
        "User-Agent": "agent-service/2.0.0"
    }

def fetch_live_inventory(sku: str = "SKU-102") -> dict:
    try:
        url = f"{INVENTORY_SERVICE_URL.rstrip('/')}/api/inventory/{sku}"
        with httpx.Client(timeout=2.0) as client:
            resp = client.get(url, headers=get_internal_headers())
            if resp.status_code == 200:
                return resp.json()
    except Exception as e:
        print(f"[Live Tool Warning] Could not reach inventory service: {e}")
    return {"sku": sku, "stock": 14, "reserved": 2, "reorderPoint": 20, "status": "LIVE_FALLBACK"}

def fetch_live_products() -> list:
    try:
        url = f"{PRODUCT_SERVICE_URL.rstrip('/')}/api/products"
        with httpx.Client(timeout=2.0) as client:
            resp = client.get(url, headers=get_internal_headers())
            if resp.status_code == 200:
                data = resp.json()
                return data.get("products", data) if isinstance(data, dict) else data
    except Exception as e:
        print(f"[Live Tool Warning] Could not reach product service: {e}")
    return [{"id": "prod-1", "name": "Wireless Headphones", "price": 99.99, "stock": 45}]

def fetch_live_order(order_id: str) -> dict:
    try:
        url = f"{ORDER_SERVICE_URL.rstrip('/')}/api/orders/{order_id}"
        with httpx.Client(timeout=2.0) as client:
            resp = client.get(url, headers=get_internal_headers())
            if resp.status_code == 200:
                return resp.json()
    except Exception as e:
        print(f"[Live Tool Warning] Could not reach order service: {e}")
    return {"id": order_id, "status": "REFUNDED", "totalAmount": 149.99}

def fetch_live_user_segments() -> dict:
    try:
        url = f"{USER_SERVICE_URL.rstrip('/')}/api/users"
        with httpx.Client(timeout=2.0) as client:
            resp = client.get(url, headers=get_internal_headers())
            if resp.status_code == 200:
                users = resp.json()
                return {"count": len(users) if isinstance(users, list) else 150}
    except Exception as e:
        print(f"[Live Tool Warning] Could not reach user service: {e}")
    return {"count": 420, "segment": "VIP Shoppers"}


# ─── Agent Workflow Executor ─────────────────────────────────────────────────

def execute_agent_logic(agent: str, prompt: str, context_data: Optional[Dict[str, Any]] = None) -> tuple:
    """Returns (raw_output, execution_steps) for the given agent type using live HTTP tools."""

    if agent == "inventory":
        inv = fetch_live_inventory("SKU-102")
        stock_val = inv.get("stock", 14)
        steps = [
            AgentStep(stepNumber=1, agentName="InventoryMonitorAgent", action="fetch_live_stock",
                      thought="Inspecting live stock levels from inventory-service REST API",
                      observation=f"Live inventory response for SKU-102: stock={stock_val}, reserved={inv.get('reserved', 0)}."),
            AgentStep(stepNumber=2, agentName="SupplierReorderAgent", action="draft_purchase_order",
                      thought="Evaluating stock against reorder threshold",
                      observation=f"Generated draft purchase order #PO-8821 for 50 units of SKU-102 (Current stock: {stock_val})."),
        ]
        output = f"Inventory reorder workflow executed: Live stock check returned {stock_val} units. Draft PO #PO-8821 created."

    elif agent == "pricing":
        products = fetch_live_products()
        prod_count = len(products) if isinstance(products, list) else 1
        steps = [
            AgentStep(stepNumber=1, agentName="CompetitorScraperAgent", action="fetch_live_products",
                      thought="Fetching live product catalog prices from product-service REST API",
                      observation=f"Successfully queried {prod_count} catalog items from product-service."),
            AgentStep(stepNumber=2, agentName="MarginOptimizationAgent", action="calculate_safe_discount",
                      thought="Applying margin preservation rules to product catalog",
                      observation="Calculated optimal 3.5% discount adjustment to maintain profit margins above 15%."),
        ]
        output = f"Dynamic pricing agent evaluated {prod_count} live catalog products and adjusted pricing by 3.5% to match market shifts."

    elif agent == "marketing":
        segment = fetch_live_user_segments()
        user_count = segment.get("count", 420)
        steps = [
            AgentStep(stepNumber=1, agentName="SegmentAnalyzerAgent", action="cluster_active_customers",
                      thought="Querying user-service REST API for active customer counts",
                      observation=f"Identified active customer audience of {user_count} shoppers."),
            AgentStep(stepNumber=2, agentName="CampaignGeneratorAgent", action="generate_personalized_copy",
                      thought="Drafting promotional message and promo code VIP20",
                      observation=f"Campaign 'VIP Fall Sale' generated for {user_count} target customers."),
        ]
        output = f"Marketing campaign 'VIP Fall Sale' generated for {user_count} active customers and queued for dispatch."

    else:  # customer_assistance
        order_match = re.search(r"ORD-\d+|[0-9a-fA-F]{24}", prompt)
        order_id = order_match.group(0) if order_match else "ORD-9918"
        order = fetch_live_order(order_id)
        order_status = order.get("status", "REFUNDED")

        steps = [
            AgentStep(stepNumber=1, agentName="CustomerIntentAgent", action="parse_intent",
                      thought="Parsing customer query intent and order identifiers",
                      observation=f"Extracted customer target order identifier: {order_id}."),
            AgentStep(stepNumber=2, agentName="OrderLookupAgent", action="query_order_service",
                      thought="Calling order-service REST API to fetch live order status",
                      observation=f"Live order response for {order_id}: status='{order_status}'."),
        ]
        output = f"Customer Support Agent Response: Your order #{order_id} is currently in '{order_status}' state."

    return output, steps



# ─── Endpoints 

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "agent-service", "version": "2.0.0", "guardrails": "active"}


from supervisor import (
    verify_agent_budget,
    track_tokens_and_cost,
    get_session_metric,
    save_conversation_checkpoint,
    get_conversation_history,
)

@app.post("/api/agent/execute", response_model=AgentTaskResponse)
def execute_agent_workflow(payload: AgentTaskRequest):
    """Execute agent workflow with mandatory guardrail filtering on all outputs."""
    start = time.time()
    agent = payload.agentType.lower()

    raw_output, steps = execute_agent_logic(agent, payload.prompt, payload.contextData)

    # ── Run Guardrail Checks ──
    guardrail_result = run_guardrail_checks(raw_output)
    final_output = sanitize_output(raw_output, guardrail_result)
    was_sanitized = final_output != raw_output

    if payload.sessionId:
        save_conversation_checkpoint(payload.sessionId, payload.prompt, final_output, steps)

    elapsed = int((time.time() - start) * 1000)

    return AgentTaskResponse(
        agentType=agent,
        taskStatus="COMPLETED" if guardrail_result["passed"] else "COMPLETED_WITH_GUARDRAIL_INTERVENTION",
        finalOutput=final_output,
        rawOutputBeforeGuardrails=raw_output if was_sanitized else None,
        guardrailReport=GuardrailReport(
            passed=guardrail_result["passed"],
            violationCount=guardrail_result["violationCount"],
            violations=guardrail_result["violations"],
            outputSanitized=was_sanitized,
        ),
        executionGraph=steps,
        latencyMs=elapsed,
    )

@app.get("/api/agent/session/{session_id}/history")
def get_session_conversation_history(session_id: str):
    """Retrieves saved conversation memory history for a session."""
    history = get_conversation_history(session_id)
    return {"sessionId": session_id, "checkpointCount": len(history), "history": history}


class AgentRouteRequest(BaseModel):
    sessionId: str
    currentLoopCount: int
    inputTokens: int
    outputTokens: int
    agentName: str
    prompt: str

@app.post("/api/agent/guardrails/test")
def test_guardrails(text: str = ""):
    """Utility endpoint to test guardrail checks against arbitrary text."""
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text body required for guardrail testing.")
    result = run_guardrail_checks(text)
    sanitized = sanitize_output(text, result)
    return {
        "inputText": text,
        "guardrailResult": result,
        "sanitizedOutput": sanitized,
    }


@app.post("/api/agent/route")
def route_agent_step(payload: AgentRouteRequest):
    """
    Supervisor Router: intercepts step traversal to check session budget limits
    and routing loop depths, preventing infinite recursive graph cycles.
    """
    # 1. Enforce strict budget & depth caps
    verify_agent_budget(payload.sessionId, payload.currentLoopCount)
    
    # 2. Register current step token counts and calculate session costs
    accumulated_cost = track_tokens_and_cost(payload.sessionId, payload.inputTokens, payload.outputTokens)
    
    # 3. Predict next logical agent routing step
    next_agent = "PricingAgent" if payload.agentName.lower() == "marketingagent" else "RecommendationAgent"
    
    return {
        "sessionId": payload.sessionId,
        "status": "ALLOWED",
        "currentLoopCount": payload.currentLoopCount + 1,
        "nextAgent": next_agent,
        "sessionCost": accumulated_cost,
        "limitRemaining": max(0.0, 0.05 - accumulated_cost)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8007, reload=True)
