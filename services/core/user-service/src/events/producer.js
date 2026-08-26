const { Kafka } = require('kafkajs');
const config = require('../config');
const kafka = new Kafka({ clientId: config.kafkaClientId, brokers: config.kafkaBrokers, ...config.kafkaSaslConfig });
const producer = kafka.producer();

let connected = false;
const getProducer = async () => {
  if (!connected) {
    await producer.connect();
    connected = true;
  }
  return producer;
};

const publishEvent = async (topic, event) => {
  const prod = await getProducer();
  await prod.send({
    topic,
    messages: [{ value: JSON.stringify(event) }],
  });
};

module.exports = { publishEvent };