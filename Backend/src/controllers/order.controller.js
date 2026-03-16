const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const storeModel = require("../models/store.model");

// ─────────────────────────────────────────────
// PLACE ORDER
// POST /api/orders
// Customer only
// ─────────────────────────────────────────────
const placeOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, couponCode, discount } =
      req.body;

    // 1. Only customer can place order
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can place orders",
      });
    }

    // 2. Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must have at least one item",
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required — razorpay or cod",
      });
    }

    // 3. Validate all products exist and have enough stock
    let totalAmount = 0;
    let storeId = null;

    for (const item of items) {
      const product = await productModel.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      // Use product's current price if item price not sent
      item.price = item.price || product.discountPrice || product.price;

      totalAmount += item.price * item.qty;

      // All items must be from same store
      if (!storeId) {
        storeId = product.store.toString();
      } else if (storeId !== product.store.toString()) {
        return res.status(400).json({
          success: false,
          message: "All items must be from the same store",
        });
      }
    }

    // 4. Apply discount if any
    const finalAmount = totalAmount - (discount || 0);

    // 5. Create order
    const order = await orderModel.create({
      customer: req.user.id,
      store: storeId,
      items,
      totalAmount: finalAmount > 0 ? finalAmount : totalAmount,
      status: "pending",
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "unpaid",
      deliveryAddress,
      couponCode: couponCode || "",
      discount: discount || 0,
    });

    // 6. Reduce stock for each item
    for (const item of items) {
      await productModel.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.qty } }, // reduce stock
      );
    }

    // 7. Populate and return
    const populatedOrder = await orderModel
      .findById(order._id)
      .populate("customer", "name email phone")
      .populate("store", "name logo address")
      .populate("items.product", "name images price");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Place order error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────
// GET MY ORDERS
// GET /api/orders/my
// Customer sees their own orders
// ─────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ customer: req.user.id })
      .populate("store", "name logo")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// GET STORE ORDERS
// GET /api/orders/store
// Store owner sees all orders for their store
// ─────────────────────────────────────────────
const getStoreOrders = async (req, res) => {
  try {
    // Only store_owner can see store orders
    if (req.user.role !== "store_owner") {
      return res.status(403).json({
        success: false,
        message: "Only store owners can view store orders",
      });
    }

    // Find owner's store
    const store = await storeModel.findOne({ owner: req.user.id });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store",
      });
    }

    const { status } = req.query;

    const filter = { store: store._id };
    if (status) filter.status = status;

    const orders = await orderModel
      .find(filter)
      .populate("customer", "name email phone")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get store orders error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// GET SINGLE ORDER
// GET /api/orders/:id
// ─────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("store", "name logo address")
      .populate("items.product", "name images price discountPrice");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only the customer or the store owner can see this order
    const isCustomer = order.customer._id.toString() === req.user.id;
    const store = await storeModel.findOne({ owner: req.user.id });
    const isOwner =
      store && store._id.toString() === order.store._id.toString();

    if (!isCustomer && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// Store owner only
// ─────────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // 1. Validate status value
    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // 2. Find order
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 3. Check store owner
    const store = await storeModel.findOne({ owner: req.user.id });
    if (!store || store._id.toString() !== order.store.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order",
      });
    }

    // 4. Update status
    const updatedOrder = await orderModel
      .findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate("customer", "name email phone")
      .populate("items.product", "name images price");

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// CANCEL ORDER
// PUT /api/orders/:id/cancel
// Customer cancels their own pending order
// ─────────────────────────────────────────────
const cancelOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only the customer who placed the order can cancel
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own orders",
      });
    }

    // Can only cancel pending orders
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Cancel order
    await orderModel.findByIdAndUpdate(req.params.id, { status: "cancelled" });

    // Restore stock for each item
    for (const item of order.items) {
      await productModel.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.qty } }, // restore stock
      );
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel order error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─── EXPORT ──────────────────────────────────
module.exports = {
  placeOrder,
  getMyOrders,
  getStoreOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
