import time
import uuid
import json
import os

# Root trace file path matching Node.js
ARTIFACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "artifacts"))
TRACE_FILE = os.path.join(ARTIFACTS_DIR, "traces.json")

os.makedirs(ARTIFACTS_DIR, exist_ok=True)

class PythonSpan:
    def __init__(self, name, parent_context=None):
        self.name = name
        self.trace_id = parent_context.get("traceId") if parent_context else uuid.uuid4().hex
        self.span_id = uuid.uuid4().hex[:16]
        self.parent_span_id = parent_context.get("spanId") if parent_context else None
        self.start_time = time.perf_counter()
        self.attributes = {}
        self.events = []
        self.status = {"code": "UNSET"}

    def set_attribute(self, key, value):
        self.attributes[key] = value
        return self

    def add_event(self, name, attributes=None):
        self.events.append({
            "name": name,
            "time": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "attributes": attributes or {}
        })
        return self

    def set_status(self, code, message=""):
        self.status = {"code": code, "message": message}
        return self

    def end(self):
        end_time = time.perf_counter()
        # Duration in milliseconds
        duration_ms = (end_time - self.start_time) * 1000.0

        span_data = {
            "name": self.name,
            "traceId": self.trace_id,
            "spanId": self.span_id,
            "parentSpanId": self.parent_span_id,
            "durationMs": round(duration_ms, 2),
            "startTimeStr": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "attributes": self.attributes,
            "events": self.events,
            "status": self.status
        }

        # Write thread-safe span output
        try:
            traces = []
            if os.path.exists(TRACE_FILE):
                try:
                    with open(TRACE_FILE, "r") as f:
                        traces = json.load(f)
                except Exception:
                    traces = []
            
            traces.append(span_data)
            with open(TRACE_FILE, "w") as f:
                json.dump(traces, f, indent=2)
        except Exception as e:
            print(f"[TRACING] Write error: {e}")

    @property
    def traceparent(self):
        return f"00-{self.trace_id}-{self.span_id}-01"


class PythonTracer:
    def __init__(self, service_name):
        self.service_name = service_name

    def start_span(self, name, traceparent=None):
        parent_context = None
        if traceparent and isinstance(traceparent, str):
            parts = traceparent.split("-")
            if len(parts) == 4:
                parent_context = {
                    "traceId": parts[1],
                    "spanId": parts[2]
                }
        
        span = PythonSpan(name, parent_context)
        span.set_attribute("service.name", self.service_name)
        return span
