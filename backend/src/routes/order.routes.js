const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

// User routes
router.post("/", authenticate, orderController.createOrder);
router.get("/", authenticate, orderController.getUserOrders);

// Admin routes
router.get("/admin", authenticate, authorize("admin"), orderController.getAllOrders);

module.exports = router;