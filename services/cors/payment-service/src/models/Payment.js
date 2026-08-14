const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    paymentProvider: { type: String, enum: ['STRIPE', 'PAYPAL', 'MOCK'], default: 'MOCK' },
    transactionId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    paymentMethodDetails: {
      cardLast4: String,
      brand: String,
    },
    refundReason: String,
  },
  { timestamps: true }
);

// Enforce database-level uniqueness constraint: only one COMPLETED payment per orderId
paymentSchema.index(
  { orderId: 1 },
  { 
    unique: true, 
    partialFilterExpression: { status: 'COMPLETED' } 
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
