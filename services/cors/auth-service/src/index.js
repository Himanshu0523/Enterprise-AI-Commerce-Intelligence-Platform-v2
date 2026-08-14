require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const { connectProducer } = require('./events/kafka');


const app = express();

// Connect to MongoDB
connectDB();
connectProducer();


// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});