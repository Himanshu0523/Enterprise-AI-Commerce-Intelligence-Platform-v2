const orderService = require("../services/order.service");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});
/*
Create Order
POST /api/orders
*/

exports.createOrder = async (req, res) => {
  try {

    const userId = req.user.id;
    const { items } = req.body;

    const order = await orderService.createOrder(userId, items);

    res.status(201).json({
      success: true,
      data: order
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/*
Get Orders of Logged-in User
GET /api/orders
*/

exports.getUserOrders = async (req, res) => {

  try {

    const userId = req.user.id;

    const orders = await orderService.getUserOrders(userId);

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/*
Mark Order Item as Delivered and Trigger Payout
PUT /api/orders/:orderId/deliver/:itemId
*/
exports.markItemDelivered = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    
    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Find the specific item
    const item = order.items.find(i => i._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in order' });
    }
    
    // Mark as delivered
    item.delivery_status = 'delivered';
    
    // Process Payout if it was paid
    if (order.status === 'paid' && item.payout_status === 'pending') {
      const seller = await User.findById(item.seller_id);
      
      if (seller && seller.sellerDetails && seller.sellerDetails.razorpayAccountId) {
        // Trigger Razorpay Route Transfer
        try {
          const platformFeePercent = 5; // 5% fee
          const sellerShare = item.price * item.quantity * (1 - platformFeePercent / 100);
          
          await razorpay.transfers.create({
            account: seller.sellerDetails.razorpayAccountId,
            amount: Math.round(sellerShare * 100),
            currency: "USD",
            notes: {
              order_id: order._id.toString(),
              item_id: item._id.toString()
            }
          });
          
          item.payout_status = 'completed';
        } catch (err) {
          console.error("Payout failed", err);
          // Don't fail the request, just leave payout_status as pending
        }
      }
    }
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Item marked as delivered',
      data: item
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};