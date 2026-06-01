const mongoose = require("mongoose");

// Extended Product Schema for multi‑admin ownership
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    description: { type: String },
    specifications: { type: Map, of: String },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isNewProduct: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },

    // Ownership & audit fields
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sellerName: { type: String }, // denormalized for quick lookup
    isActive: { type: Boolean, default: true },
    sku: { type: String, unique: true, sparse: true },
    slug: { type: String, unique: true, sparse: true }
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false
  }
);

// Compound indexes for efficient per‑seller queries
productSchema.index({ seller: 1, createdAt: -1 });
productSchema.index({ seller: 1, isActive: 1 });
productSchema.index({ seller: 1, category: 1 });

module.exports = mongoose.model("Product", productSchema);