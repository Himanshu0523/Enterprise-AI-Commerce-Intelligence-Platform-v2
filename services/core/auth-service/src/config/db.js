const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGO_URI is required. Configure the auth-service MongoDB connection in Render.');
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`[AUTH-DB] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('[AUTH-DB] MongoDB connection failed:', err.message);
    throw err;
  }
};

module.exports = connectDB;
