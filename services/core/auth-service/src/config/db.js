const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('[AUTH-DB] MONGO_URI is missing. Set the real MongoDB Atlas connection string in Render.');
  }

  if (uri.includes('cluster.net') || uri.includes('<') || uri.includes('>')) {
    throw new Error('[AUTH-DB] MONGO_URI still contains a placeholder hostname/value. Copy the real URI from MongoDB Atlas → Connect → Drivers.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log(`[AUTH-DB] Connected to MongoDB host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('[AUTH-DB] MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;
