const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/register', authenticate, sellerController.registerSeller);

module.exports = router;
