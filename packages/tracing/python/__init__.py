"""
Shared OpenTelemetry bootstrap package for Python services.
"""
from .tracer import init_tracing, instrument_fastapi_app

__all__ = ["init_tracing", "instrument_fastapi_app"]
