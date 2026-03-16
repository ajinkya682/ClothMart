const Razorpay = require("razorpay");
const crypto = require("crypto");
const orderModel = require("../models/order.model");
const paymentModel = require("../models/payment.model");

// ─── Razorpay instance ────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────
// CREATE PAYMENT
// POST /api/payment/create
// Creates a Razorpay order
// ─────────────────────────────────────────────
const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // 1. Validate
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // 2. Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 3. Only the customer who placed the order can pay
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to pay for this order",
      });
    }

    // 4. Check order is not already paid
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This order is already paid",
      });
    }

    // 5. Check order is not cancelled
    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot pay for a cancelled order",
      });
    }

    // 6. Create Razorpay order
    // Amount must be in paise (multiply INR by 100)
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${orderId}`,
      notes: {
        orderId: orderId,
        customerId: req.user.id,
      },
    });

    // 7. Save payment record
    await paymentModel.create({
      order: orderId,
      customer: req.user.id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      currency: "INR",
      status: "created",
    });

    // 8. Send response to frontend
    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      amountInPaise: order.totalAmount * 100,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      orderDetails: {
        id: order._id,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error) {
    console.error("Create payment error:", error.message);
    res.status(500).json({
      success: false,
      message: "Payment creation failed. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────
// VERIFY PAYMENT
// POST /api/payment/verify
// Verifies Razorpay signature after payment
// ─────────────────────────────────────────────
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // 1. Validate all fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: "All payment fields are required",
      });
    }

    // 2. Verify signature
    // Razorpay sends a signature — we recreate it and compare
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expected === razorpay_signature;

    if (!isValid) {
      // Signature mismatch — payment is fake or tampered
      await paymentModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" },
      );

      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // 3. Signature is valid — update payment record
    await paymentModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      },
    );

    // 4. Update order payment status and status
    const updatedOrder = await orderModel
      .findByIdAndUpdate(
        orderId,
        {
          paymentStatus: "paid",
          status: "confirmed",
        },
        { new: true },
      )
      .populate("customer", "name email")
      .populate("store", "name logo")
      .populate("items.product", "name images price");

    // 5. Send success response
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Verify payment error:", error.message);
    res.status(500).json({
      success: false,
      message: "Payment verification failed. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────
// GET PAYMENT DETAILS
// GET /api/payment/:orderId
// Customer sees payment info for their order
// ─────────────────────────────────────────────
const getPaymentDetails = async (req, res) => {
  try {
    const payment = await paymentModel
      .findOne({ order: req.params.orderId })
      .populate("order", "totalAmount status paymentStatus")
      .populate("customer", "name email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found for this order",
      });
    }

    // Only the customer can see their payment
    if (payment.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this payment",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─── EXPORT ──────────────────────────────────
module.exports = {
  createPayment,
  verifyPayment,
  getPaymentDetails,
};
