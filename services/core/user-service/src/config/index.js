require('dotenv').config();

module.exports = {
  port: process.env.USER_SERVICE_PORT || 3002,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/user-service',
  kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  kafkaClientId: 'user-service',
  kafkaConsumerGroup: 'user-service-group',
  authServiceEventTopic: 'auth-events',   // topic where auth-service publishes
};