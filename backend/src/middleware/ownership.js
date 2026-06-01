const Product = require('../models/product.model');
const ActivityLog = require('../models/activityLog.model');

/**
 * Ownership middleware for product routes.
 * Loads the product by ID, checks if the requesting user is the seller
 * or a superadmin. Logs violation attempts.
 */
module.exports = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID missing in params' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Attach product to request for downstream handlers
    req.product = product;

    // Superadmin bypasses ownership checks
    if (req.user && req.user.role === 'superadmin') {
      return next();
    }

    // Verify ownership
    if (product.seller && product.seller.toString() === req.user._id.toString()) {
      return next();
    }

    // Log ownership violation attempt
    await ActivityLog.create({
      user: req.user._id,
      action: 'OWNERSHIP_VIOLATION_ATTEMPT',
      details: { productId, attemptedBy: req.user._id },
      timestamp: new Date()
    });

    return res.status(403).json({ message: 'Forbidden: you do not own this product' });
  } catch (err) {
    next(err);
  }
};
