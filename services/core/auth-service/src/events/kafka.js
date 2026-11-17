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

const canInitializeKafka =
  hasConfiguredBroker &&
  !isPlaceholderBroker &&
  (!saslEnabled || hasSaslCredentials);

const kafka = canInitializeKafka
  ? new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'auth-service',
      brokers,
      ssl: saslEnabled,
      ...(saslEnabled
        ? {
            sasl: {
              mechanism: saslMechanism,
              username: saslUsername,
              password: saslPassword,
            },
          }
        : {}),
      retry: { retries: 2 },
    })
  : null;

// KafkaJS v2 accepts createPartitioner on producer(), not on the Kafka constructor.
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
    console.warn(
      '[AUTH-KAFKA] SASL is enabled but KAFKA_SASL_USERNAME or KAFKA_SASL_PASSWORD is missing; event streaming is disabled.',
    );
    return;
  }

  try {
    await producer.connect();
    isConnected = true;
    console.log(`[AUTH-KAFKA] Producer connected to ${brokers.join(', ')}.`);
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
