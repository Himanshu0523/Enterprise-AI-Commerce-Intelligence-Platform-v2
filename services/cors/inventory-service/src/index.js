require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const inventoryRoutes = require('./routes/inventory.routes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/inventory', inventoryRoutes);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'inventory-service' }));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Inventory service running on port ${PORT}`));
