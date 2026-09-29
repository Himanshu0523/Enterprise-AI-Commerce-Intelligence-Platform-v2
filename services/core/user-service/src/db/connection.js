const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('[USER-DB] MongoDB connection warning:', err.message, '- service running in in-memory/fallback mode');
  }
};

module.exports = connectDB;