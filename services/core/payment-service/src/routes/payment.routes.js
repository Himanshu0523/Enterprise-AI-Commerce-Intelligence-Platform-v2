const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');
const idempotencyMiddleware = require('../middleware/idempotency.middleware');

// Webhook does not need auth or idempotency
router.post('/webhook', paymentController.handleWebhook);

router.use(authMiddleware);

// /process is the only money-moving endpoint — enforce Redis idempotency here
router.post('/process', idempotencyMiddleware, paymentController.processPayment);

// Refunds are safe to call multiple times (idempotent by business logic)
router.post('/refund-by-order', paymentController.refundPaymentByOrderId);
router.get('/:id', paymentController.getPaymentById);
router.post('/:id/refund', paymentController.refundPayment);

module.exports = router;

