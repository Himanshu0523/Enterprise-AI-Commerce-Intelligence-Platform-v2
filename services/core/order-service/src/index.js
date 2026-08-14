require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/order.routes');

const { chaosMiddleware, registerChaosRoutes } = require('../../../packages/shared-utils/chaos');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Inject chaos middleware to intercept incoming requests
app.use(chaosMiddleware);

registerChaosRoutes(app, 'order-service');

app.use('/api/orders', orderRoutes);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'order-service' }));

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
