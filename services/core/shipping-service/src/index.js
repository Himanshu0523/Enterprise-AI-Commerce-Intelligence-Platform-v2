require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const shippingRoutes = require('./routes/shipping.routes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/shipping', shippingRoutes);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'shipping-service' }));

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => console.log(`Shipping service running on port ${PORT}`));
