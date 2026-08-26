const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  channel: { type: String, enum: ['email', 'sms', 'push'], default: 'email' },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
  eventType: { type: String },
  error: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
