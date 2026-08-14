const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validators');
const Joi = require('joi');

// All routes authenticated
router.use(auth);

// Profile
router.get('/me', ctrl.getMe);
router.put('/me', validate(require('../validators/updateMe')), ctrl.updateMe);

// Storefront
router.get('/me/storefront/:storeId/profile', ctrl.getStorefrontProfile);
router.put('/me/storefront/:storeId/profile', ctrl.updateStorefrontProfile);

// Role
router.patch('/me/role', validate(require('../validators/switchRole')), ctrl.switchRole);
router.put('/me/business-profile', ctrl.updateBusinessProfile);

// Security (read-only)
router.get('/me/security', ctrl.getSecurityProfile);

// Addresses
router.get('/me/addresses', ctrl.getAddresses);
router.post('/me/addresses', validate(require('../validators/address')), ctrl.addAddress);
router.put('/me/addresses/:id', validate(require('../validators/address')), ctrl.updateAddress);
router.delete('/me/addresses/:id', ctrl.deleteAddress);

// Wishlist
router.get('/me/wishlist', ctrl.getWishlist);
router.post('/me/wishlist', validate(require('../validators/wishlist')), ctrl.addToWishlist);
router.delete('/me/wishlist/:productId', ctrl.removeFromWishlist);

// Payment methods (display)
router.get('/me/payment-methods', ctrl.getPaymentMethods);

// Cart bindings
router.patch('/me/cart-bindings', ctrl.updateCartBindings);

module.exports = router;