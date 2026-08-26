const { Kafka } = require('kafkajs');
const { recordAuditLogInternal } = require('../controllers/auditLogController');

let kafkaConsumer = null;

const startKafkaConsumer = async () => {
  const brokers = (process.env.KAFKA_BOOTSTRAP_SERVERS || process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
  const clientId = process.env.KAFKA_CLIENT_ID || 'audit-log-service';
  const groupId = process.env.KAFKA_GROUP_ID || 'audit-log-group';
  const topic = process.env.KAFKA_TOPIC || 'audit-logs';

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

  try {
    const kafka = new Kafka({
      clientId,
      brokers,
      ...saslConfig,
      retry: {
        initialRetryTime: 300,
        retries: 3,
      },
    });

    kafkaConsumer = kafka.consumer({ groupId });
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic, fromBeginning: false });

    console.log(`[AuditLog-Kafka] Subscribed to topic: ${topic}`);

    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const rawValue = message.value.toString();
          const event = JSON.parse(rawValue);

          console.log(`[AuditLog-Kafka] Ingested audit event from ${topic}:`, event.action || event.type);

          const auditData = {
            actor: event.actor || { id: event.userId || 'SYSTEM', type: 'SERVICE' },
            action: (event.action || event.type || 'UNKNOWN_EVENT').toUpperCase(),
            category: (event.category || 'SYSTEM').toUpperCase(),
            severity: (event.severity || 'INFO').toUpperCase(),
            targetResource: event.targetResource || {
              resourceType: event.resourceType || 'GLOBAL',
              resourceId: event.resourceId || event.orderId || event.productId || null,
            },
            details: event.details || event.payload || {},
            status: (event.status || 'SUCCESS').toUpperCase(),
            correlationId: event.correlationId || null,
            clientInfo: {
              serviceName: event.serviceName || 'kafka-stream',
            },
          };

          await recordAuditLogInternal(auditData);
        } catch (err) {
          console.error('[AuditLog-Kafka] Error processing message:', err.message);
        }
      },
    });
  } catch (error) {
    console.warn(`[AuditLog-Kafka] Kafka connection skipped or unavailable: ${error.message}`);
  }
};

const stopKafkaConsumer = async () => {
  if (kafkaConsumer) {
    try {
      await kafkaConsumer.disconnect();
      console.log('[AuditLog-Kafka] Consumer disconnected');
    } catch (err) {
      console.error('[AuditLog-Kafka] Error disconnecting consumer:', err.message);
    }
  }
};

module.exports = { startKafkaConsumer, stopKafkaConsumer };
