const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  placeOrder,
  getMyOrders,
  getStoreOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/order.controller");

// All order routes require token
router.post("/", authMiddleware, placeOrder);

router.get("/my", authMiddleware, getMyOrders);

router.get("/store", authMiddleware, getStoreOrders);

router.get("/:id", authMiddleware, getOrderById);

router.put("/:id/status", authMiddleware, updateOrderStatus);

router.put("/:id/cancel", authMiddleware, cancelOrder);

module.exports = router;
