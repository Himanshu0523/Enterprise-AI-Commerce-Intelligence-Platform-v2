const orderService = require("../services/order.service");

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
Get All Orders (Admin)
GET /api/admin/orders
*/

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();

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