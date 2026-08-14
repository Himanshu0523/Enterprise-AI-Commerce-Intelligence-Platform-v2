const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalAmount: 0 });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, title, price, quantity = 1, image, variantId } = req.body;

    if (!productId || !title || price === undefined) {
      return res.status(400).json({ msg: 'productId, title, and price are required' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.variantId === (variantId || undefined)
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, title, price, quantity, image, variantId });
    }

    cart.calculateTotal();
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ msg: 'Quantity must be at least 1' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    const item = cart.items.find((i) => i.productId === productId);
    if (!item) return res.status(404).json({ msg: 'Item not found in cart' });

    item.quantity = quantity;
    cart.calculateTotal();
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.productId !== productId);
    cart.calculateTotal();
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }
    res.json({ msg: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.mergeCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { guestItems = [] } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    guestItems.forEach((guestItem) => {
      const idx = cart.items.findIndex((i) => i.productId === guestItem.productId);
      if (idx > -1) {
        cart.items[idx].quantity += guestItem.quantity || 1;
      } else {
        cart.items.push(guestItem);
      }
    });

    cart.calculateTotal();
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
