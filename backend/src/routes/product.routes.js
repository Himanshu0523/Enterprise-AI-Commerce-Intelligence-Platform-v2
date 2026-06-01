const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const ownership = require("../middleware/ownership");

router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);

// Seller scoped routes (placed before parameterized ID route)
router.get("/my-products", authenticate, authorize("admin", "superadmin"), productController.getMyProducts);
router.get("/my-stats", authenticate, authorize("admin", "superadmin"), productController.getMyStats);

router.get("/:id", productController.getProductById);

// Admin and Superadmin routes
router.post("/", authenticate, authorize("admin", "superadmin"), productController.createProduct);
router.put("/:id", authenticate, authorize("admin", "superadmin"), ownership, productController.updateProduct);
router.delete("/:id", authenticate, authorize("admin", "superadmin"), ownership, productController.deleteProduct);

module.exports = router;