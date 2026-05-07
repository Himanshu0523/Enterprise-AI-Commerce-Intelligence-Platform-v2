const Event = require("../models/event.model");
const Product = require("../models/product.model");

exports.getUserRecommendations = async (userId) => {

  const viewedProducts = await Event.find({
    user_id: userId,
    event_type: "product_view"
  });

  const productIds = viewedProducts.map(e => e.product_id);

  return await Product.find({
    _id: { $in: productIds }
  }).limit(10);

};



exports.getSimilarProducts = async (productId) => {

  const product = await Product.findById(productId);

  return await Product.find({
    category: product.category,
    _id: { $ne: productId }
  }).limit(10);

};