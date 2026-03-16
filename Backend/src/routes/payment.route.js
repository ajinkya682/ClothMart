const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createPayment,
  verifyPayment,
  getPaymentDetails,
} = require("../controllers/payment.controller");

router.post("/create", authMiddleware, createPayment);

router.post("/verify", authMiddleware, verifyPayment);

router.get("/:orderId", authMiddleware, getPaymentDetails);

module.exports = router;
