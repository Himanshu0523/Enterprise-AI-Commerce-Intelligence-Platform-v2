const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    orderNumber: { type: String, required: true, unique: true },
    idempotencyKey: { type: String, unique: true, index: true, sparse: true },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    orderStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'FRAUD_REVIEW_PENDING', 'FRAUD_CANCELLED_REFUNDED'],
      default: 'PENDING',
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    trackingNumber: { type: String },
    sagaState: {
      type: String,
      enum: ['IDLE', 'STOCK_RESERVING', 'STOCK_RESERVED', 'PAYING', 'PAID', 'COMPLETED', 'FAILED', 'COMPENSATING', 'COMPENSATED'],
      default: 'IDLE',
    },
    reconciliationTasks: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
