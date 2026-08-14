const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    category: { type: String, required: true, index: true },
    tags: [{ type: String }],
    images: [{ type: String }],
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    attributes: { type: Map, of: String },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
