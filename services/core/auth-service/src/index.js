// Load Render-provided environment variables before initializing optional tracing.
require('dotenv').config();
require('../../../../packages/tracing')('auth-service');

const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const { connectProducer } = require('./events/kafka');

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get('/health', (req, res) => {
  const dbReady = require('mongoose').connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? 'ok' : 'not_ready',
    service: 'auth-service',
    dependencies: { mongodb: dbReady ? 'connected' : 'disconnected' },
  });
});
app.get('/', (req, res) => res.status(200).json({ status: 'ok', message: 'Auth Service is active' }));

app.use('/api/auth', require('./routes/auth.routes'));

const PORT = process.env.PORT || 3001;
let server;

async function start() {
  // MongoDB is required for authentication; do not report healthy without it.
  await connectDB();

  // Kafka is an optional event transport and must not prevent auth startup.
  await connectProducer();

  server = app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error('[AUTH-STARTUP] Startup aborted:', error.message);
  process.exit(1);
});

async function shutdown(signal) {
  console.log(`[AUTH-SERVICE] ${signal} received; shutting down.`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  try {
    await require('mongoose').disconnect();
  } finally {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
