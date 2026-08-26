const express = require('express');
const helmet = require('helmet');
const corsMiddleware = require('./middleware/cors');
const loggerMiddleware = require('./middleware/logger');
const { standardLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const { metricsMiddleware, getMetrics } = require('./middleware/metrics');
const routes = require('./routes');

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Request logging & W3C correlation ID tracing
app.use(loggerMiddleware);

// Prometheus metrics collection middleware
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'api-gateway', timestamp: new Date().toISOString() }));

// Prometheus Metrics endpoint
app.get('/metrics', getMetrics);

// Global rate limit
app.use(standardLimiter);

// Body parsing
app.use(express.json());

// Mount all proxy routes
app.use('/api', routes);

// 404 handler for unmatched gateway routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Global Error handling (must be last)
app.use(errorHandler);

module.exports = app;