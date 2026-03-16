const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percent", "flat"],
      required: [true, "Discount type is required"],
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [1, "Discount value must be at least 1"],
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "Min order amount cannot be negative"],
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Each store can only have one coupon with same code
couponSchema.index({ store: 1, code: 1 }, { unique: true });

module.exports = mongoose.model("Coupon", couponSchema);
