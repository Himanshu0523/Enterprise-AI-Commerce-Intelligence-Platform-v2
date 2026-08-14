require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product.routes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'product-service' }));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Product service running on port ${PORT}`));
