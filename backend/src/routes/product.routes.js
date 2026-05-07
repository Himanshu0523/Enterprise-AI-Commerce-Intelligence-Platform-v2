const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/:id", productController.getProductById);

// Admin only routes
router.post("/", authenticate, authorize("admin"), productController.createProduct);
router.put("/:id", authenticate, authorize("admin"), productController.updateProduct);
router.delete("/:id", authenticate, authorize("admin"), productController.deleteProduct);

module.exports = router;