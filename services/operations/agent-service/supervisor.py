import os
from fastapi import HTTPException, status

# Mock pricing: $0.0015 per 1k input tokens, $0.002 per 1k output tokens
INPUT_TOKEN_RATE = 0.0015 / 1000
OUTPUT_TOKEN_RATE = 0.002 / 1000
MAX_SESSION_COST_USD = 0.05
MAX_GRAPH_DEPTH = 5

# Local fallback for tracking costs and depth per session
_session_cost_db = {}
_session_loop_db = {}

def get_redis_client():
    """Tries to connect to Redis, returns None if unavailable."""
    try:
        import redis
        redis_host = os.getenv("REDIS_HOST", "localhost")
        redis_port = int(os.getenv("REDIS_PORT", 6379))
        r = redis.Redis(host=redis_host, port=redis_port, db=0, socket_timeout=1)
        r.ping()
        return r
    except Exception:
        return None

r_client = get_redis_client()

def get_session_metric(session_id: str, metric_key: str, default: float = 0.0) -> float:
    """Reads metric from Redis or in-memory fallback."""
    if r_client:
        try:
            val = r_client.get(f"agent_session:{session_id}:{metric_key}")
            return float(val) if val else default
        except Exception:
            pass
    return _session_cost_db.get(f"{session_id}:{metric_key}", default)

def increment_session_metric(session_id: str, metric_key: str, amount: float) -> float:
    """Increments metric in Redis or in-memory fallback."""
    if r_client:
        try:
            key = f"agent_session:{session_id}:{metric_key}"
            new_val = r_client.incrbyfloat(key, amount)
            r_client.expire(key, 3600) # 1 hour TTL
            return float(new_val)
        except Exception:
            pass
    
    key = f"{session_id}:{metric_key}"
    current = _session_cost_db.get(key, 0.0)
    new_val = current + amount
    _session_cost_db[key] = new_val
    return new_val

def verify_agent_budget(session_id: str, current_loop_count: int):
    """
    Enforces strict supervisor guardrails on agent execution.
    1. Caps graph traversal depth to prevent recursive infinite loops.
    2. Limits cumulative financial spend per session to prevent token hemorrhage.
    """
    # 1. Enforce strict graph depth limits
    if current_loop_count >= MAX_GRAPH_DEPTH:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Agent execution exceeded maximum routing depth ({MAX_GRAPH_DEPTH}). Traversal aborted."
        )

    # 2. Check financial cost limits
    current_cost = get_session_metric(session_id, "cost", 0.0)
    if current_cost >= MAX_SESSION_COST_USD:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Session cost boundary limit of ${MAX_SESSION_COST_USD:.4f} exceeded (Current: ${current_cost:.4f}). Generation blocked."
        )

def track_tokens_and_cost(session_id: str, input_tokens: int, output_tokens: int) -> float:
    """Calculates and records LLM API costs for the session."""
    cost = (input_tokens * INPUT_TOKEN_RATE) + (output_tokens * OUTPUT_TOKEN_RATE)
    new_cost = increment_session_metric(session_id, "cost", cost)
    increment_session_metric(session_id, "input_tokens", float(input_tokens))
    increment_session_metric(session_id, "output_tokens", float(output_tokens))
    return new_cost
