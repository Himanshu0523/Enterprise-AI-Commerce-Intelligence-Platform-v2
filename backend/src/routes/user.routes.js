const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

// Admin only routes
router.get("/", authenticate, authorize("admin"), userController.getAllUsers);
router.put("/:id/role", authenticate, authorize("admin"), userController.updateUserRole);
router.delete("/:id", authenticate, authorize("admin"), userController.deleteUser);

// User routes
router.get("/:id", authenticate, userController.getUser);
router.put("/:id", authenticate, userController.updateUser);
router.get("/:id/wishlist", authenticate, userController.getWishlist);

module.exports = router;
