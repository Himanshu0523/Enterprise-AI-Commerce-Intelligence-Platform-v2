const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, isDbConnected } = require('./config/db');
const { startKafkaConsumer, stopKafkaConsumer } = require('./events/kafkaConsumer');
const auditLogRoutes = require('./routes/auditLogRoutes');

const app = express();
const PORT = process.env.PORT || 3012;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Correlation ID & Request Context Middleware
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || `corr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
});

// Health check endpoint with diagnostic metrics
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'audit-log-service',
    port: PORT,
    database: isDbConnected() ? 'CONNECTED' : 'DISCONNECTED (In-Memory Fallback Active)',
    uptime: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    features: [
      'SHA-256 Tamper-Evident Hash Chaining',
      'Kafka Distributed Audit Streaming',
      'SOC-2 / PCI-DSS Compliance Export',
      'High-Speed Filtered Search & Pagination',
    ],
    timestamp: new Date().toISOString(),
  });
});

// Mount audit log API routes
app.use('/api/audit-logs', auditLogRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Endpoint ${req.originalUrl} not found on Audit Log Service` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[AuditLog] Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Start Database, Kafka, and HTTP Server
const startServer = async () => {
  await connectDB();
  startKafkaConsumer().catch((err) => console.warn('[AuditLog] Kafka init notice:', err.message));

  const server = app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(`🛡️  Audit Log Service running on http://localhost:${PORT}`);
    console.log(`📊 Health Endpoint: http://localhost:${PORT}/health`);
    console.log(`🔐 Compliance & Verification: http://localhost:${PORT}/api/audit-logs/verify-chain`);
    console.log(`========================================================`);
  });

  // Graceful Shutdown
  const gracefulShutdown = async (signal) => {
    console.log(`\n[AuditLog] Received ${signal}. Shutting down gracefully...`);
    await stopKafkaConsumer();
    server.close(() => {
      console.log('[AuditLog] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer();

module.exports = app;
