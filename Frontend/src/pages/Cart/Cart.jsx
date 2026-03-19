import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api from "../../utils/api";
import "./Cart.scss";

// ─── Icons ────────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <polyline
      points="3 6 5 6 21 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11v6M14 11v6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const TagIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

const EmptyCartIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Cart Item ────────────────────────────────────────────────────────────────
function CartItem({ item, onRemove, onQtyChange }) {
  const { product, qty, size, color, price } = item;
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(product._id, size, color), 300);
  };

  return (
    <div className={`cart-item${removing ? " cart-item--removing" : ""}`}>
      {/* Product image */}
      <div className="cart-item__img-wrap">
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="cart-item__img"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="cart-item__body">
        <div className="cart-item__top">
          <div>
            <p className="cart-item__store">{product.store?.name}</p>
            <h3 className="cart-item__name">{product.name}</h3>
            <div className="cart-item__meta">
              {size && <span className="cart-item__tag">Size: {size}</span>}
              {color && <span className="cart-item__tag">Color: {color}</span>}
            </div>
          </div>

          {/* Price */}
          <div className="cart-item__price-col">
            <span className="cart-item__price">
              ₹{(price * qty).toLocaleString("en-IN")}
            </span>
            {qty > 1 && (
              <span className="cart-item__unit-price">
                ₹{price.toLocaleString("en-IN")} each
              </span>
            )}
          </div>
        </div>

        {/* Bottom row: qty + remove */}
        <div className="cart-item__foot">
          <div className="cart-qty">
            <button
              className="cart-qty__btn"
              onClick={() => onQtyChange(product._id, size, color, qty - 1)}
              aria-label="Decrease quantity"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <span className="cart-qty__val">{qty}</span>
            <button
              className="cart-qty__btn"
              onClick={() => onQtyChange(product._id, size, color, qty + 1)}
              aria-label="Increase quantity"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <line
                  x1="12"
                  y1="5"
                  x2="12"
                  y2="19"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <button className="cart-item__remove" onClick={handleRemove}>
            <TrashIcon />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Cart() {
  const { isAuthenticated } = useAuth();
  const { items, cartSubtotal, removeFromCart, updateQty, clearCart } =
    useCart();
  const navigate = useNavigate();

  // ── Redirect to login if not authenticated ──────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="cart-gate">
        <div className="cart-gate__inner">
          <div className="cart-gate__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M7 11V7a5 5 0 0 1 10 0v4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="cart-gate__title">Sign in to view your cart</h2>
          <p className="cart-gate__sub">
            Your cart items are saved. Log in to continue shopping.
          </p>
          <Link
            to="/login"
            state={{ from: { pathname: "/cart" } }}
            className="cart-gate__btn"
          >
            Sign In to Continue
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <p className="cart-gate__register">
            New here?{" "}
            <Link to="/register" className="cart-gate__link">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty__inner">
          <div className="cart-empty__icon">
            <EmptyCartIcon />
          </div>
          <h2 className="cart-empty__title">Your cart is empty</h2>
          <p className="cart-empty__sub">
            Looks like you haven't added anything yet. Browse our stores and
            find something you love!
          </p>
          <Link to="/products" className="cart-empty__btn">
            Start Shopping
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CartContent
      items={items}
      cartSubtotal={cartSubtotal}
      removeFromCart={removeFromCart}
      updateQty={updateQty}
      clearCart={clearCart}
      navigate={navigate}
    />
  );
}

// ─── Cart Content (only shown when authenticated + has items) ─────────────────
function CartContent({
  items,
  cartSubtotal,
  removeFromCart,
  updateQty,
  clearCart,
  navigate,
}) {
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountType, discountValue }
  const [clearConfirm, setClearConfirm] = useState(false);

  const DELIVERY_CHARGE = cartSubtotal >= 999 ? 0 : 49;

  // ── Discount calculation ────────────────────────────────────────────────────
  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "percent"
      ? Math.round((cartSubtotal * appliedCoupon.discountValue) / 100)
      : appliedCoupon.discountValue
    : 0;

  const orderTotal = cartSubtotal - discountAmount + DELIVERY_CHARGE;

  // ── Apply coupon ────────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    try {
      // Use the storeId from the first cart item for validation
      const storeId = items[0]?.product?.store?._id;
      const res = await api.post("/coupons/validate", {
        code,
        orderAmount: cartSubtotal,
        storeId,
      });
      if (res.data.success) {
        setAppliedCoupon({
          code,
          discountType: res.data.coupon.discountType,
          discountValue: res.data.coupon.discountValue,
        });
        setCouponCode("");
      }
    } catch (err) {
      setCouponError(
        err?.response?.data?.message || "Invalid or expired coupon code",
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        coupon: appliedCoupon,
        discountAmount,
        orderTotal,
        deliveryCharge: DELIVERY_CHARGE,
      },
    });
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="cart-header">
          <div>
            <h1 className="cart-header__title">Your Cart</h1>
            <p className="cart-header__count">
              {items.reduce((s, i) => s + i.qty, 0)} item
              {items.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            className="cart-header__clear"
            onClick={() => setClearConfirm(true)}
          >
            Clear cart
          </button>
        </div>

        {/* ── Clear confirm banner ────────────────────────────────────────── */}
        {clearConfirm && (
          <div className="cart-confirm">
            <span>Remove all items from your cart?</span>
            <div className="cart-confirm__actions">
              <button
                className="cart-confirm__btn cart-confirm__btn--yes"
                onClick={() => {
                  clearCart();
                  setClearConfirm(false);
                }}
              >
                Yes, clear
              </button>
              <button
                className="cart-confirm__btn"
                onClick={() => setClearConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="cart-layout">
          {/* ── Left: Items ──────────────────────────────────────────────── */}
          <div className="cart-items">
            {items.map((item, i) => (
              <CartItem
                key={`${item.product._id}-${item.size}-${item.color}`}
                item={item}
                onRemove={removeFromCart}
                onQtyChange={updateQty}
                style={{ animationDelay: `${i * 0.07}s` }}
              />
            ))}

            {/* Continue shopping */}
            <Link to="/products" className="cart-continue">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 12H5M12 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* ── Right: Summary ───────────────────────────────────────────── */}
          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>

            {/* Coupon */}
            <div className="cart-coupon">
              <div className="cart-coupon__label">
                <TagIcon />
                Coupon Code
              </div>

              {appliedCoupon ? (
                <div className="cart-coupon__applied">
                  <span className="cart-coupon__applied-badge">
                    <CheckIcon />
                    {appliedCoupon.code}
                  </span>
                  <span className="cart-coupon__applied-save">
                    Saving ₹{discountAmount.toLocaleString("en-IN")}
                  </span>
                  <button
                    className="cart-coupon__remove"
                    onClick={removeCoupon}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-coupon__row">
                    <input
                      className={`cart-coupon__input${couponError ? " cart-coupon__input--error" : ""}`}
                      type="text"
                      placeholder="Enter code (e.g. SAVE20)"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                    />
                    <button
                      className={`cart-coupon__apply${couponLoading ? " cart-coupon__apply--loading" : ""}`}
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      {couponLoading ? (
                        <span className="cart-spinner" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                  {couponError && (
                    <span className="cart-coupon__error">{couponError}</span>
                  )}
                </>
              )}
            </div>

            {/* Price breakdown */}
            <div className="cart-breakdown">
              <div className="cart-breakdown__row">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
              </div>

              {appliedCoupon && (
                <div className="cart-breakdown__row cart-breakdown__row--discount">
                  <span>
                    Discount
                    <em className="cart-breakdown__tag">
                      {appliedCoupon.discountType === "percent"
                        ? `${appliedCoupon.discountValue}% off`
                        : `Flat ₹${appliedCoupon.discountValue} off`}
                    </em>
                  </span>
                  <span>− ₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="cart-breakdown__row">
                <span>Delivery</span>
                <span
                  className={
                    DELIVERY_CHARGE === 0 ? "cart-breakdown__free" : ""
                  }
                >
                  {DELIVERY_CHARGE === 0 ? "FREE" : `₹${DELIVERY_CHARGE}`}
                </span>
              </div>

              {DELIVERY_CHARGE > 0 && (
                <p className="cart-breakdown__free-hint">
                  Add ₹{(999 - cartSubtotal).toLocaleString("en-IN")} more for
                  free delivery
                </p>
              )}

              <div className="cart-breakdown__divider" />

              <div className="cart-breakdown__row cart-breakdown__row--total">
                <span>Total</span>
                <span>₹{orderTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button className="cart-checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Trust badges */}
            <div className="cart-trust">
              {[
                { icon: "🔒", text: "Secure checkout" },
                { icon: "↩️", text: "Easy returns" },
                { icon: "⚡", text: "Fast delivery" },
              ].map((b) => (
                <div key={b.text} className="cart-trust__item">
                  <span>{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
