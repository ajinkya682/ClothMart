const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createCoupon,
  getMyCoupons,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
} = require("../controllers/coupon.controller");

router.post("/", authMiddleware, createCoupon);

router.get("/", authMiddleware, getMyCoupons);

router.post("/validate", authMiddleware, validateCoupon);

router.put("/:id", authMiddleware, updateCoupon);

router.put("/:id/toggle", authMiddleware, toggleCoupon);

router.delete("/:id", authMiddleware, deleteCoupon);

module.exports = router;
