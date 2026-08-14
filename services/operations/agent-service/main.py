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


# ─── Agent Workflow Executor ─────────────────────────────────────────────────

def execute_agent_logic(agent: str, prompt: str) -> tuple:
    """Returns (raw_output, execution_steps) for the given agent type."""

    if agent == "inventory":
        steps = [
            AgentStep(stepNumber=1, agentName="InventoryMonitorAgent", action="check_stock_levels",
                      thought="Need to inspect warehouse low stock items",
                      observation="Found 3 products below reorder threshold (SKU-102, SKU-304, SKU-901)."),
            AgentStep(stepNumber=2, agentName="SupplierReorderAgent", action="draft_purchase_order",
                      thought="Auto-drafting reorder ticket to primary supplier",
                      observation="Purchase order draft #PO-8821 generated for 50 units each."),
        ]
        output = "Inventory reorder workflow executed: Draft purchase order #PO-8821 submitted for manager approval."

    elif agent == "pricing":
        steps = [
            AgentStep(stepNumber=1, agentName="CompetitorScraperAgent", action="fetch_competitor_prices",
                      thought="Checking rival retailer pricing on flagship items",
                      observation="Competitor reduced price by 5%."),
            AgentStep(stepNumber=2, agentName="MarginOptimizationAgent", action="calculate_safe_discount",
                      thought="Ensure margin stays above 15%",
                      observation="Discounting by 3.5% yields competitive parity while preserving profit margin."),
        ]
        output = "Dynamic pricing agent adjusted product catalog pricing by 3.5% to match market shift."

    elif agent == "marketing":
        steps = [
            AgentStep(stepNumber=1, agentName="SegmentAnalyzerAgent", action="cluster_active_customers",
                      thought="Identify high-intent shoppers for targeted campaign",
                      observation="Identified VIP Customer Segment (420 users)."),
            AgentStep(stepNumber=2, agentName="CampaignGeneratorAgent", action="generate_personalized_copy",
                      thought="Draft LLM promotional newsletter and promo code",
                      observation="Campaign 'VIP Fall Sale' created with custom discount code VIP20."),
        ]
        output = "Marketing campaign 'VIP Fall Sale' generated and queued for dispatch."

    else:  # customer_assistance
        steps = [
            AgentStep(stepNumber=1, agentName="CustomerIntentAgent", action="parse_intent",
                      thought="Extract customer query intent",
                      observation="User asking about order refund status."),
            AgentStep(stepNumber=2, agentName="OrderLookupAgent", action="fetch_order_ledger",
                      thought="Querying database for recent user order",
                      observation="Order ORD-9918 is currently under REFUNDED state."),
        ]
        output = "Customer Support Agent Response: Your order #ORD-9918 refund was completed and issued to your original payment method."

    return output, steps


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "agent-service", "version": "2.0.0", "guardrails": "active"}


@app.post("/api/agent/execute", response_model=AgentTaskResponse)
def execute_agent_workflow(payload: AgentTaskRequest):
    """Execute agent workflow with mandatory guardrail filtering on all outputs."""
    start = time.time()
    agent = payload.agentType.lower()

    raw_output, steps = execute_agent_logic(agent, payload.prompt)

    # ── Run Guardrail Checks ──
    guardrail_result = run_guardrail_checks(raw_output)
    final_output = sanitize_output(raw_output, guardrail_result)
    was_sanitized = final_output != raw_output

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


from supervisor import verify_agent_budget, track_tokens_and_cost, get_session_metric

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
