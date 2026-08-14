const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, index: true },
    productId: { type: String, required: true, index: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    reserved: { type: Number, required: true, min: 0, default: 0 },
    warehouseLocation: { type: String, default: 'Main Warehouse' },
    reorderLevel: { type: Number, default: 10 },
  },
  { timestamps: true }
);

inventorySchema.virtual('available').get(function () {
  return this.quantity - this.reserved;
});

inventorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Inventory', inventorySchema);
