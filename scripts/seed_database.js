/**
 * Master Seed Script for E-commerce Microservices Database
 * Populates sample products, categories, coupons, inventory stock, and demo users.
 */
const mongoose = require('mongoose');

const MONGO_BASE_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';

async function seedProducts() {
  const conn = await mongoose.createConnection(`${MONGO_BASE_URI}/ecommerce-products`).asPromise();
  console.log('Seeding Product DB...');
  const Product = conn.model('Product', new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    sku: String,
    rating: Number,
    numReviews: Number
  }));

  try {
    await Product.collection.drop();
  } catch (err) {
    // Ignore error if collection doesn't exist
  }
  await Product.insertMany([
    { name: 'Wireless Noise-Canceling Headphones', slug: 'wireless-noise-canceling-headphones', description: 'High fidelity audio with ANC', price: 199.99, category: 'Electronics', stock: 50, sku: 'AUDIO-ANC-01', rating: 4.8, numReviews: 24 },
    { name: 'Ergonomic Mechanical Keyboard', slug: 'ergonomic-mechanical-keyboard', description: 'RGB hot-swappable switches', price: 129.50, category: 'Electronics', stock: 35, sku: 'KB-MECH-02', rating: 4.6, numReviews: 18 },
    { name: 'Ultra-Soft Cotton Hoodie', slug: 'ultra-soft-cotton-hoodie', description: 'Premium heavyweight fleece hoodie', price: 59.99, category: 'Apparel', stock: 100, sku: 'APP-HOODIE-03', rating: 4.9, numReviews: 42 },
    { name: 'Smart Fitness Watch', slug: 'smart-fitness-watch', description: 'Heart rate monitor with GPS tracking', price: 149.00, category: 'Electronics', stock: 20, sku: 'SMART-WATCH-04', rating: 4.5, numReviews: 15 }
  ]);
  console.log('Products seeded.');
  await conn.close();
}

async function seedCoupons() {
  const conn = await mongoose.createConnection(`${MONGO_BASE_URI}/ecommerce-coupons`).asPromise();
  console.log('Seeding Coupon DB...');
  const Coupon = conn.model('Coupon', new mongoose.Schema({
    code: String,
    discountType: String,
    discountValue: Number,
    minOrderAmount: Number,
    expiryDate: Date,
    isActive: Boolean
  }));

  try {
    await Coupon.collection.drop();
  } catch (err) {
    // Ignore error if collection doesn't exist
  }
  await Coupon.insertMany([
    { code: 'WELCOME10', discountType: 'PERCENTAGE', discountValue: 10, minOrderAmount: 30, expiryDate: new Date('2030-01-01'), isActive: true },
    { code: 'FLAT20', discountType: 'FIXED', discountValue: 20, minOrderAmount: 100, expiryDate: new Date('2030-01-01'), isActive: true },
    { code: 'FREESHIP', discountType: 'FIXED', discountValue: 5.99, minOrderAmount: 50, expiryDate: new Date('2030-01-01'), isActive: true }
  ]);
  console.log('Coupons seeded.');
  await conn.close();
}

async function seedAll() {
  try {
    await seedProducts();
    await seedCoupons();
    console.log('🎉 All Databases successfully seeded with initial test data!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedAll();
