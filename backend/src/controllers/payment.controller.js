const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

exports.createRazorpayOrder = catchAsync(async (req, res, next) => {
  const { items, total_price, shippingAddress } = req.body;
  
  if (!items || items.length === 0) {
    return next(new AppError('No order items found', 400));
  }
  
  // 1. Create order in our DB first
  const order = await Order.create({
    user_id: req.user.id,
    items,
    total_price,
    status: 'created'
  });

  // 2. Create Razorpay order
  const options = {
    amount: Math.round(total_price * 100), // amount in the smallest currency unit (e.g., paisa for INR, cents for USD)
    currency: "USD",
    receipt: order._id.toString()
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    
    // 3. Update DB order with razorpay order ID
    order.razorpay_order_id = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      success: true,
      data: {
        order,
        razorpayOrder
      }
    });
  } catch (err) {
    return next(new AppError('Failed to create Razorpay order', 500));
  }
});

exports.verifyRazorpayPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

  const order = await Order.findById(order_id);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Update order status
    order.status = 'paid';
    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });
  } else {
    order.status = 'failed';
    await order.save();
    
    return next(new AppError('Payment verification failed', 400));
  }
});
