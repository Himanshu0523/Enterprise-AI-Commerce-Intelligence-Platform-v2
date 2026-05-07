const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/:id", authenticate, userController.getUser);
router.put("/:id", authenticate, userController.updateUser);
router.get("/:id/wishlist", authenticate, userController.getWishlist);

module.exports = router;
