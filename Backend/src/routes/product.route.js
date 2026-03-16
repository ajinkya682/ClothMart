const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// ─── Public routes ────────────────────────────
router.get("/", getAllProducts);

router.get("/my", authMiddleware, getMyProducts);

router.get("/:id", getProductById);

// ─── Protected routes ─────────────────────────
router.post(
  "/",
  authMiddleware,
  upload.array("images", 5), // ← max 5 images
  createProduct,
);

router.put("/:id", authMiddleware, upload.array("images", 5), updateProduct);

router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
