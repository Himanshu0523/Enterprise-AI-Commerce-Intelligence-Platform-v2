const mongoose = require("mongoose");
const Product = require("../models/product.model");
const ActivityLog = require("../models/activityLog.model");
const User = require("../models/user.model");

/*
GET /api/products
Get all products (active only)
*/
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: { $ne: false } });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
GET /api/products/:id
Get product by ID (active only)
*/
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: { $ne: false } });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
POST /api/products
Create new product
*/
exports.createProduct = async (req, res) => {
  try {
    // Role-based seller assignment
    let sellerId = req.user._id;
    let sellerName = req.user.name;

    // Superadmin can create products on behalf of other sellers
    if (req.user.role === "superadmin" && req.body.seller) {
      sellerId = req.body.seller;
      const targetUser = await User.findById(sellerId);
      if (targetUser) {
        sellerName = targetUser.name;
      }
    }

    const productData = {
      ...req.body,
      seller: sellerId,
      createdBy: req.user._id,
      sellerName
    };

    const product = await Product.create(productData);

    // Audit log
    await ActivityLog.create({
      user: req.user._id,
      action: "PRODUCT_CREATED",
      details: { productId: product._id, name: product.name },
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
PUT /api/products/:id
Update product (via ownership middleware preloaded req.product)
*/
exports.updateProduct = async (req, res) => {
  try {
    const product = req.product; // loaded from ownership middleware
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product context not found"
      });
    }

    const fields = [
      "name", "category", "price", "discountPrice", "stock",
      "description", "specifications", "images", "isNewProduct",
      "isFeatured", "isOnSale", "sku", "slug", "isActive"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Superadmin can modify seller
    if (req.user.role === "superadmin" && req.body.seller !== undefined) {
      product.seller = req.body.seller;
      const targetUser = await User.findById(req.body.seller);
      if (targetUser) {
        product.sellerName = targetUser.name;
      }
    }

    product.updatedBy = req.user._id;
    await product.save();

    // Audit log
    await ActivityLog.create({
      user: req.user._id,
      action: "PRODUCT_UPDATED",
      details: { productId: product._id, name: product.name },
      timestamp: new Date()
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
DELETE /api/products/:id
Delete product (soft-delete, via ownership middleware preloaded req.product)
*/
exports.deleteProduct = async (req, res) => {
  try {
    const product = req.product; // loaded from ownership middleware
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product context not found"
      });
    }

    // Perform soft-delete
    product.isActive = false;
    product.updatedBy = req.user._id;
    await product.save();

    // Audit log
    await ActivityLog.create({
      user: req.user._id,
      action: "PRODUCT_DELETED",
      details: { productId: product._id, name: product.name },
      timestamp: new Date()
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
GET /api/search?q=shirt&category=men&isNew=true
Search products across name, category, description (active only)
*/
exports.searchProducts = async (req, res) => {
  try {
    const { q = "", category, isNew, isFeatured, isOnSale } = req.query;

    const query = { isActive: { $ne: false } };

    // Multi-field text search
    if (q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      query.$or = [
        { name: regex },
        { category: regex },
        { description: regex }
      ];
    }

    // Optional exact filters
    if (category) query.category = new RegExp(category, "i");
    if (isNew === "true") query.isNew = true;
    if (isFeatured === "true") query.isFeatured = true;
    if (isOnSale === "true") query.isOnSale = true;

    const products = await Product.find(query).limit(50);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
GET /api/products/my-products
Get products owned by the logged-in admin (or filtered by sellerId for superadmin)
*/
exports.getMyProducts = async (req, res) => {
  try {
    let query = { isActive: { $ne: false } };
    
    if (req.user.role !== "superadmin" || req.query.sellerId) {
      query.seller = req.query.sellerId || req.user._id;
    }

    const products = await Product.find(query);
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
GET /api/products/my-stats
Aggregate statistical metrics for the logged-in seller
*/
exports.getMyStats = async (req, res) => {
  try {
    let matchQuery = { isActive: { $ne: false } };

    if (req.user.role !== "superadmin" || req.query.sellerId) {
      const sellerId = req.query.sellerId || req.user._id;
      matchQuery.seller = new mongoose.Types.ObjectId(sellerId);
    }

    const stats = await Product.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStockValue: { $sum: { $multiply: ["$price", "$stock"] } },
          lowStockCount: {
            $sum: {
              $cond: [{ $lte: ["$stock", 5] }, 1, 0]
            }
          },
          outOfStockCount: {
            $sum: {
              $cond: [{ $eq: ["$stock", 0] }, 1, 0]
            }
          },
          categories: { $addToSet: "$category" }
        }
      }
    ]);

    const categoryBreakdown = await Product.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const result = stats[0] || {
      totalProducts: 0,
      totalStockValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      categories: []
    };

    res.status(200).json({
      success: true,
      data: {
        totalProducts: result.totalProducts,
        totalStockValue: result.totalStockValue,
        lowStockCount: result.lowStockCount,
        outOfStockCount: result.outOfStockCount,
        uniqueCategoriesCount: result.categories.length,
        categoryBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};