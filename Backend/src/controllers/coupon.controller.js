const couponModel = require("../models/coupon.model");
const storeModel = require("../models/store.model");

// ─────────────────────────────────────────────
// CREATE COUPON
// POST /api/coupons
// Store owner only
// ─────────────────────────────────────────────
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, expiresAt } =
      req.body;

    // 1. Only store_owner can create coupons
    if (req.user.role !== "store_owner") {
      return res.status(403).json({
        success: false,
        message: "Only store owners can create coupons",
      });
    }

    // 2. Validate required fields
    if (!code || !discountType || !discountValue) {
      return res.status(400).json({
        success: false,
        message: "Code, discount type and discount value are required",
      });
    }

    // 3. Validate percent discount not over 100
    if (discountType === "percent" && discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: "Percent discount cannot be more than 100",
      });
    }

    // 4. Find owner's store
    const store = await storeModel.findOne({ owner: req.user.id });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store. Create a store first.",
      });
    }

    // 5. Create coupon
    const coupon = await couponModel.create({
      store: store._id,
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    // Duplicate code for same store
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A coupon with this code already exists for your store",
      });
    }
    console.error("Create coupon error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────
// GET MY STORE COUPONS
// GET /api/coupons
// Store owner sees their own coupons
// ─────────────────────────────────────────────
const getMyCoupons = async (req, res) => {
  try {
    if (req.user.role !== "store_owner") {
      return res.status(403).json({
        success: false,
        message: "Only store owners can view coupons",
      });
    }

    const store = await storeModel.findOne({ owner: req.user.id });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store",
      });
    }

    const coupons = await couponModel
      .find({ store: store._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error("Get coupons error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// VALIDATE COUPON
// POST /api/coupons/validate
// Customer validates coupon at checkout
// ─────────────────────────────────────────────
const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount, storeId } = req.body;

    // 1. Validate required fields
    if (!code || !orderAmount || !storeId) {
      return res.status(400).json({
        success: false,
        message: "Code, order amount and store ID are required",
      });
    }

    // 2. Find coupon by code and store
    const coupon = await couponModel.findOne({
      code: code.toUpperCase(),
      store: storeId,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // 3. Check coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is no longer active",
      });
    }

    // 4. Check coupon is not expired
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired",
      });
    }

    // 5. Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`,
      });
    }

    // 6. Calculate discount amount
    let discountAmount = 0;

    if (coupon.discountType === "percent") {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
    } else {
      // flat discount
      discountAmount = coupon.discountValue;
    }

    // Discount cannot be more than order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    const finalAmount = orderAmount - discountAmount;

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      orderAmount: Number(orderAmount),
      discountAmount: Math.round(discountAmount),
      finalAmount: Math.round(finalAmount),
    });
  } catch (error) {
    console.error("Validate coupon error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// UPDATE COUPON
// PUT /api/coupons/:id
// Store owner updates their coupon
// ─────────────────────────────────────────────
const updateCoupon = async (req, res) => {
  try {
    const { discountType, discountValue, minOrderAmount, expiresAt, isActive } =
      req.body;

    // 1. Find coupon
    const coupon = await couponModel.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // 2. Check ownership
    const store = await storeModel.findOne({ owner: req.user.id });
    if (!store || store._id.toString() !== coupon.store.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this coupon",
      });
    }

    // 3. Validate percent discount
    if (discountType === "percent" && discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: "Percent discount cannot be more than 100",
      });
    }

    // 4. Build update
    const updateData = {};
    if (discountType !== undefined) updateData.discountType = discountType;
    if (discountValue !== undefined)
      updateData.discountValue = Number(discountValue);
    if (minOrderAmount !== undefined)
      updateData.minOrderAmount = Number(minOrderAmount);
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedCoupon = await couponModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// DELETE COUPON
// DELETE /api/coupons/:id
// Store owner deletes their coupon
// ─────────────────────────────────────────────
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await couponModel.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Check ownership
    const store = await storeModel.findOne({ owner: req.user.id });
    if (!store || store._id.toString() !== coupon.store.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this coupon",
      });
    }

    await couponModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// TOGGLE COUPON ACTIVE STATUS
// PUT /api/coupons/:id/toggle
// Quick enable / disable
// ─────────────────────────────────────────────
const toggleCoupon = async (req, res) => {
  try {
    const coupon = await couponModel.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Check ownership
    const store = await storeModel.findOne({ owner: req.user.id });
    if (!store || store._id.toString() !== coupon.store.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to toggle this coupon",
      });
    }

    // Toggle isActive
    const updatedCoupon = await couponModel.findByIdAndUpdate(
      req.params.id,
      { isActive: !coupon.isActive },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: `Coupon ${updatedCoupon.isActive ? "activated" : "deactivated"} successfully`,
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error("Toggle coupon error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─── EXPORT ──────────────────────────────────
module.exports = {
  createCoupon,
  getMyCoupons,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
};
