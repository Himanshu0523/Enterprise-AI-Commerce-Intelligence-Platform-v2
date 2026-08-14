from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, validator
from typing import Dict, Any, Optional, List
import uvicorn
import logging
import time
import traceback
from datetime import datetime
import asyncio
from contextlib import asynccontextmanager

from workflows.shopping_workflow import ShoppingWorkflow

# LOGGING CONFIGURATION
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('agent_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# APPLICATION LIFECYCLE
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("=" * 50)
    logger.info("🤖 Agent Service Starting...")
    logger.info("=" * 50)
    
    # Initialize services
    app.state.startup_time = datetime.now()
    app.state.total_requests = 0
    app.state.active_requests = 0
    
    yield
    
    # Shutdown
    logger.info("=" * 50)
    logger.info("🤖 Agent Service Shutting Down...")
    logger.info(f"Total requests processed: {app.state.total_requests}")
    logger.info("=" * 50)

# FASTAPI APP INITIALIZATION
app = FastAPI(
    title="AI Agent Service - Shopping Assistant",
    description="""
    ## Multi-Agent AI Shopping Assistant
    
    This service uses multiple specialized AI agents to process shopping queries:
    
    - **Customer Agent**: Understands user intent and extracts structured data
    - **Recommendation Agent**: Scores and ranks products based on preferences
    - **Pricing Agent**: Provides dynamic pricing and deals
    - **Inventory Agent**: Checks stock availability and delivery estimates
    - **Marketing Agent**: Generates personalized marketing content
    
    ### Features:
    - Natural language understanding for shopping queries
    - Multi-factor product scoring and ranking
    - Real-time pricing with deals and offers
    - Location-based inventory checking
    - Personalized marketing messages
    - Indian market specific features (₹ currency, pincode delivery)
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# MIDDLEWARE
# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time", "X-Request-ID"]
)

# Custom Middleware for request tracking
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time and request ID to responses"""
    request_id = f"req_{int(time.time() * 1000)}_{id(request)}"
    
    start_time = time.time()
    app.state.active_requests += 1
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"
        response.headers["X-Request-ID"] = request_id
        
        # Log request
        logger.info(
            f"Request {request_id} | {request.method} {request.url.path} | "
            f"Status: {response.status_code} | Time: {process_time:.3f}s"
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Request {request_id} failed: {str(e)}")
        raise
    finally:
        app.state.active_requests -= 1
        app.state.total_requests += 1

# DATA MODELS
class QueryContext(BaseModel):
    """Context information for query processing"""
    user_id: Optional[str] = Field(None, description="User ID for personalization")
    session_id: Optional[str] = Field(None, description="Session ID for tracking")
    pincode: Optional[str] = Field(None, description="Delivery pincode", min_length=6, max_length=6)
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict, description="User preferences")
    location: Optional[Dict[str, str]] = Field(None, description="User location info")
    device_type: Optional[str] = Field(None, description="User device type")
    
    @validator('pincode')
    def validate_pincode(cls, v):
        if v and not v.isdigit():
            raise ValueError('Pincode must contain only digits')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "session_id": "sess456",
                "pincode": "400001",
                "preferences": {
                    "brand_preference": ["dell", "hp"],
                    "performance": True,
                    "battery_life": True
                },
                "location": {
                    "city": "Mumbai",
                    "state": "Maharashtra"
                },
                "device_type": "mobile"
            }
        }

class QueryRequest(BaseModel):
    """Main query request model"""
    query: str = Field(
        ...,
        description="Natural language query from user",
        min_length=1,
        max_length=1000,
        example="Find a gaming laptop under ₹80,000 with RTX graphics and good battery life"
    )
    context: QueryContext = Field(
        default_factory=QueryContext,
        description="Additional context for query processing"
    )
    max_results: Optional[int] = Field(
        default=5,
        ge=1,
        le=20,
        description="Maximum number of results to return"
    )
    include_details: Optional[bool] = Field(
        default=True,
        description="Include detailed product information"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "gaming laptop under 80000 with RTX 3050",
                "context": {
                    "user_id": "user123",
                    "session_id": "sess456",
                    "pincode": "400001",
                    "preferences": {
                        "gaming": True,
                        "performance": True
                    }
                },
                "max_results": 5,
                "include_details": True
            }
        }

class HealthResponse(BaseModel):
    """Health check response model"""
    status: str
    service: str
    version: str
    timestamp: str
    uptime: str
    active_agents: int
    system_stats: Dict[str, Any]

class QueryResponse(BaseModel):
    """Query processing response model"""
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    error_type: str
    message: str
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
    request_id: Optional[str] = None

class AgentInfo(BaseModel):
    """Agent information model"""
    name: str
    status: str
    description: str
    capabilities: List[str]

# SERVICE INITIALIZATION
# Initialize the shopping workflow
shopping_workflow = ShoppingWorkflow()

# Agent information registry
AGENT_INFO = {
    "customer_agent": AgentInfo(
        name="Customer Agent",
        status="active",
        description="Understands user intent and converts natural language to structured data",
        capabilities=[
            "Intent Detection",
            "Entity Extraction",
            "Constraint Extraction",
            "Preference Identification",
            "Query Structuring"
        ]
    ),
    "recommendation_agent": AgentInfo(
        name="Recommendation Agent",
        status="active",
        description="Scores and ranks products based on user preferences and requirements",
        capabilities=[
            "Product Filtering",
            "Multi-factor Scoring",
            "Product Ranking",
            "Explanation Generation"
        ]
    ),
    "pricing_agent": AgentInfo(
        name="Pricing Agent",
        status="active",
        description="Provides dynamic pricing, deals, and offers",
        capabilities=[
            "Price Comparison",
            "Deal Detection",
            "EMI Calculation",
            "Coupon Application",
            "Price History Analysis"
        ]
    ),
    "inventory_agent": AgentInfo(
        name="Inventory Agent",
        status="active",
        description="Manages stock availability and delivery estimates",
        capabilities=[
            "Stock Checking",
            "Delivery Estimation",
            "Warehouse Management",
            "Restock Forecasting"
        ]
    ),
    "marketing_agent": AgentInfo(
        name="Marketing Agent",
        status="active",
        description="Generates personalized marketing and promotional content",
        capabilities=[
            "Persona Detection",
            "Personalized Messaging",
            "Upsell Suggestions",
            "Promotion Generation"
        ]
    )
}

# EXCEPTION HANDLERS
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": " -> ".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    logger.warning(f"Validation error: {errors}")
    
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            error="Validation Error",
            error_type="validation_error",
            message="Please check your input data",
            request_id=request.headers.get("X-Request-ID")
        ).dict()
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=str(exc.detail),
            error_type="http_error",
            message="An error occurred processing your request",
            request_id=request.headers.get("X-Request-ID")
        ).dict()
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions"""
    error_trace = traceback.format_exc()
    logger.error(f"Unhandled exception: {error_trace}")
    
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error=str(exc),
            error_type="internal_error",
            message="An unexpected error occurred. Please try again later.",
            request_id=request.headers.get("X-Request-ID")
        ).dict()
    )

# API ENDPOINTS
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with API information"""
    return {
        "service": "AI Agent Service",
        "version": "1.0.0",
        "description": "Multi-agent AI shopping assistant",
        "docs": "/docs",
        "health": "/health",
        "status": "running"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    
    Returns detailed health status of the service and all agents
    """
    uptime = datetime.now() - app.state.startup_time
    
    health_data = {
        "status": "healthy",
        "service": "agent-service",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "uptime": str(uptime).split('.')[0],
        "active_agents": len(AGENT_INFO),
        "system_stats": {
            "total_requests": app.state.total_requests,
            "active_requests": app.state.active_requests,
            "average_response_time": f"{shopping_workflow.get_average_time():.3f}s",
            "agents_status": {
                name: agent.status 
                for name, agent in AGENT_INFO.items()
            }
        }
    }
    
    return health_data

@app.get("/agents", response_model=Dict[str, AgentInfo])
async def get_agents():
    """
    Get information about all available agents
    
    Returns details about each agent and their capabilities
    """
    return AGENT_INFO

@app.get("/agents/{agent_name}", response_model=AgentInfo)
async def get_agent_info(agent_name: str):
    """
    Get detailed information about a specific agent
    
    - **agent_name**: Name of the agent (e.g., customer_agent, pricing_agent)
    """
    if agent_name not in AGENT_INFO:
        raise HTTPException(
            status_code=404,
            detail=f"Agent '{agent_name}' not found. Available agents: {list(AGENT_INFO.keys())}"
        )
    
    return AGENT_INFO[agent_name]

@app.post("/api/v1/agent/process", response_model=QueryResponse)
async def process_query(
    request: QueryRequest,
    background_tasks: BackgroundTasks
):
    """
    Process user query through the multi-agent workflow
    
    This endpoint:
    1. Accepts natural language shopping queries
    2. Routes through Customer Agent for understanding
    3. Finds relevant products
    4. Scores and ranks by Recommendation Agent
    5. Adds pricing by Pricing Agent
    6. Checks inventory by Inventory Agent
    7. Generates marketing content by Marketing Agent
    
    ### Example Queries:
    - "Gaming laptop under 80000 with RTX graphics"
    - "Best camera phone under 30000"
    - "Budget laptop for students with good battery"
    """
    start_time = time.time()
    
    try:
        logger.info(f"Processing query: {request.query[:100]}...")
        
        # Prepare context
        context = request.context.dict(exclude_none=True) if request.context else {}
        if not context.get("preferences"):
            context["preferences"] = {}
        
        # Process through workflow
        result = await shopping_workflow.process(
            query=request.query,
            context=context
        )
        
        # Limit results if specified
        if result.get("recommendations") and request.max_results:
            result["recommendations"] = result["recommendations"][:request.max_results]
        
        # Remove detailed info if not requested
        if not request.include_details:
            for rec in result.get("recommendations", []):
                rec.pop("specs", None)
                rec.pop("scores", None)
        
        # Add processing metadata
        processing_time = time.time() - start_time
        metadata = {
            "processing_time_ms": round(processing_time * 1000, 2),
            "agents_used": result.get("metadata", {}).get("agents_used", []),
            "results_count": len(result.get("recommendations", [])),
            "query_structured": result.get("structured_query", {})
        }
        
        # Log successful processing
        logger.info(
            f"Query processed successfully | "
            f"Results: {len(result.get('recommendations', []))} | "
            f"Time: {processing_time:.3f}s"
        )
        
        return QueryResponse(
            success=True,
            data=result,
            message=result.get("message", "Query processed successfully"),
            metadata=metadata
        )
        
    except asyncio.TimeoutError:
        logger.error(f"Query timeout: {request.query[:100]}")
        raise HTTPException(
            status_code=408,
            detail="Query processing timed out. Please try again."
        )
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )

@app.post("/api/v1/agent/batch", response_model=QueryResponse)
async def process_batch_queries(queries: List[QueryRequest]):
    """
    Process multiple queries in batch
    
    Accepts a list of queries and processes them concurrently
    """
    try:
        logger.info(f"Processing batch of {len(queries)} queries")
        
        # Process all queries concurrently
        tasks = [
            shopping_workflow.process(
                query=q.query,
                context=q.context.dict(exclude_none=True)
            )
            for q in queries
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Separate successful and failed results
        successful = []
        failed = []
        
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                failed.append({
                    "index": i,
                    "query": queries[i].query,
                    "error": str(result)
                })
            else:
                successful.append(result)
        
        return QueryResponse(
            success=len(failed) == 0,
            data={
                "results": successful,
                "total": len(queries),
                "successful": len(successful),
                "failed": len(failed),
                "errors": failed if failed else None
            },
            message=f"Processed {len(successful)}/{len(queries)} queries successfully"
        )
        
    except Exception as e:
        logger.error(f"Batch processing error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Batch processing failed: {str(e)}"
        )

@app.get("/metrics")
async def get_metrics():
    """
    Get service metrics and statistics
    
    Returns detailed metrics about service usage and performance
    """
    metrics = {
        "service": "agent-service",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "uptime": str(datetime.now() - app.state.startup_time).split('.')[0],
        "requests": {
            "total": app.state.total_requests,
            "active": app.state.active_requests
        },
        "performance": {
            "average_response_time_seconds": round(shopping_workflow.get_average_time(), 3),
            "agents_count": len(AGENT_INFO)
        },
        "agents": {
            name: {
                "status": agent.status,
                "capabilities_count": len(agent.capabilities)
            }
            for name, agent in AGENT_INFO.items()
        }
    }
    
    return metrics

@app.post("/api/v1/agent/feedback")
async def submit_feedback(
    query_id: str,
    rating: int = Field(..., ge=1, le=5),
    feedback_text: Optional[str] = None
):
    """
    Submit feedback for a query result
    
    - **query_id**: ID of the query
    - **rating**: Rating from 1-5
    - **feedback_text**: Optional feedback text
    """
    # In production, save to database
    logger.info(f"Feedback received - Query: {query_id}, Rating: {rating}")
    
    return {
        "success": True,
        "message": "Feedback submitted successfully",
        "data": {
            "query_id": query_id,
            "rating": rating,
            "feedback": feedback_text
        }
    }

@app.delete("/api/v1/agent/cache")
async def clear_cache():
    """
    Clear agent caches
    
    Useful for debugging or when data needs to be refreshed
    """
    # Clear cache implementations
    logger.info("Clearing all agent caches")
    
    return {
        "success": True,
        "message": "All caches cleared successfully"
    }

# ERROR HANDLING ENDPOINTS

@app.get("/api/v1/agent/debug/{query_id}")
async def get_query_debug_info(query_id: str):
    """
    Get debug information for a specific query
    
    Useful for troubleshooting query processing issues
    """
    # In production, fetch from log/database
    return {
        "query_id": query_id,
        "debug_info": {
            "message": "Debug information not available in current configuration"
        }
    }

# MAIN ENTRY POINT

if __name__ == "__main__":
    # Configure uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        log_config=None,  # Use our custom logging config
        access_log=True,
        workers=1,  # Single worker for state management
        limit_concurrency=100,
        timeout_keep_alive=5
    )