const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth.route");
const storeRoutes = require("./routes/store.route");
const productRoutes = require("./routes/product.route");
const orderRoutes = require("./routes/order.route");
const reviewRoutes = require("./routes/review.route");
const couponRoutes = require("./routes/coupon.route");
const paymentRoutes = require("./routes/payment.route");
const analyticsRoutes = require("./routes/analytics.route");

const app = express();

// ─── MIDDLEWARE ───────────────────────────────

// ✅ REPLACE WITH THIS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowed = [
        "http://localhost:5173",
        "https://cloth-mart.vercel.app",
      ];
      // allow all vercel preview URLs
      if (
        !origin ||
        allowed.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── ROUTES ──────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/coupons", require("./routes/coupon.route"));

// ─── TEST ROUTE ───────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "✅ ClothMart API is running!",
    version: "1.0.0",
    endpoints: {
      register: "POST   /api/auth/register",
      login: "POST   /api/auth/login",
      logout: "POST   /api/auth/logout",
      getProfile: "GET    /api/auth/me",
      updateProfile: "PUT    /api/auth/me",
      changePassword: "PUT    /api/auth/password",
      addAddress: "POST   /api/auth/address",
      deleteAddress: "DELETE /api/auth/address/:addressId",
    },
  });
});

// ─── 404 HANDLER ─────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── GLOBAL ERROR HANDLER ────────────────────
app.use((err, req, res, next) => {
  console.error("Global error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
