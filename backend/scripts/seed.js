require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Product = require('../src/models/product.model');

const products = [
  // FASHION
  {
    name: "Classic Denim Jacket",
    category: "Fashion",
    price: 89.99,
    stock: 45,
    description: "A timeless denim jacket featuring a relaxed fit, silver-tone hardware, and durable cotton blend. Perfect for layering.",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80",
    isNewProduct: true,
    isFeatured: true,
    isOnSale: false
  },
  {
    name: "Minimalist White Sneakers",
    category: "Fashion",
    price: 110.00,
    stock: 20,
    description: "Sleek and comfortable white leather sneakers with a low profile. Pairs effortlessly with jeans or a dress.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    isNewProduct: false,
    isFeatured: true,
    isOnSale: true
  },
  {
    name: "Oversized Cotton Hoodie",
    category: "Fashion",
    price: 55.00,
    stock: 120,
    description: "Ultra-soft 100% cotton hoodie in neutral beige. Features a kangaroo pocket and dropped shoulders.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    isNewProduct: true,
    isFeatured: false,
    isOnSale: false
  },
  {
    name: "Leather Crossbody Bag",
    category: "Accessories",
    price: 145.00,
    stock: 15,
    description: "Genuine leather crossbody bag with adjustable strap and multiple interior compartments. Elegant and functional.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    isNewProduct: false,
    isFeatured: false,
    isOnSale: false
  },
  // ELECTRONICS
  {
    name: "Noise-Cancelling Headphones Pro",
    category: "Electronics",
    price: 299.99,
    stock: 30,
    description: "Over-ear headphones featuring active noise cancellation, 30-hour battery life, and crystal-clear audio.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    isNewProduct: true,
    isFeatured: true,
    isOnSale: false
  },
  {
    name: "Ultra-Slim 4K Monitor",
    category: "Electronics",
    price: 450.00,
    stock: 0, // Out of stock to test inventory logic
    description: "27-inch 4K UHD monitor with HDR support and ultra-thin bezels. Ideal for creatives and gamers.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    isNewProduct: false,
    isFeatured: true,
    isOnSale: true
  },
  {
    name: "Mechanical Gaming Keyboard",
    category: "Electronics",
    price: 129.50,
    stock: 60,
    description: "RGB mechanical keyboard with tactile blue switches, customizable macros, and aluminum frame.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    isNewProduct: false,
    isFeatured: false,
    isOnSale: false
  },
  // HOME & LIVING
  {
    name: "Ceramic Coffee Mug Set",
    category: "Home",
    price: 34.99,
    stock: 85,
    description: "Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe with a beautiful matte glaze.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
    isNewProduct: true,
    isFeatured: false,
    isOnSale: false
  },
  {
    name: "Aromatherapy Essential Oil Diffuser",
    category: "Home",
    price: 42.00,
    stock: 40,
    description: "Ultrasonic diffuser with LED ambient lighting and auto-shutoff. Includes a set of 3 lavender oils.",
    image: "https://images.unsplash.com/photo-1608514144465-ce9bf27f2722?auto=format&fit=crop&w=800&q=80",
    isNewProduct: false,
    isFeatured: false,
    isOnSale: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Wiping existing products...');
    await Product.deleteMany({});
    
    console.log('Inserting seed products...');
    await Product.insertMany(products);
    
    console.log('Successfully seeded database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
