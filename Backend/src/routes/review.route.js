const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createReview,
  getProductReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

// Public
router.get("/", getProductReviews);

// Protected
router.get("/my", authMiddleware, getMyReviews);

router.post("/", authMiddleware, createReview);

router.put("/:id", authMiddleware, updateReview);

router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
