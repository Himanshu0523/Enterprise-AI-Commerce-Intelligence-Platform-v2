// 1. OpenTelemetry Tracing (MUST be very first require)
require('../../../../packages/tracing')('auth-service');

// 2. Load Environment Variables
require('dotenv').config();

// 3. Core Dependencies
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const { connectProducer } = require('./events/kafka');

// 4. Initialize Express App
const app = express();

// 5. Connect Database & Message Broker
connectDB();
connectProducer();

// 6. Global Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// 7. Health Check Endpoints (Always first for fast PaaS health probes)
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'auth-service' }));
app.get('/', (req, res) => res.status(200).json({ status: 'ok', message: 'Auth Service is active' }));

// 8. Application Domain Routes
app.use('/api/auth', require('./routes/auth.routes'));

// 9. Start Server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

// 10. Graceful Shutdown Handlers
process.on('SIGTERM', () => {
  console.log('[AUTH SERVICE] SIGTERM signal received: closing HTTP server');
  server.close(() => console.log('[AUTH SERVICE] HTTP server closed'));
});