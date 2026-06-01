const Order = require("../models/order.model");
const Product = require("../models/product.model");

exports.calculateOrderTotal = async (items) => {

  let total = 0;

  for (const item of items) {

    const product = await Product.findById(item.product_id);

    if (!product) {
      throw new Error(`Product with ID ${item.product_id} not found`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
    }

    total += product.price * item.quantity;

  }

  return total;
};



exports.updateInventory = async (items) => {

  for (const item of items) {

    await Product.findByIdAndUpdate(
      item.product_id,
      { $inc: { stock: -item.quantity } }
    );

  }

};



exports.createOrder = async (userId, items) => {

  const total = await exports.calculateOrderTotal(items);

  await exports.updateInventory(items);

  const order = await Order.create({
    user_id: userId,
    items,
    total_price: total
  });

  return order;

};



exports.getUserOrders = async (userId) => {

  return await Order.find({ user_id: userId })
    .populate("items.product_id");

};

exports.getAllOrders = async () => {
  return await Order.find()
    .populate("user_id", "name email")
    .populate("items.product_id");
};