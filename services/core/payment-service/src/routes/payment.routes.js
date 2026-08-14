const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/webhook', paymentController.handleWebhook);

router.use(authMiddleware);
router.post('/process', paymentController.processPayment);
router.post('/refund-by-order', paymentController.refundPaymentByOrderId);
router.get('/:id', paymentController.getPaymentById);
router.post('/:id/refund', paymentController.refundPayment);

module.exports = router;
