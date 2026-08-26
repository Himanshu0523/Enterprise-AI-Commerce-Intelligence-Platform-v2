const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');
const { startKafkaConsumer, stopKafkaConsumer } = require('./events/kafkaConsumer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3011;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'notification-service', port: PORT });
});

app.post('/api/notifications/send', (req, res) => {
  const { recipient, channel = 'email', subject, body } = req.body;
  if (!recipient || !body) {
    return res.status(400).json({ success: false, error: 'Recipient and body are required' });
  }

  console.log(`[NOTIFICATION] Dispatching ${channel} to ${recipient}: "${subject || 'Notification'}"`);
  res.status(200).json({
    success: true,
    notificationId: `notif_${Date.now()}`,
    channel,
    recipient,
    status: 'DELIVERED',
  });
});

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start Kafka Consumer
  await startKafkaConsumer();

  const server = app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('[Notification-Service] Shutting down gracefully...');
    await stopKafkaConsumer();
    server.close(() => {
      console.log('[Notification-Service] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
