const Payment = require('../models/Payment');
const { createErrorResponse, ErrorCodes } = require('../../../../../packages/shared-utils');

// Initialize Stripe SDK if secret key is present
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  const Stripe = require('stripe');
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
  console.log('[PAYMENT] Stripe SDK initialized');
}

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

    let transactionId = 'TXN-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
    let clientSecret = null;

    // If Stripe provider requested or Stripe configured, create a real Stripe PaymentIntent
    if (stripe && (paymentProvider === 'STRIPE' || process.env.USE_STRIPE_DEFAULT === 'true')) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // convert to cents
          currency: currency.toLowerCase(),
          metadata: { orderId, userId },
          automatic_payment_methods: { enabled: true },
        });
        transactionId = paymentIntent.id;
        clientSecret = paymentIntent.client_secret;
        console.log(`[PAYMENT] Created Stripe PaymentIntent ${transactionId} for order ${orderId}`);
      } catch (stripeErr) {
        console.warn('[PAYMENT] Stripe PaymentIntent creation warning:', stripeErr.message);
      }
    }

    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      currency,
      paymentProvider: stripe ? 'STRIPE' : paymentProvider,
      transactionId,
      status: 'COMPLETED',
      paymentMethodDetails: paymentMethodDetails || { cardLast4: '4242', brand: 'Visa' },
    });

    res.status(201).json({
      success: true,
      data: payment,
      ...(clientSecret ? { clientSecret } : {}),
    });
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

    // Trigger real Stripe Refund if payment was created via Stripe
    if (stripe && payment.paymentProvider === 'STRIPE' && payment.transactionId?.startsWith('pi_')) {
      try {
        await stripe.refunds.create({
          payment_intent: payment.transactionId,
          reason: 'requested_by_customer',
        });
        console.log(`[PAYMENT] Processed real Stripe refund for intent ${payment.transactionId}`);
      } catch (stripeRefundErr) {
        console.warn('[PAYMENT] Stripe Refund API warning:', stripeRefundErr.message);
      }
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

    // Trigger real Stripe Refund if applicable
    if (stripe && payment.paymentProvider === 'STRIPE' && payment.transactionId?.startsWith('pi_')) {
      try {
        await stripe.refunds.create({
          payment_intent: payment.transactionId,
        });
        console.log(`[PAYMENT] Refunded Stripe PaymentIntent ${payment.transactionId} for order ${orderId}`);
      } catch (err) {
        console.warn('[PAYMENT] Stripe refund error:', err.message);
      }
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

const processedWebhooks = new Set();

exports.handleWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event = req.body;

    // Verify Stripe signature if webhook secret is configured
    if (stripe && process.env.STRIPE_WEBHOOK_SECRET && sig) {
      try {
        const rawBody = req.rawBody || req.body;
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log(`[PAYMENT WEBHOOK] Signature verified successfully for event type ${event.type}`);
      } catch (err) {
        console.error('[PAYMENT WEBHOOK] Signature verification failed:', err.message);
        return createErrorResponse(res, 400, ErrorCodes.VALIDATION_FAILED, `Webhook signature verification failed: ${err.message}`);
      }
    }

    // Deduplicate webhook event handling
    if (event.id && processedWebhooks.has(event.id)) {
      console.log(`[PAYMENT WEBHOOK] Duplicate event ${event.id} skipped`);
      return res.json({ success: true, duplicate: true });
    }
    if (event.id) {
      processedWebhooks.add(event.id);
      if (processedWebhooks.size > 5000) processedWebhooks.clear();
    }

    console.log('[PAYMENT WEBHOOK] Received event:', event.type || 'Custom/Mock Event');


    // Event Handling
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        await Payment.findOneAndUpdate(
          { transactionId: intent.id },
          { status: 'COMPLETED' },
          { new: true }
        );
        console.log(`[PAYMENT WEBHOOK] Marked PaymentIntent ${intent.id} as COMPLETED`);
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        await Payment.findOneAndUpdate(
          { transactionId: intent.id },
          { status: 'FAILED' },
          { new: true }
        );
        console.log(`[PAYMENT WEBHOOK] Marked PaymentIntent ${intent.id} as FAILED`);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        await Payment.findOneAndUpdate(
          { transactionId: charge.payment_intent },
          { status: 'REFUNDED' },
          { new: true }
        );
        console.log(`[PAYMENT WEBHOOK] Marked Charge/Intent ${charge.payment_intent} as REFUNDED`);
        break;
      }
      default:
        console.log(`[PAYMENT WEBHOOK] Unhandled event type ${event.type}`);
    }

    res.json({ success: true, received: true, eventType: event.type });
  } catch (error) {
    return createErrorResponse(res, 500, ErrorCodes.INTERNAL_SERVER_ERROR, 'Webhook processing failed', error.message);
  }
};
