const analyticsService = require("../services/analytics.service");

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