const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log('Kafka producer connected');
};

const publishEvent = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Event published to ${topic}`);
  } catch (err) {
    console.error(`Failed to publish event to ${topic}:`, err.message);
  }
};

module.exports = { connectProducer, publishEvent };