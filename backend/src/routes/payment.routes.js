const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate); // Ensure all payment routes are protected

router.post('/create-order', paymentController.createRazorpayOrder);
router.post('/verify-payment', paymentController.verifyRazorpayPayment);

module.exports = router;
