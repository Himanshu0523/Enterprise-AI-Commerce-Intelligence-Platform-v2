require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const paymentRoutes = require('./routes/payment.routes');

const { chaosMiddleware, registerChaosRoutes } = require('../../../packages/shared-utils/chaos');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Inject chaos middleware to intercept incoming requests
app.use(chaosMiddleware);

registerChaosRoutes(app, 'payment-service');

app.use('/api/payments', paymentRoutes);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'payment-service' }));

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`Payment service running on port ${PORT}`));
