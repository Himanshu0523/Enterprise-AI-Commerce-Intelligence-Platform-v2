const Product = require("../models/product.model");

/*
GET /api/products
Get all products
*/
exports.getProducts = async (req , res) => {
    try {
        const products = await Product.find();
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
Get product by ID
*/
exports.getProductById = async (req , res) => {
    try{
        const product = await Product.findById(req.params.id);

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
    }catch(error){
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
exports.createProduct = async (req , res) => {
  try {

    const product = await Product.create(req.body);

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
Update product
*/
exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

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
GET /api/search?q=shirt&category=men&isNew=true
Search products across name, category, description
*/
exports.searchProducts = async (req, res) => {
  try {
    const { q = "", category, isNew, isFeatured, isOnSale } = req.query;

    const query = {};

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
DELETE /api/products/:id
Delete product
*/
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

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