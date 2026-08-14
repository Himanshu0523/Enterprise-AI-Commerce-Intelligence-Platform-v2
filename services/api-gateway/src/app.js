const express = require('express');
const helmet = require('helmet');
const corsMiddleware = require('./middleware/cors');
const loggerMiddleware = require('./middleware/logger');
const { standardLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Request logging
app.use(loggerMiddleware);

// Global rate limit (can be overridden per route)
app.use(standardLimiter);

// Body parsing (optional, only if gateway needs to read body)
app.use(express.json());

// Mount all proxy routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Error handling (must be last)
app.use(errorHandler);

module.exports = app;