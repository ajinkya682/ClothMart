const Razorpay = require("razorpay");
const crypto = require("crypto");
const orderModel = require("../models/order.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────
// CREATE RAZORPAY INTENT (no DB order yet)
// POST /api/payment/create-intent
// Body: { amount, currency? }
// ─────────────────────────────────────────────
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    // Create Razorpay order — amount in paise
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create payment intent error:", error.message);
    res.status(500).json({ success: false, message: "Payment gateway error" });
  }
};

// ─────────────────────────────────────────────
// VERIFY PAYMENT + CREATE ORDER IN DB
// POST /api/payment/verify-and-create-order
// Body: {
//   razorpay_order_id, razorpay_payment_id, razorpay_signature,
//   items, deliveryAddress, couponCode, amount
// }
// ─────────────────────────────────────────────
const verifyAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      deliveryAddress,
      couponCode,
      amount,
    } = req.body;

    // 1. Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !items?.length ||
      !deliveryAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 2. Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // 3. Signature valid → NOW create the order in DB
    const order = await orderModel.create({
      user: req.user.id,
      items,
      deliveryAddress,
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      status: "confirmed", // auto-confirm on successful payment
      couponCode: couponCode || null,
      totalAmount: amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    res.status(201).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Verify and create order error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createPaymentIntent,
  verifyAndCreateOrder,
};
