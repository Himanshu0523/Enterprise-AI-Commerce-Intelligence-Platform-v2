const express = require('express');
const cors = require('cors');
const couponRoutes = require('./routes/coupon.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/coupons', couponRoutes);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'coupon-service' }));

module.exports = app;
