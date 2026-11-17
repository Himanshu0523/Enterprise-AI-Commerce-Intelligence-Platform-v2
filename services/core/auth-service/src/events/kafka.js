const fs = require('fs');
const { Kafka, Partitioners } = require('kafkajs');

const brokerValue = process.env.KAFKA_BOOTSTRAP_SERVERS || process.env.KAFKA_BROKER || '';
const brokers = brokerValue.split(',').map((value) => value.trim()).filter(Boolean);
const saslEnabled = process.env.KAFKA_SASL_ENABLED !== 'false';
const username = process.env.KAFKA_SASL_USERNAME || '';
const password = process.env.KAFKA_SASL_PASSWORD || '';
const mechanism = (process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256').toLowerCase();
const validMechanisms = ['plain', 'scram-sha-256', 'scram-sha-512'];

const FAILURE_THRESHOLD = Math.max(1, Number(process.env.KAFKA_CB_FAILURE_THRESHOLD || 3));
const OPEN_BASE_MS = Math.max(1000, Number(process.env.KAFKA_CB_RESET_MS || 30000));
const OPEN_MAX_MS = Math.max(OPEN_BASE_MS, Number(process.env.KAFKA_CB_MAX_RESET_MS || 300000));
const MAX_QUEUE_SIZE = Math.max(10, Number(process.env.KAFKA_EVENT_QUEUE_MAX || 1000));
const WORKER_IDLE_MS = 1000;

if (saslEnabled && !validMechanisms.includes(mechanism)) {
  throw new Error(`Invalid KAFKA_SASL_MECHANISM: ${mechanism}`);
}

const caPath = process.env.KAFKA_CA_PATH || '/etc/secrets/ca.pem';
let caPem = process.env.KAFKA_CA || '';
if (!caPem && fs.existsSync(caPath)) {
  caPem = fs.readFileSync(caPath, 'utf8');
}

const hasCredentials = Boolean(username && password);
const hasCa = Boolean(caPem.trim());
const isConfigured =
  brokers.length > 0 &&
  !brokerValue.includes('pkc-xxxx') &&
  (!saslEnabled || hasCredentials) &&
  hasCa;

let producer = null;
let connected = false;
let started = false;
let workerRunning = false;
let workerTimer = null;
let consecutiveFailures = 0;
let openCount = 0;
let openedUntil = 0;
let halfOpenProbeInFlight = false;
let droppedEvents = 0;
const eventQueue = [];

const breaker = {
  state: 'CLOSED', // CLOSED -> OPEN -> HALF_OPEN -> CLOSED
  lastFailureAt: null,
  lastError: null,
};

if (isConfigured) {
  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'auth-service',
    brokers,
    ssl: { ca: [caPem] }, // Keep TLS certificate validation enabled.
    ...(saslEnabled ? { sasl: { mechanism, username, password } } : {}),
    connectionTimeout: 5000,
    requestTimeout: 8000,
    retry: { retries: 0 }, // Circuit breaker owns retries/backoff.
  });

  producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
    allowAutoTopicCreation: false,
  });
}

function getStatus() {
  return {
    configured: isConfigured,
    connected,
    circuit: breaker.state,
    queuedEvents: eventQueue.length,
    droppedEvents,
    consecutiveFailures,
    lastFailureAt: breaker.lastFailureAt,
    lastError: breaker.lastError,
  };
}

function scheduleWorker(delayMs = 0) {
  if (!started || workerTimer) return;
  workerTimer = setTimeout(() => {
    workerTimer = null;
    runWorker().catch((error) => {
      console.error('[AUTH-KAFKA] Background worker error:', error.message);
      scheduleWorker(OPEN_BASE_MS);
    });
  }, delayMs);
  if (typeof workerTimer.unref === 'function') workerTimer.unref();
}

function openCircuit(error) {
  connected = false;
  consecutiveFailures += 1;
  breaker.lastFailureAt = new Date().toISOString();
  breaker.lastError = error ? error.message : 'Kafka operation failed';

  if (breaker.state === 'HALF_OPEN' || consecutiveFailures >= FAILURE_THRESHOLD) {
    openCount += 1;
    const backoff = Math.min(OPEN_MAX_MS, OPEN_BASE_MS * (2 ** Math.max(0, openCount - 1)));
    const jitteredBackoff = Math.round(backoff * (0.8 + Math.random() * 0.4));
    openedUntil = Date.now() + jitteredBackoff;
    breaker.state = 'OPEN';
    halfOpenProbeInFlight = false;
    console.error(
      `[AUTH-KAFKA-CB] OPEN for ${jitteredBackoff}ms after failure: ${breaker.lastError}`,
    );
  } else {
    console.warn(
      `[AUTH-KAFKA-CB] Failure ${consecutiveFailures}/${FAILURE_THRESHOLD}: ${breaker.lastError}`,
    );
  }
}

function closeCircuit() {
  const wasOpen = breaker.state !== 'CLOSED';
  breaker.state = 'CLOSED';
  connected = true;
  consecutiveFailures = 0;
  openCount = 0;
  openedUntil = 0;
  halfOpenProbeInFlight = false;
  breaker.lastError = null;
  if (wasOpen) {
    console.info('[AUTH-KAFKA-CB] CLOSED; Kafka connection recovered.');
  }
}

async function disconnectQuietly() {
  if (!producer) return;
  try {
    await producer.disconnect();
  } catch (error) {
    console.warn('[AUTH-KAFKA] Disconnect cleanup failed:', error.message);
  } finally {
    connected = false;
  }
}

async function ensureConnected() {
  if (!producer || !isConfigured) return false;

  if (breaker.state === 'OPEN') {
    if (Date.now() < openedUntil) return false;
    breaker.state = 'HALF_OPEN';
    halfOpenProbeInFlight = false;
    console.info('[AUTH-KAFKA-CB] HALF_OPEN; testing Kafka recovery.');
  }

  if (breaker.state === 'HALF_OPEN') {
    if (halfOpenProbeInFlight) return false;
    halfOpenProbeInFlight = true;
  }

  if (connected) return true;

  try {
    await producer.connect();
    closeCircuit();
    console.info(`[AUTH-KAFKA] Connected to ${brokers.join(', ')} with verified TLS.`);
    return true;
  } catch (error) {
    openCircuit(error);
    await disconnectQuietly();
    return false;
  } finally {
    halfOpenProbeInFlight = false;
  }
}

async function runWorker() {
  if (!started || workerRunning) return;
  workerRunning = true;

  try {
    const ready = await ensureConnected();
    if (!ready) {
      const wait = breaker.state === 'OPEN'
        ? Math.max(250, openedUntil - Date.now())
        : OPEN_BASE_MS;
      scheduleWorker(wait);
      return;
    }

    // Drain serially to avoid concurrent producer sends and unbounded pressure.
    while (eventQueue.length > 0 && connected && breaker.state === 'CLOSED') {
      const item = eventQueue[0];
      try {
        await producer.send({
          topic: item.topic,
          messages: [{ key: item.key, value: item.value }],
        });
        eventQueue.shift();
        closeCircuit();
      } catch (error) {
        openCircuit(error);
        await disconnectQuietly();
        break; // Keep the failed item at the head of the queue for a later retry.
      }
    }

    if (eventQueue.length > 0 || !connected) {
      const wait = breaker.state === 'OPEN'
        ? Math.max(250, openedUntil - Date.now())
        : WORKER_IDLE_MS;
      scheduleWorker(wait);
    }
  } finally {
    workerRunning = false;
  }
}

/**
 * Start Kafka in the background. This function intentionally does not wait for
 * broker availability, so Kafka outages/invalid credentials never block HTTP startup.
 */
async function connectProducer() {
  if (!isConfigured) {
    const reasons = [];
    if (!brokers.length || brokerValue.includes('pkc-xxxx')) reasons.push('bootstrap servers');
    if (saslEnabled && !hasCredentials) reasons.push('SASL username/password');
    if (!hasCa) reasons.push(`Aiven CA file/PEM (${caPath})`);
    console.warn(`[AUTH-KAFKA] Kafka not configured (${reasons.join(', ')}); event delivery is disabled.`);
    return getStatus();
  }

  if (started) return getStatus();
  started = true;
  scheduleWorker(0);
  console.info('[AUTH-KAFKA] Background producer and circuit breaker started.');
  return getStatus();
}

/**
 * Enqueue and return immediately. The auth request never waits for Kafka I/O.
 * This bounded in-memory queue is best-effort and is cleared if the process restarts.
 */
async function publishEvent(topic, event) {
  if (!started || !isConfigured) {
    console.warn(`[AUTH-KAFKA-OFFLINE] Event skipped for topic "${topic}" (Kafka unavailable/unconfigured).`);
    return { accepted: false, reason: 'kafka_unavailable' };
  }

  if (eventQueue.length >= MAX_QUEUE_SIZE) {
    droppedEvents += 1;
    console.error(
      `[AUTH-KAFKA] Event queue full (${MAX_QUEUE_SIZE}); dropping event for topic "${topic}". Total dropped: ${droppedEvents}`,
    );
    return { accepted: false, reason: 'queue_full' };
  }

  eventQueue.push({
    topic,
    key: event && (event.userId || event.id) ? String(event.userId || event.id) : undefined,
    value: JSON.stringify(event),
  });

  scheduleWorker(0);
  return { accepted: true, queued: true };
}

module.exports = {
  connectProducer,
  publishEvent,
  getKafkaStatus: getStatus,
};
