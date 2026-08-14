require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const reviewRoutes = require('./routes/review.routes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/reviews', reviewRoutes);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'review-service' }));

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`Review service running on port ${PORT}`));
