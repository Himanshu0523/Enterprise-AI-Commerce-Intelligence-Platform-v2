const registry = {
  'product-service': process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
  'cart-service':    process.env.CART_SERVICE_URL    || 'http://localhost:3002',
  // ...
};

exports.get = (name) => registry[name];