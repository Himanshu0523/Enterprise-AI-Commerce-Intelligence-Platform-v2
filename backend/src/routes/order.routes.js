const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.post("/orders", authenticate, orderController.createOrder);

router.get("/orders", authenticate, orderController.getUserOrders);

module.exports = router;