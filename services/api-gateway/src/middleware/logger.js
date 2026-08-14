const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

/**
 * Distributed Tracing & Correlation ID Middleware
 *
 * Implements W3C Trace Context (https://www.w3.org/TR/trace-context/) for
 * full cross-service observability. Every request through the gateway gets:
 *
 *   X-Correlation-ID  — stable request ID usable in logs, Kafka messages,
 *                        and downstream HTTP calls. Preserved from client if
 *                        supplied (e.g. mobile app retries), generated otherwise.
 *
 *   traceparent        — W3C standard format: "00-{traceId}-{spanId}-01"
 *                        Compatible with OpenTelemetry, Jaeger, Zipkin, Datadog
 *                        without any SDK dependency at the gateway level.
 *
 * Both headers are forwarded to downstream services via proxy.js so a single
 * user click can be traced across all 19 services and Kafka messages.
 *
 * Kafka propagation: producers must attach correlationId as a message header:
 *   messages: [{ key, value, headers: { 'x-correlation-id': correlationId } }]
 */

function generateTraceParent(correlationId) {
  // W3C traceparent: version(2)-traceId(32hex)-spanId(16hex)-flags(2)
  // Use correlationId as the traceId (pad/trim to 32 hex chars)
  const traceId = correlationId.replace(/-/g, '').padEnd(32, '0').slice(0, 32);
  const spanId = uuidv4().replace(/-/g, '').slice(0, 16);
  return `00-${traceId}-${spanId}-01`;
}

const addTraceContext = (req, res, next) => {
  // Preserve client-supplied correlation ID (for retries / mobile tracking)
  const incomingCorrelationId = req.headers['x-correlation-id'];
  const correlationId = incomingCorrelationId && incomingCorrelationId.length <= 128
    ? incomingCorrelationId
    : uuidv4();

  // Generate or propagate W3C traceparent
  const incomingTraceParent = req.headers['traceparent'];
  const traceParent = incomingTraceParent || generateTraceParent(correlationId);

  // Attach to request object (proxy.js reads these)
  req.correlationId = correlationId;
  req.traceParent = traceParent;
  req.traceStartMs = Date.now();

  // Expose on response so clients / load balancers can log them
  res.setHeader('x-correlation-id', correlationId);
  res.setHeader('traceparent', traceParent);

  next();
};

// Morgan custom tokens
morgan.token('correlation-id', (req) => req.correlationId || '-');
morgan.token('trace-parent', (req) => req.traceParent || '-');
morgan.token('latency-ms', (req) => req.traceStartMs ? `${Date.now() - req.traceStartMs}ms` : '-');

const loggerFormat =
  ':method :url :status :latency-ms [corr=:correlation-id] [trace=:trace-parent]';

module.exports = [addTraceContext, morgan(loggerFormat)];