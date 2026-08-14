const mongoose = require('mongoose');

let isConnected = false;
const onConnectCallbacks = [];

/**
 * Register a listener to be called when MongoDB connects or reconnects.
 * Used for syncing buffered in-memory logs into persistent MongoDB storage.
 *
 * @param {Function} callback
 */
const onDbConnect = (callback) => {
  if (typeof callback === 'function') {
    onConnectCallbacks.push(callback);
    if (isConnected) {
      try {
        callback();
      } catch (err) {
        console.error('[AuditLog-DB] Callback invocation error:', err.message);
      }
    }
  }
};

const notifyConnectCallbacks = () => {
  for (const cb of onConnectCallbacks) {
    try {
      cb();
    } catch (err) {
      console.error('[AuditLog-DB] onConnect callback error:', err.message);
    }
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-audit-logs';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[AuditLog-DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    notifyConnectCallbacks();
  } catch (error) {
    isConnected = false;
    console.warn(`[AuditLog-DB] MongoDB connection warning: ${error.message}. Running with memory fallback until DB is available.`);
  }

  mongoose.connection.on('connected', () => {
    const wasDisconnected = !isConnected;
    isConnected = true;
    console.log('[AuditLog-DB] MongoDB connection established');
    if (wasDisconnected) {
      notifyConnectCallbacks();
    }
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[AuditLog-DB] MongoDB connection lost');
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.error(`[AuditLog-DB] MongoDB error: ${err.message}`);
  });
};

const isDbConnected = () => isConnected;

module.exports = { connectDB, isDbConnected, onDbConnect };
