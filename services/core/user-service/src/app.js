const express = require('express');
const cors = require('cors');
const userRoutes = require('./api/routes/user.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/v1/users', userRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));

module.exports = app;