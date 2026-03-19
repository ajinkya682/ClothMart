const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const storeModel = require("../models/store.model");
const userModel = require("../models/auth.model");

// ─────────────────────────────────────────────
// HELPER — get owner's store
// ─────────────────────────────────────────────
const getOwnerStore = async (userId) => {
  return await storeModel.findOne({ owner: userId });
};

// ─────────────────────────────────────────────
// DASHBOARD SUMMARY
// GET /api/analytics/summary
// Today's stats for dashboard home cards
// ─────────────────────────────────────────────
const getDashboardSummary = async (req, res) => {
  try {
    // 1. Get owner's store
    const store = await getOwnerStore(req.user.id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store",
      });
    }

    // 2. Today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 3. Today's orders
    const todayOrders = await orderModel.countDocuments({
      store: store._id,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    // 4. Today's revenue
    const todayRevenueResult = await orderModel.aggregate([
      {
        $match: {
          store: store._id,
          status: { $ne: "cancelled" }, // ← include COD too
          createdAt: { $gte: todayStart, $lte: todayEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const todayRevenue = todayRevenueResult[0]?.total || 0;

    // 5. Total orders all time
    const totalOrders = await orderModel.countDocuments({
      store: store._id,
    });

    // 6. Total revenue all time
    const totalRevenueResult = await orderModel.aggregate([
      {
        $match: {
          store: store._id,
          status: { $ne: "cancelled" }, // ← include COD
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // 7. Pending orders count
    const pendingOrders = await orderModel.countDocuments({
      store: store._id,
      status: "pending",
    });

    // 8. Total products
    const totalProducts = await productModel.countDocuments({
      store: store._id,
      isActive: true,
    });

    // 9. Low stock products (stock less than 5)
    const lowStockProducts = await productModel.countDocuments({
      store: store._id,
      isActive: true,
      stock: { $lt: 5 },
    });

    // 10. Out of stock products
    const outOfStock = await productModel.countDocuments({
      store: store._id,
      isActive: true,
      stock: 0,
    });

    // 11. Recent 5 orders
    const recentOrders = await orderModel
      .find({ store: store._id })
      .populate("customer", "name email phone")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      summary: {
        todayOrders,
        todayRevenue,
        totalOrders,
        totalRevenue,
        pendingOrders,
        totalProducts,
        lowStockProducts,
        outOfStock,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// MONTHLY REVENUE
// GET /api/analytics/revenue
// Last 6 months revenue for chart
// ─────────────────────────────────────────────
const getMonthlyRevenue = async (req, res) => {
  try {
    const store = await getOwnerStore(req.user.id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store",
      });
    }

    // Last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueData = await orderModel.aggregate([
      {
        $match: {
          store: store._id,
          paymentStatus: "paid",
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Format data for chart
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = revenueData.map((item) => ({
      month: `${months[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue,
      orders: item.orders,
    }));

    res.status(200).json({
      success: true,
      chartData,
    });
  } catch (error) {
    console.error("Monthly revenue error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// WEEKLY ORDERS
// GET /api/analytics/orders-weekly
// Last 7 days orders for chart
// ─────────────────────────────────────────────
const getWeeklyOrders = async (req, res) => {
  try {
    const store = await getOwnerStore(req.user.id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store",
      });
    }

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyData = await orderModel.aggregate([
      {
        $match: {
          store: store._id,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    const chartData = weeklyData.map((item) => ({
      date: `${item._id.day}/${item._id.month}`,
      orders: item.orders,
      revenue: item.revenue,
    }));

    res.status(200).json({
      success: true,
      chartData,
    });
  } catch (error) {
    console.error("Weekly orders error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// TOP PRODUCTS
// GET /api/analytics/top-products
// Top 5 best selling products
// ─────────────────────────────────────────────
const getTopProducts = async (req, res) => {
  try {
    const store = await getOwnerStore(req.user.id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store",
      });
    }

    const topProducts = await orderModel.aggregate([
      // Only this store's orders
      {
        $match: {
          store: store._id,
          status: { $ne: "cancelled" },
        },
      },
      // Unwind items array
      { $unwind: "$items" },
      // Group by product
      {
        $group: {
          _id: "$items.product",
          totalQty: { $sum: "$items.qty" },
          totalRevenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
          totalOrders: { $sum: 1 },
        },
      },
      // Sort by total quantity sold
      { $sort: { totalQty: -1 } },
      // Top 5 only
      { $limit: 5 },
      // Join with products collection
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      // Return useful fields only
      {
        $project: {
          _id: 0,
          product: {
            _id: "$product._id",
            name: "$product.name",
            images: "$product.images",
            price: "$product.price",
            stock: "$product.stock",
          },
          totalQty,
          totalRevenue,
          totalOrders,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: topProducts.length,
      topProducts,
    });
  } catch (error) {
    console.error("Top products error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// ORDER STATUS BREAKDOWN
// GET /api/analytics/order-status
// Count of each order status
// ─────────────────────────────────────────────
const getOrderStatusBreakdown = async (req, res) => {
  try {
    const store = await getOwnerStore(req.user.id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store",
      });
    }

    const statusData = await orderModel.aggregate([
      { $match: { store: store._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format as object
    const breakdown = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    statusData.forEach((item) => {
      breakdown[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      breakdown,
    });
  } catch (error) {
    console.error("Order status breakdown error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// LOW STOCK PRODUCTS
// GET /api/analytics/low-stock
// Products with stock less than 5
// ─────────────────────────────────────────────
const getLowStockProducts = async (req, res) => {
  try {
    const store = await getOwnerStore(req.user.id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store",
      });
    }

    const lowStock = await productModel
      .find({
        store: store._id,
        isActive: true,
        stock: { $lt: 5 },
      })
      .select("name images price stock category")
      .sort({ stock: 1 }); // lowest stock first

    res.status(200).json({
      success: true,
      count: lowStock.length,
      products: lowStock,
    });
  } catch (error) {
    console.error("Low stock error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─── EXPORT ──────────────────────────────────
module.exports = {
  getDashboardSummary,
  getMonthlyRevenue,
  getWeeklyOrders,
  getTopProducts,
  getOrderStatusBreakdown,
  getLowStockProducts,
};
