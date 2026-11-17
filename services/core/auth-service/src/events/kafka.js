const fs = require('fs');
const { Kafka, Partitioners } = require('kafkajs');

const brokerValue = process.env.KAFKA_BOOTSTRAP_SERVERS || process.env.KAFKA_BROKER || '';
const brokers = brokerValue.split(',').map((value) => value.trim()).filter(Boolean);
const saslEnabled = process.env.KAFKA_SASL_ENABLED !== 'false';
const username = process.env.KAFKA_SASL_USERNAME || '';
const password = process.env.KAFKA_SASL_PASSWORD || '';
const mechanism = (process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256').toLowerCase();
const validMechanisms = ['plain', 'scram-sha-256', 'scram-sha-512'];

if (saslEnabled && !validMechanisms.includes(mechanism)) {
  throw new Error(`Invalid KAFKA_SASL_MECHANISM: ${mechanism}`);
}

const caPath = process.env.KAFKA_CA_PATH || '/etc/secrets/ca.pem';
const caPem = process.env.KAFKA_CA || (
  fs.existsSync(caPath) ? fs.readFileSync(caPath, 'utf8') : ''
);
const hasCredentials = Boolean(username && password);
const hasCa = Boolean(caPem.trim());
const placeholder = !brokers.length || brokerValue.includes('pkc-xxxx');

let producer = null;
let connected = false;

if (!placeholder && (!saslEnabled || hasCredentials) && hasCa) {
  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'auth-service',
    brokers,
    // Use the Aiven project CA while keeping TLS verification enabled.
    ssl: { ca: [caPem] },
    ...(saslEnabled ? { sasl: { mechanism, username, password } } : {}),
    retry: { retries: 3 },
  });
  producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });
}

async function connectProducer() {
  if (placeholder) {
    console.warn('[AUTH-KAFKA] No valid KAFKA_BOOTSTRAP_SERVERS configured; Kafka disabled.');
    return;
  }
  if (saslEnabled && !hasCredentials) {
    console.warn('[AUTH-KAFKA] SASL username/password missing; Kafka disabled.');
    return;
  }
  if (!hasCa) {
    console.warn(`[AUTH-KAFKA] Aiven CA missing. Mount Secret File at ${caPath}; Kafka disabled.`);
    return;
  }

  try {
    await producer.connect();
    connected = true;
    console.log(`[AUTH-KAFKA] Connected to ${brokers.join(', ')} with verified TLS.`);
  } catch (error) {
    console.error('[AUTH-KAFKA] Connection failed:', error.message);
    // Keep authentication service available; events are logged locally until Kafka recovers.
  }
}

async function publishEvent(topic, event) {
  if (!connected || !producer) {
    console.info(`[AUTH-KAFKA-OFFLINE] ${topic}:`, event);
    return;
  }
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(event) }],
    });
  } catch (error) {
    console.error('[AUTH-KAFKA] Publish failed:', error.message);
  }
}

module.exports = { connectProducer, publishEvent };
