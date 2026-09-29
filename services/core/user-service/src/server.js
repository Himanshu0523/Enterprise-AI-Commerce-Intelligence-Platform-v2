// OpenTelemetry: MUST be first require  
require('../../../../packages/tracing')('user-service');

const app = require('./app');
const config = require('./config');
const connectDB = require('./db/connection');
const startConsumer = require('./events/consumer');

async function start() {
  app.listen(config.port, () => {
    console.log(`User service running on port ${config.port}`);
  });

  // Connect MongoDB gracefully (non-blocking)
  try {
    await connectDB();
  } catch (err) {
    console.warn('[USER-SERVICE] DB Connection Warning:', err.message);
  }

  // Start Kafka consumer (non-blocking)
  try {
    await startConsumer();
    console.log('Kafka consumer started');
  } catch (err) {
    console.warn('Kafka consumer not available, profiles will be created via API fallback');
  }
}

start();