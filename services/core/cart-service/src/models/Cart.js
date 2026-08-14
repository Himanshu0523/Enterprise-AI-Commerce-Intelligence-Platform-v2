const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  image: { type: String },
  variantId: { type: String },
});

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.methods.calculateTotal = function () {
  this.totalAmount = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  return this.totalAmount;
};

module.exports = mongoose.model('Cart', cartSchema);
