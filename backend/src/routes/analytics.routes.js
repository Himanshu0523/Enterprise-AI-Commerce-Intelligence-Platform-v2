const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analytics.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Public or Admin-only depending on project needs, using authenticate for security
router.get("/revenue", authenticate, analyticsController.getMonthlyRevenue);
router.get("/top-products", authenticate, analyticsController.getTopProducts);
router.get("/customers", authenticate, analyticsController.getCustomerLifetimeValue);

// Event ingestion for ML
router.post("/events", authenticate, analyticsController.recordEvent);

module.exports = router;