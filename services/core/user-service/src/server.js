const app = require('./app');
const config = require('./config');
const connectDB = require('./db/connection');
const startConsumer = require('./events/consumer');

async function start() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`User service running on port ${config.port}`);
  });
  // Start Kafka consumer (non-blocking)
  try {
    await startConsumer();
    console.log('Kafka consumer started');
  } catch (err) {
    console.warn('Kafka consumer not available, profiles will be created via API fallback');
  }
}

start();