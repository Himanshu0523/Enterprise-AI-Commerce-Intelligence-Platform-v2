const { Kafka } = require('kafkajs');

// Build SASL config only when Confluent Cloud credentials are provided
const saslConfig = process.env.KAFKA_SASL_USERNAME
  ? {
      ssl: true,
      sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD,
      },
    }
  : {};

const kafka = new Kafka({
    clientId: 'auth-service',
    brokers: (process.env.KAFKA_BOOTSTRAP_SERVERS || process.env.KAFKA_BROKER || 'localhost:9092').split(','),
    ...saslConfig,
});


const producer = kafka.producer();

let isConnected = false;

const connectProducer = async () => {
    try {
        await producer.connect();
        isConnected = true;
        console.log('Kafka producer connected');
    } catch (err) {
        console.warn('Kafka connection failed - running service without Kafka event streaming:', err.message);
    }
};

const publishEvent = async (topic, event) => {
    if (!isConnected) {
        console.log(`[Offline Event Log] ${topic}:`, event);
        return;
    }
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(event) }],
        });
        console.log(`Event published to ${topic}`);
    } catch (err) {
        console.error('Kafka publish error:', err.message);
    }
};

module.exports = { connectProducer , publishEvent };