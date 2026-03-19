const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createPaymentIntent,
  verifyAndCreateOrder,
} = require("../controllers/payment.controller");

// All payment routes require authentication
router.use(authMiddleware);

// Step 1 — Create Razorpay order (no DB order created yet)
router.post("/create-intent", createPaymentIntent);

// Step 2 — Verify payment signature → create DB order
router.post("/verify-and-create-order", verifyAndCreateOrder);

module.exports = router;
