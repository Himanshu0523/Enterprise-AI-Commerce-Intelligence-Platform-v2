/**
 * Distributed Trace Propagation for Kafka Messages
 *
 * When a microservice publishes a Kafka event that originated from an HTTP
 * request, it must carry the correlation ID and W3C traceparent forward so
 * the entire chain (HTTP → Service A → Kafka → Service B → Service C) is
 * visible as a single trace in Jaeger / Loki / Grafana.
 *
 * Usage in any service's Kafka producer:
 *
 *   const { buildTraceHeaders, extractTraceFromKafkaMsg } = require('../../../packages/shared-utils/kafka-trace');
 *
 *   // PUBLISHING (e.g. order-service emitting ORDER_CREATED):
 *   await producer.send({
 *     topic: TOPICS.ORDER_CREATED,
 *     messages: [{
 *       key: orderId,
 *       value: JSON.stringify(payload),
 *       headers: buildTraceHeaders(req),   // <-- inject from HTTP request
 *     }],
 *   });
 *
 *   // CONSUMING (e.g. inventory-service consuming ORDER_CREATED):
 *   const eachMessage = async ({ topic, message }) => {
 *     const trace = extractTraceFromKafkaMsg(message);
 *     console.log(`[${topic}] corr=${trace.correlationId} trace=${trace.traceParent}`);
 *     // Pass trace context into any downstream HTTP calls:
 *     await axios.post(url, body, { headers: trace.asHttpHeaders() });
 *   };
 */

/**
 * Build Kafka message headers from an Express request object.
 * Call this in a Kafka producer that handles an inbound HTTP request.
 *
 * @param {import('express').Request} req - Express request with correlationId/traceParent
 * @returns {Record<string, Buffer>} Kafka-compatible headers object
 */
function buildTraceHeaders(req) {
  const correlationId = (req && req.correlationId) || generateId();
  const traceParent = (req && req.traceParent) || `00-${padHex(correlationId)}-${randomHex(16)}-01`;

  return {
    'x-correlation-id': Buffer.from(correlationId),
    'traceparent': Buffer.from(traceParent),
    'x-published-at': Buffer.from(new Date().toISOString()),
  };
}

/**
 * Build Kafka message headers from an explicit correlation ID string.
 * Use when publishing events triggered internally (e.g. cron jobs, saga steps).
 *
 * @param {string} correlationId
 * @param {string} [traceParent]
 * @returns {Record<string, Buffer>}
 */
function buildTraceHeadersFromId(correlationId, traceParent) {
  const cid = correlationId || generateId();
  const tp = traceParent || `00-${padHex(cid)}-${randomHex(16)}-01`;
  return {
    'x-correlation-id': Buffer.from(cid),
    'traceparent': Buffer.from(tp),
    'x-published-at': Buffer.from(new Date().toISOString()),
  };
}

/**
 * Extract trace context from a consumed Kafka message's headers.
 *
 * @param {object} message - Kafka message from kafkajs consumer eachMessage
 * @returns {{ correlationId: string, traceParent: string, publishedAt: string, asHttpHeaders: () => object }}
 */
function extractTraceFromKafkaMsg(message) {
  const headers = message.headers || {};

  const correlationId = headers['x-correlation-id']
    ? headers['x-correlation-id'].toString()
    : generateId();

  const traceParent = headers['traceparent']
    ? headers['traceparent'].toString()
    : `00-${padHex(correlationId)}-${randomHex(16)}-01`;

  const publishedAt = headers['x-published-at']
    ? headers['x-published-at'].toString()
    : new Date().toISOString();

  return {
    correlationId,
    traceParent,
    publishedAt,
    /**
     * Returns headers ready to attach to a downstream axios/fetch HTTP call
     * so the trace chain continues through synchronous HTTP calls too.
     */
    asHttpHeaders() {
      return {
        'x-correlation-id': correlationId,
        'traceparent': traceParent,
      };
    },
  };
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function padHex(str) {
  return str.replace(/-/g, '').padEnd(32, '0').slice(0, 32);
}

function randomHex(len) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

module.exports = { buildTraceHeaders, buildTraceHeadersFromId, extractTraceFromKafkaMsg };
