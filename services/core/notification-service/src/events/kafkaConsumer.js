const { Kafka } = require('kafkajs');
const Notification = require('../models/Notification');

let kafkaConsumer = null;

const startKafkaConsumer = async () => {
  const brokers = (process.env.KAFKA_BOOTSTRAP_SERVERS || process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
  const clientId = process.env.KAFKA_CLIENT_ID || 'notification-service';
  const groupId = process.env.KAFKA_GROUP_ID || 'notification-group';

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
    const kafka = new Kafka({ clientId, brokers, ...saslConfig, retry: { initialRetryTime: 300, retries: 3 } });
    kafkaConsumer = kafka.consumer({ groupId });
    await kafkaConsumer.connect();
    
    // Subscribe to topics where notifications might originate
    await kafkaConsumer.subscribe({ topic: 'user-events', fromBeginning: false });
    await kafkaConsumer.subscribe({ topic: 'order-events', fromBeginning: false });
    
    console.log(`[Notification-Kafka] Subscribed to topics: user-events, order-events`);

    await kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const rawValue = message.value.toString();
          const event = JSON.parse(rawValue);
          
          const eventType = event.type || event.action || 'UNKNOWN';
          console.log(`[Notification-Kafka] Received event from ${topic}:`, eventType);
          
          let notificationData = null;
          
          if (eventType === 'UserRegistered' || eventType === 'USER_REGISTERED') {
            notificationData = {
              recipient: event.email || event.user?.email || 'unknown@example.com',
              channel: 'email',
              subject: 'Welcome to our E-commerce platform!',
              body: `Hi there, your account has been successfully created.`,
              status: 'SENT',
              eventType: eventType
            };
          } else if (eventType === 'OrderPlaced' || eventType === 'ORDER_PLACED') {
            notificationData = {
              recipient: event.email || event.user?.email || 'customer@example.com',
              channel: 'email',
              subject: 'Order Confirmation',
              body: `Your order ${event.orderId || ''} has been placed successfully.`,
              status: 'SENT',
              eventType: eventType
            };
          } else if (eventType === 'PaymentSuccess' || eventType === 'PAYMENT_SUCCESS') {
            notificationData = {
              recipient: event.email || event.user?.email || 'customer@example.com',
              channel: 'email',
              subject: 'Payment Successful',
              body: `Your payment for order ${event.orderId || ''} was successful.`,
              status: 'SENT',
              eventType: eventType
            };
          }
          
          if (notificationData) {
            const newNotif = new Notification(notificationData);
            await newNotif.save();
            console.log(`[Notification-Kafka] Saved notification for ${notificationData.recipient}`);
          }
          
        } catch (err) {
          console.error('[Notification-Kafka] Error processing message:', err.message);
        }
      },
    });
  } catch (error) {
    console.warn(`[Notification-Kafka] Kafka connection skipped or unavailable: ${error.message}`);
  }
};

const stopKafkaConsumer = async () => {
  if (kafkaConsumer) {
    try {
      await kafkaConsumer.disconnect();
      console.log('[Notification-Kafka] Consumer disconnected');
    } catch (err) {
      console.error('[Notification-Kafka] Error disconnecting consumer:', err.message);
    }
  }
};

module.exports = { startKafkaConsumer, stopKafkaConsumer };
