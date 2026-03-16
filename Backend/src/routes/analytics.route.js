const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  getDashboardSummary,
  getMonthlyRevenue,
  getWeeklyOrders,
  getTopProducts,
  getOrderStatusBreakdown,
  getLowStockProducts,
} = require("../controllers/analytics.controller");

// All analytics routes require token + store_owner role
router.get("/summary", authMiddleware, getDashboardSummary);
router.get("/revenue", authMiddleware, getMonthlyRevenue);
router.get("/orders-weekly", authMiddleware, getWeeklyOrders);
router.get("/top-products", authMiddleware, getTopProducts);
router.get("/order-status", authMiddleware, getOrderStatusBreakdown);
router.get("/low-stock", authMiddleware, getLowStockProducts);

module.exports = router;
