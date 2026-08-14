const Payment = require('../models/Payment');
const { createErrorResponse, ErrorCodes } = require('../../../../../packages/shared-utils');

exports.processPayment = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'usr_guest';
    const { orderId, amount, currency = 'USD', paymentProvider = 'MOCK', paymentMethodDetails } = req.body;

    // Strict input validation
    if (!orderId || typeof orderId !== 'string') {
      return createErrorResponse(res, 400, ErrorCodes.VALIDATION_FAILED, 'Valid orderId string is required');
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return createErrorResponse(res, 400, ErrorCodes.VALIDATION_FAILED, 'Amount must be a positive number');
    }

    // Idempotency check: verify if payment already exists for this orderId
    const existingPayment = await Payment.findOne({ orderId, status: 'COMPLETED' });
    if (existingPayment) {
      console.log(`[PAYMENT] Idempotency hit: Returning existing completed payment for orderId ${orderId}`);
      return res.status(200).json({ success: true, data: existingPayment, idempotencyHit: true });
    }

    const transactionId = 'TXN-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);

    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      currency,
      paymentProvider,
      transactionId,
      status: 'COMPLETED',
      paymentMethodDetails: paymentMethodDetails || { cardLast4: '4242', brand: 'Visa' },
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    if (error.code === 11000) {
      console.log(`[PAYMENT] Duplicate key hit (11000): Returning existing completed payment for orderId`);
      const existing = await Payment.findOne({ orderId: req.body.orderId, status: 'COMPLETED' });
      if (existing) {
        return res.status(200).json({ success: true, data: existing, idempotencyHit: true });
      }
    }
    return createErrorResponse(res, 500, ErrorCodes.INTERNAL_SERVER_ERROR, 'Payment processing failed', error.message);
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return createErrorResponse(res, 404, ErrorCodes.RESOURCE_NOT_FOUND, 'Payment record not found');
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    return createErrorResponse(res, 500, ErrorCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.refundPayment = async (req, res) => {
  try {
    const { refundReason } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return createErrorResponse(res, 404, ErrorCodes.RESOURCE_NOT_FOUND, 'Payment record not found for refund');
    }
    if (payment.status === 'REFUNDED') {
      return createErrorResponse(res, 400, ErrorCodes.VALIDATION_FAILED, 'Payment has already been refunded');
    }

    payment.status = 'REFUNDED';
    payment.refundReason = refundReason || 'Customer requested refund';
    await payment.save();

    res.json({ success: true, message: 'Payment refunded successfully', data: payment });
  } catch (error) {
    return createErrorResponse(res, 500, ErrorCodes.INTERNAL_SERVER_ERROR, 'Refund failed', error.message);
  }
};

exports.refundPaymentByOrderId = async (req, res) => {
  try {
    const { orderId, refundReason } = req.body;
    if (!orderId) {
      return createErrorResponse(res, 400, ErrorCodes.VALIDATION_FAILED, 'orderId is required');
    }

    const payment = await Payment.findOne({ orderId, status: 'COMPLETED' });
    if (!payment) {
      console.log(`[PAYMENT] No completed payment found for orderId ${orderId} to refund. Eventual consistency resolved.`);
      return res.json({ success: true, message: 'No completed payment found, refund resolved preemptively' });
    }

    payment.status = 'REFUNDED';
    payment.refundReason = refundReason || 'Compensating transaction from Saga Orchestrator';
    await payment.save();

    console.log(`[PAYMENT] Refunded completed payment for orderId ${orderId}`);
    res.json({ success: true, message: 'Payment refunded successfully', data: payment });
  } catch (error) {
    return createErrorResponse(res, 500, ErrorCodes.INTERNAL_SERVER_ERROR, 'Refund by order ID failed', error.message);
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    console.log('Payment webhook received:', event);
    res.json({ success: true, received: true });
  } catch (error) {
    return createErrorResponse(res, 500, ErrorCodes.INTERNAL_SERVER_ERROR, 'Webhook processing failed', error.message);
  }
};
