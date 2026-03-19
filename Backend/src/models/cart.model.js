const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    qty: { type: Number, required: true, min: 1, default: 1 },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    price: { type: Number, required: true }, // locked price at time of adding
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
    },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
