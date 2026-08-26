require('dotenv').config();

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

module.exports = {
  port: process.env.USER_SERVICE_PORT || 3002,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/user-service',
  kafkaBrokers: (process.env.KAFKA_BOOTSTRAP_SERVERS || process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  kafkaSaslConfig: saslConfig,
  kafkaClientId: 'user-service',
  kafkaConsumerGroup: 'user-service-group',
  authServiceEventTopic: 'auth-events',   // topic where auth-service publishes
};