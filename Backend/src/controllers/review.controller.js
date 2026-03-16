const reviewModel = require("../models/review.model");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");

// ─────────────────────────────────────────────
// CREATE REVIEW
// POST /api/reviews
// Customer only — must have ordered product
// ─────────────────────────────────────────────
const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    // 1. Only customers can review
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can write reviews",
      });
    }

    // 2. Validate required fields
    if (!product || !rating) {
      return res.status(400).json({
        success: false,
        message: "Product and rating are required",
      });
    }

    // 3. Check product exists
    const productExists = await productModel.findById(product);
    if (!productExists || !productExists.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 4. Check customer has actually ordered this product
    const hasPurchased = await orderModel.findOne({
      customer: req.user.id,
      "items.product": product,
      status: "delivered",
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: "You can only review products you have purchased and received",
      });
    }

    // 5. Check already reviewed
    const alreadyReviewed = await reviewModel.findOne({
      product,
      customer: req.user.id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // 6. Create review
    const review = await reviewModel.create({
      product,
      customer: req.user.id,
      rating: Number(rating),
      comment: comment || "",
    });

    // 7. Update product average rating
    await updateProductRating(product);

    // 8. Populate and return
    const populatedReview = await reviewModel
      .findById(review._id)
      .populate("customer", "name profileImage")
      .populate("product", "name images");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    // Handle duplicate review error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }
    console.error("Create review error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────
// GET REVIEWS FOR A PRODUCT
// GET /api/reviews?product=PRODUCT_ID
// ─────────────────────────────────────────────
const getProductReviews = async (req, res) => {
  try {
    const { product } = req.query;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required as query param — ?product=PRODUCT_ID",
      });
    }

    // Check product exists
    const productExists = await productModel.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = await reviewModel
      .find({ product })
      .populate("customer", "name profileImage")
      .sort({ createdAt: -1 });

    // Calculate rating summary
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          ).toFixed(1)
        : 0;

    // Rating breakdown — how many 5 star, 4 star etc
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      breakdown[r.rating]++;
    });

    res.status(200).json({
      success: true,
      summary: {
        totalReviews,
        averageRating: Number(averageRating),
        breakdown,
      },
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// GET MY REVIEWS
// GET /api/reviews/my
// Customer sees all their reviews
// ─────────────────────────────────────────────
const getMyReviews = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({ customer: req.user.id })
      .populate("product", "name images price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get my reviews error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// UPDATE REVIEW
// PUT /api/reviews/:id
// Customer updates their own review
// ─────────────────────────────────────────────
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // 1. Find review
    const review = await reviewModel.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // 2. Only the customer who wrote it can update
    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews",
      });
    }

    // 3. Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // 4. Update
    const updateData = {};
    if (rating) updateData.rating = Number(rating);
    if (comment !== undefined) updateData.comment = comment;

    const updatedReview = await reviewModel
      .findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("customer", "name profileImage")
      .populate("product", "name images");

    // 5. Recalculate product rating
    await updateProductRating(review.product);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// DELETE REVIEW
// DELETE /api/reviews/:id
// Customer deletes their own review
// ─────────────────────────────────────────────
const deleteReview = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Only the customer who wrote it can delete
    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    const productId = review.product;

    await reviewModel.findByIdAndDelete(req.params.id);

    // Recalculate product rating after delete
    await updateProductRating(productId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// HELPER — update product average rating
// Called after every create / update / delete
// ─────────────────────────────────────────────
const updateProductRating = async (productId) => {
  const reviews = await reviewModel.find({ product: productId });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  await productModel.findByIdAndUpdate(productId, {
    rating: Math.round(avgRating * 10) / 10, // round to 1 decimal
  });
};

// ─── EXPORT ──────────────────────────────────
module.exports = {
  createReview,
  getProductReviews,
  getMyReviews,
  updateReview,
  deleteReview,
};
