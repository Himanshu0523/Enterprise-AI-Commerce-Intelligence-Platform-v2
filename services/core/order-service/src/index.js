// 1. OpenTelemetry Tracing (MUST be very first require)
require('../../../../packages/tracing')('order-service');

// 2. Load Environment Variables
require('dotenv').config();

// 3. Core Dependencies
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/order.routes');
const { chaosMiddleware, registerChaosRoutes } = require('../../../../packages/shared-utils/chaos');

// 4. Initialize Express App
const app = express();

// 5. Connect Database
connectDB();

// 6. Global Middlewares
app.use(cors());
app.use(express.json());

// 7. Health Check Endpoints (Always first before route middleware for fast PaaS health probes)
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'order-service' }));
app.get('/', (req, res) => res.status(200).json({ status: 'ok', message: 'Order Service is active' }));

// 8. Chaos Engineering Interceptors & Diagnostics
app.use(chaosMiddleware);
registerChaosRoutes(app, 'order-service');

// 9. Application Domain Routes
app.use('/api/orders', orderRoutes);

// 10. Start Server
const PORT = process.env.PORT || 3006;
const server = app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});

// 11. Graceful Shutdown Handlers
process.on('SIGTERM', () => {
  console.log('[ORDER SERVICE] SIGTERM signal received: closing HTTP server');
  server.close(() => console.log('[ORDER SERVICE] HTTP server closed'));
});
