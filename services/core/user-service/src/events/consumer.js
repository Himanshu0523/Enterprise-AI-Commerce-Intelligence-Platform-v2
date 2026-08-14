const { Kafka } = require('kafkajs');
const config = require('../config');
const UserProfile = require('../models/UserProfile');

const kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: config.kafkaConsumerGroup });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: config.authServiceEventTopic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        switch (event.type) {
          case 'UserCreated':
            await handleUserCreated(event.payload);
            break;
          case 'UserVerified':
            // Optionally update emailVerified flag
            break;
          default:
            // ignore
        }
      } catch (err) {
        console.error('Error processing event', err);
      }
    },
  });
};

async function handleUserCreated({ userId, email }) {
  // upsert profile
  await UserProfile.findOneAndUpdate(
    { userId },
    { userId, email, displayName: email.split('@')[0] },
    { upsert: true, new: true }
  );
  console.log(`Profile created/updated for ${userId}`);
}

module.exports = run;