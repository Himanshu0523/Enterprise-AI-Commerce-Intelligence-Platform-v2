const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/:userId", authenticate, cartController.getCart);
router.post("/:userId", authenticate, cartController.saveCart);

module.exports = router;
