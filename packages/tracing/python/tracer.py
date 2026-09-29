# pyright: reportMissingImports=false
"""
packages/tracing/python/tracer.py
Shared OpenTelemetry bootstrap for all Python FastAPI microservices.

USAGE — Call init_tracing() BEFORE creating your FastAPI app:

    import sys, os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../../packages/tracing/python'))
    from tracer import init_tracing
    init_tracing("ml-service")

    from fastapi import FastAPI
    app = FastAPI()

Environment Variables:
    OTEL_EXPORTER_OTLP_ENDPOINT  — Jaeger OTLP endpoint (default: http://jaeger:4318)
    OTEL_SERVICE_NAME             — Overrides the service_name argument if set
"""

import os
import logging
import importlib

logger = logging.getLogger(__name__)


def init_tracing(service_name: str) -> None:
    """
    Initializes OpenTelemetry tracing for a FastAPI microservice.
    Must be called BEFORE the FastAPI app is created.

    Args:
        service_name: Logical name of this service (e.g. 'ml-service')
    """
    try:
        trace = importlib.import_module("opentelemetry.trace")
        TracerProvider = getattr(importlib.import_module("opentelemetry.sdk.trace"), "TracerProvider")
        BatchSpanProcessor = getattr(importlib.import_module("opentelemetry.sdk.trace.export"), "BatchSpanProcessor")
        resources_mod = importlib.import_module("opentelemetry.sdk.resources")
        Resource = getattr(resources_mod, "Resource")
        SERVICE_NAME = getattr(resources_mod, "SERVICE_NAME")
        OTLPSpanExporter = getattr(importlib.import_module("opentelemetry.exporter.otlp.proto.http.trace_exporter"), "OTLPSpanExporter")
        RequestsInstrumentor = getattr(importlib.import_module("opentelemetry.instrumentation.requests"), "RequestsInstrumentor")

        otlp_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://jaeger:4318")
        resolved_service = os.getenv("OTEL_SERVICE_NAME", service_name)

        resource = Resource(attributes={SERVICE_NAME: resolved_service})
        provider = TracerProvider(resource=resource)

        exporter = OTLPSpanExporter(endpoint=f"{otlp_endpoint}/v1/traces")
        provider.add_span_processor(BatchSpanProcessor(exporter))

        trace.set_tracer_provider(provider)

        # Auto-instrument outgoing HTTP (requests library)
        RequestsInstrumentor().instrument()

        env = os.getenv("NODE_ENV", os.getenv("ENV", "development"))
        if env != "production":
            logger.info(f"[OTel] Tracing initialized for '{resolved_service}' → {otlp_endpoint}")

    except (ImportError, AttributeError, Exception) as e:
        logger.warning(
            f"[OTel] OpenTelemetry packages not installed or initialized — tracing disabled. "
            f"Install from packages/tracing/requirements.txt. Error: {e}"
        )


def instrument_fastapi_app(app) -> None:
    """
    Call this AFTER creating your FastAPI app instance to instrument it.

    Args:
        app: The FastAPI application instance
    """
    try:
        FastAPIInstrumentor = getattr(importlib.import_module("opentelemetry.instrumentation.fastapi"), "FastAPIInstrumentor")
        FastAPIInstrumentor.instrument_app(app)
    except (ImportError, AttributeError, Exception):
        pass  # Gracefully degrade if OTel not installed

