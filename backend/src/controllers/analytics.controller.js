const analyticsService = require("../services/analytics.service");
const Event = require("../models/event.model");

/*
Top Products
GET /api/analytics/top-products
*/

exports.getTopProducts = async (req, res) => {

  try {

    const products = await analyticsService.getTopProducts();

    res.json({
      success: true,
      data: products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


/*
Monthly Revenue
GET /api/analytics/monthly-revenue
*/

exports.getMonthlyRevenue = async (req, res) => {

  try {

    const revenue = await analyticsService.getMonthlyRevenue();

    res.json({
      success: true,
      data: revenue
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


/*
Customer Lifetime Value
GET /api/analytics/customer-ltv
*/

exports.getCustomerLifetimeValue = async (req, res) => {

  try {

    const clv = await analyticsService.getCustomerLifetimeValue();

    res.json({
      success: true,
      data: clv
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/*
Record User Event
POST /api/analytics/events
*/

exports.recordEvent = async (req, res) => {
  try {
    const { event_type, product_id, metadata } = req.body;
    const userId = req.user.id;

    if (!event_type) {
      return res.status(400).json({ success: false, message: "Event type is required" });
    }

    const newEvent = await Event.create({
      user_id: userId,
      event_type,
      product_id: product_id || null,
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      data: newEvent
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};