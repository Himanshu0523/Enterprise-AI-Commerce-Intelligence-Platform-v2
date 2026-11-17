const fs = require('fs');
const { Kafka, Partitioners } = require('kafkajs');

const configuredBrokerValue =
  process.env.KAFKA_BOOTSTRAP_SERVERS || process.env.KAFKA_BROKER || '';
const brokers = configuredBrokerValue
  .split(',')
  .map((broker) => broker.trim())
  .filter(Boolean);
const hasConfiguredBroker = brokers.length > 0;
const isPlaceholderBroker = configuredBrokerValue.includes('pkc-xxxx');

const saslUsername = process.env.KAFKA_SASL_USERNAME || '';
const saslPassword = process.env.KAFKA_SASL_PASSWORD || '';
const saslMechanism = (process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256').toLowerCase();
const saslEnabled = process.env.KAFKA_SASL_ENABLED !== 'false';
const hasSaslCredentials = Boolean(saslUsername && saslPassword);
const supportedSaslMechanisms = ['plain', 'scram-sha-256', 'scram-sha-512'];

if (saslEnabled && !supportedSaslMechanisms.includes(saslMechanism)) {
  throw new Error(
    `Unsupported KAFKA_SASL_MECHANISM "${saslMechanism}". Use plain, scram-sha-256, or scram-sha-512.`,
  );
}

// Aiven's project CA must be supplied as a Render Secret File or PEM env var.
// Never disable TLS certificate verification to work around a trust error.
const caPath = process.env.KAFKA_CA_PATH || '/etc/secrets/ca.pem';
const caPem = process.env.KAFKA_CA || (
  fs.existsSync(caPath) ? fs.readFileSync(caPath, 'utf8') : ''
);
const hasCaCertificate = Boolean(caPem.trim());

const canInitializeKafka =
  hasConfiguredBroker &&
  !isPlaceholderBroker &&
  (!saslEnabled || hasSaslCredentials) &&
  hasCaCertificate;

const kafka = canInitializeKafka
  ? new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'auth-service',
      brokers,
      ssl: { ca: [caPem] },
      ...(saslEnabled
        ? {
            sasl: {
              mechanism: saslMechanism,
              username: saslUsername,
              password: saslPassword,
            },
          }
        : {}),
      retry: { retries: 5 },
    })
  : null;

// KafkaJS v2 accepts createPartitioner on producer(), not on Kafka().
const producer = kafka
  ? kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
  : null;
let isConnected = false;

const connectProducer = async () => {
  if (!hasConfiguredBroker) {
    console.info('[AUTH-KAFKA] No broker configured; event streaming is disabled.');
    return;
  }

  if (isPlaceholderBroker) {
    console.warn('[AUTH-KAFKA] Placeholder broker detected; event streaming is disabled.');
    return;
  }

  if (saslEnabled && !hasSaslCredentials) {
    console.warn('[AUTH-KAFKA] SASL credentials are missing; event streaming is disabled.');
    return;
  }

  if (!hasCaCertificate) {
    console.warn(
      `[AUTH-KAFKA] CA certificate not found. Set KAFKA_CA or mount the Aiven CA at ${caPath}; event streaming is disabled.`,
    );
    return;
  }

  try {
    await producer.connect();
    isConnected = true;
    console.log(`[AUTH-KAFKA] Producer connected to ${brokers.join(', ')} using verified TLS.`);
  } catch (err) {
    console.warn('[AUTH-KAFKA] Kafka unavailable; continuing without event streaming:', err.message);
  }
};

const publishEvent = async (topic, event) => {
  if (!isConnected || !producer) {
    console.log(`[AUTH-KAFKA-OFFLINE] ${topic}:`, event);
    return;
  }

  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(event) }],
    });
  } catch (err) {
    // Analytics/event delivery must never fail a registration or login request.
    console.error('[AUTH-KAFKA] Publish failed:', err.message);
  }
};

module.exports = { connectProducer, publishEvent };
