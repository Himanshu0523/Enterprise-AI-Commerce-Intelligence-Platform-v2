const mongoose = require ('mongoose');

const addressSchema = new mongoose.Schema (
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    isDefault: {type: Boolean, default: false},
    type: {
      type: String,
      enum: ['shipping', 'billing'],
      default: 'shipping',
    },
    storefrontId: {type: String, default: null}, 
  },
  {timestamps: true}
);

module.exports = mongoose.model ('Address', addressSchema);
