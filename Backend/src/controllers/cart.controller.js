const Cart = require("../models/cart.model");

// ─── Helper: find or create cart for user ─────────────────────────────────────
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name images price discountPrice store isActive",
  );
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

// ─────────────────────────────────────────────
// GET CART  —  GET /api/cart
// ─────────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);

    // Filter out items whose product was soft-deleted
    const activeItems = cart.items.filter(
      (i) => i.product && i.product.isActive !== false,
    );

    res.status(200).json({ success: true, items: activeItems });
  } catch (err) {
    console.error("Get cart error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// ADD / UPDATE ITEM  —  POST /api/cart/add
// Body: { productId, qty, size, color, price }
// ─────────────────────────────────────────────
const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1, size = "", color = "", price } = req.body;

    if (!productId || !price) {
      return res
        .status(400)
        .json({ success: false, message: "productId and price are required" });
    }

    const cart = await getOrCreateCart(req.user.id);

    const existingIndex = cart.items.findIndex(
      (i) =>
        i.product._id.toString() === productId &&
        i.size === size &&
        i.color === color,
    );

    if (existingIndex > -1) {
      // Already in cart → increment qty
      cart.items[existingIndex].qty += qty;
    } else {
      // New item
      cart.items.push({ product: productId, qty, size, color, price });
    }

    await cart.save();

    // Re-populate for response
    await cart.populate(
      "items.product",
      "name images price discountPrice store isActive",
    );

    res.status(200).json({ success: true, items: cart.items });
  } catch (err) {
    console.error("Add to cart error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// UPDATE QTY  —  PUT /api/cart/update
// Body: { productId, size, color, qty }
// ─────────────────────────────────────────────
const updateCartItem = async (req, res) => {
  try {
    const { productId, size = "", color = "", qty } = req.body;

    if (!productId || qty === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "productId and qty are required" });
    }

    const cart = await getOrCreateCart(req.user.id);

    if (qty < 1) {
      // Remove item if qty drops below 1
      cart.items = cart.items.filter(
        (i) =>
          !(
            i.product._id.toString() === productId &&
            i.size === size &&
            i.color === color
          ),
      );
    } else {
      const item = cart.items.find(
        (i) =>
          i.product._id.toString() === productId &&
          i.size === size &&
          i.color === color,
      );
      if (item) item.qty = qty;
    }

    await cart.save();
    await cart.populate(
      "items.product",
      "name images price discountPrice store isActive",
    );

    res.status(200).json({ success: true, items: cart.items });
  } catch (err) {
    console.error("Update cart error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// REMOVE ITEM  —  DELETE /api/cart/remove
// Body: { productId, size, color }
// ─────────────────────────────────────────────
const removeFromCart = async (req, res) => {
  try {
    const { productId, size = "", color = "" } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });
    }

    const cart = await getOrCreateCart(req.user.id);

    cart.items = cart.items.filter(
      (i) =>
        !(
          i.product._id.toString() === productId &&
          i.size === size &&
          i.color === color
        ),
    );

    await cart.save();
    await cart.populate(
      "items.product",
      "name images price discountPrice store isActive",
    );

    res.status(200).json({ success: true, items: cart.items });
  } catch (err) {
    console.error("Remove from cart error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// CLEAR CART  —  DELETE /api/cart/clear
// ─────────────────────────────────────────────
const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    cart.items = [];
    await cart.save();
    res.status(200).json({ success: true, items: [] });
  } catch (err) {
    console.error("Clear cart error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// SYNC CART  —  POST /api/cart/sync
// Merges localStorage items into DB cart on login
// Body: { items: [...cartItems] }
// ─────────────────────────────────────────────
const syncCart = async (req, res) => {
  try {
    const { items: localItems = [] } = req.body;

    const cart = await getOrCreateCart(req.user.id);

    // Merge: local items take priority, DB items fill the rest
    localItems.forEach((local) => {
      const existingIndex = cart.items.findIndex(
        (i) =>
          i.product._id.toString() === local.product._id &&
          i.size === local.size &&
          i.color === local.color,
      );
      if (existingIndex > -1) {
        // Local qty wins
        cart.items[existingIndex].qty = local.qty;
      } else {
        cart.items.push({
          product: local.product._id,
          qty: local.qty,
          size: local.size,
          color: local.color,
          price: local.price,
        });
      }
    });

    await cart.save();
    await cart.populate(
      "items.product",
      "name images price discountPrice store isActive",
    );

    res.status(200).json({ success: true, items: cart.items });
  } catch (err) {
    console.error("Sync cart error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
};
