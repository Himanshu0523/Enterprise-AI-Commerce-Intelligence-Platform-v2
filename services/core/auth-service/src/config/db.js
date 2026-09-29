const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service';
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[AUTH-DB] MongoDB Connection Warning: ${err.message}. Running service without blocking.`);
  }
};

module.exports = connectDB;