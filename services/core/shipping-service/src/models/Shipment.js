const mongoose = require('mongoose');

const trackingEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const shipmentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    carrier: { type: String, enum: ['FEDEX', 'UPS', 'DHL', 'USPS', 'STANDARD'], default: 'STANDARD' },
    trackingNumber: { type: String, required: true, unique: true, index: true },
    shippingAddress: {
      fullName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    status: {
      type: String,
      enum: ['LABEL_CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED'],
      default: 'LABEL_CREATED',
    },
    estimatedDeliveryDate: { type: Date },
    trackingHistory: [trackingEventSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shipment', shipmentSchema);
