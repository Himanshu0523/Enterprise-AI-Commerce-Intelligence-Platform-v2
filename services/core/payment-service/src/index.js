// 1. OpenTelemetry Tracing (MUST be very first require)
require('../../../../packages/tracing')('payment-service');

// 2. Load Environment Variables
require('dotenv').config();

// 3. Core Dependencies
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const paymentRoutes = require('./routes/payment.routes');
const { chaosMiddleware, registerChaosRoutes } = require('../../../../packages/shared-utils/chaos');

// 4. Initialize Express App
const app = express();

// 5. Connect Database
connectDB();

// 6. Global Middlewares
app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));


// 7. Health Check Endpoints (Always first for fast PaaS health probes)
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'payment-service' }));
app.get('/', (req, res) => res.status(200).json({ status: 'ok', message: 'Payment Service is active' }));

// 8. Chaos Engineering Interceptors & Diagnostics
app.use(chaosMiddleware);
registerChaosRoutes(app, 'payment-service');

// 9. Application Domain Routes
app.use('/api/payments', paymentRoutes);

// 10. Start Server
const PORT = process.env.PORT || 3007;
const server = app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});

// 11. Graceful Shutdown Handlers
process.on('SIGTERM', () => {
  console.log('[PAYMENT SERVICE] SIGTERM signal received: closing HTTP server');
  server.close(() => console.log('[PAYMENT SERVICE] HTTP server closed'));
});
