const { Kafka } = require('kafkajs');

const configuredBrokerValue =
  process.env.KAFKA_BOOTSTRAP_SERVERS || process.env.KAFKA_BROKER || '';
const brokers = configuredBrokerValue
  .split(',')
  .map((broker) => broker.trim())
  .filter(Boolean);
const hasConfiguredBroker = brokers.length > 0;
const isPlaceholderBroker = configuredBrokerValue.includes('pkc-xxxx');

const saslConfig = process.env.KAFKA_SASL_USERNAME && !isPlaceholderBroker
  ? {
      ssl: true,
      sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD,
      },
    }
  : {};

const kafka = hasConfiguredBroker && !isPlaceholderBroker
  ? new Kafka({
      clientId: 'auth-service',
      brokers,
      retry: { retries: 2 },
      ...saslConfig,
    })
  : null;

const producer = kafka ? kafka.producer() : null;
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

  try {
    await producer.connect();
    isConnected = true;
    console.log('[AUTH-KAFKA] Producer connected.');
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
