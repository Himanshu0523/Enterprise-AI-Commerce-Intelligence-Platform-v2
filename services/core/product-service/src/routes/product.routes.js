const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Category routes
router.get('/categories', productController.getCategories);
router.post('/categories', productController.createCategory);

// Product routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
