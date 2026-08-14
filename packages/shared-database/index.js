const mongoose = require('mongoose');

const defaultMongoOptions = {
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
};

const createMongoConnection = async (uri) => {
  try {
    const conn = await mongoose.connect(uri, defaultMongoOptions);
    console.log(`Connected to MongoDB database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = { defaultMongoOptions, createMongoConnection };
