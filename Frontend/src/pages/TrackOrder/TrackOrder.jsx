import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "./TrackOrder.scss";

// ─── Status config ────────────────────────────────────────────────────────────
const STEPS = [
  {
    key: "pending",
    label: "Order Placed",
    icon: "📋",
    desc: "Your order has been placed and is awaiting confirmation.",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: "✅",
    desc: "The store has confirmed your order and is preparing it.",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: "🚚",
    desc: "Your order is on the way to your delivery address.",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: "🎉",
    desc: "Your order has been delivered successfully.",
  },
];

const STATUS_INDEX = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

// ─── Timeline Step ────────────────────────────────────────────────────────────
function TimelineStep({ step, index, currentIndex, order }) {
  const isDone = index < currentIndex;
  const isCurrent = index === currentIndex;
  const isPending = index > currentIndex;

  // Approximate timestamps based on order dates
  const getTimestamp = () => {
    if (!isDone && !isCurrent) return null;
    if (index === 0) return order.createdAt;
    if (index === 1 && order.confirmedAt) return order.confirmedAt;
    if (index === 2 && order.shippedAt) return order.shippedAt;
    if (index === 3 && order.deliveredAt) return order.deliveredAt;
    return null;
  };

  const ts = getTimestamp();

  return (
    <div
      className={`track-step${isDone ? " track-step--done" : ""}${isCurrent ? " track-step--current" : ""}${isPending ? " track-step--pending" : ""}`}
    >
      {/* Connector line */}
      {index < STEPS.length - 1 && (
        <div
          className={`track-step__line${isDone ? " track-step__line--done" : ""}`}
        />
      )}

      {/* Icon */}
      <div className="track-step__icon-wrap">
        <div className="track-step__icon">{isDone ? "✓" : step.icon}</div>
      </div>

      {/* Content */}
      <div className="track-step__content">
        <p className="track-step__label">{step.label}</p>
        <p className="track-step__desc">{step.desc}</p>
        {ts && (
          <p className="track-step__time">
            {new Date(ts).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TrackOrder() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Auto-search if id in URL
  useState(() => {
    if (searchParams.get("id")) handleTrack(searchParams.get("id"));
  });

  async function handleTrack(id) {
    const trackId = (id || orderId).trim();
    if (!trackId) {
      setError("Please enter an Order ID");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(false);
    try {
      const res = await api.get(`/orders/${trackId}`);
      setOrder(res.data.order);
      setSearched(true);
    } catch (err) {
      setError(
        err?.response?.status === 404
          ? "No order found with this ID. Please check and try again."
          : err?.response?.status === 403
            ? "You are not authorized to track this order."
            : "Something went wrong. Please try again.",
      );
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="track-gate">
        <div className="track-gate__inner">
          <div className="track-gate__icon">🔒</div>
          <h2 className="track-gate__title">Sign in to track your order</h2>
          <p className="track-gate__sub">
            You need to be logged in to track your orders.
          </p>
          <Link
            to="/login"
            state={{ from: { pathname: "/track-order" } }}
            className="track-gate__btn"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = order ? STATUS_INDEX[order.status] : -1;
  const isCancelled = order?.status === "cancelled";
  const orderTotal =
    order?.items?.reduce((s, i) => s + i.price * i.qty, 0) || 0;

  return (
    <div className="track-page">
      <div className="track-container">
        {/* Header */}
        <div className="track-header">
          <Link to="/orders" className="track-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            My Orders
          </Link>
          <div>
            <h1 className="track-title">Track Your Order</h1>
            <p className="track-sub">Enter your order ID to get live updates</p>
          </div>
        </div>

        {/* Search box */}
        <div className="track-search">
          <div className="track-search__wrap">
            <svg
              className="track-search__icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m21 21-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              className="track-search__input"
              type="text"
              placeholder="Paste your Order ID here…"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            />
            {orderId && (
              <button
                className="track-search__clear"
                onClick={() => {
                  setOrderId("");
                  setOrder(null);
                  setError("");
                  setSearched(false);
                }}
              >
                ×
              </button>
            )}
          </div>
          <button
            className={`track-search__btn${loading ? " track-search__btn--loading" : ""}`}
            onClick={() => handleTrack()}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="track-spinner" />
                Tracking…
              </>
            ) : (
              "Track Order"
            )}
          </button>
        </div>

        {/* Hint: link to orders page */}
        <p className="track-hint">
          Don't know your order ID?{" "}
          <Link to="/orders" className="track-hint__link">
            View all your orders →
          </Link>
        </p>

        {/* Error */}
        {error && searched && (
          <div className="track-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Order found */}
        {order && (
          <div className="track-result">
            {/* Order info bar */}
            <div className="track-info-bar">
              <div className="track-info-bar__left">
                <p className="track-info-bar__id">
                  Order #{order._id.slice(-10).toUpperCase()}
                </p>
                <p className="track-info-bar__date">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="track-info-bar__right">
                <span
                  className={`track-status-badge track-status-badge--${order.status}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span
                  className={`track-payment-badge${order.paymentMethod === "cod" ? " track-payment-badge--cod" : " track-payment-badge--paid"}`}
                >
                  {order.paymentMethod === "cod"
                    ? "💵 Cash on Delivery"
                    : "⚡ Paid Online"}
                </span>
              </div>
            </div>

            {/* Cancelled state */}
            {isCancelled && (
              <div className="track-cancelled">
                <span className="track-cancelled__icon">❌</span>
                <div>
                  <p className="track-cancelled__title">Order Cancelled</p>
                  <p className="track-cancelled__sub">
                    This order has been cancelled. If you paid online, a refund
                    will be processed within 5–7 business days.
                  </p>
                </div>
              </div>
            )}

            {/* Timeline */}
            {!isCancelled && (
              <div className="track-timeline">
                <h2 className="track-section-title">📦 Order Progress</h2>
                <div className="track-steps">
                  {STEPS.map((step, i) => (
                    <TimelineStep
                      key={step.key}
                      step={step}
                      index={i}
                      currentIndex={currentIndex}
                      order={order}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="track-details-grid">
              {/* Store (Seller) Info */}
              <div className="track-card">
                <h2 className="track-card__title">🏪 Sold By</h2>
                <div className="track-store">
                  {order.store?.logo && (
                    <img
                      src={order.store.logo}
                      alt={order.store.name}
                      className="track-store__logo"
                    />
                  )}
                  <div>
                    <p className="track-store__name">
                      {order.store?.name || "ClothMart Store"}
                    </p>
                    {order.store?.address?.city && (
                      <p className="track-store__location">
                        📍 {order.store.address.city},{" "}
                        {order.store.address.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="track-card">
                <h2 className="track-card__title">📍 Deliver To</h2>
                <div className="track-address">
                  <p className="track-address__name">{order.customer?.name}</p>
                  <p className="track-address__street">
                    {order.deliveryAddress?.street}
                  </p>
                  <p className="track-address__rest">
                    {order.deliveryAddress?.city},{" "}
                    {order.deliveryAddress?.state} —{" "}
                    {order.deliveryAddress?.pincode}
                  </p>
                  {order.customer?.phone && (
                    <p className="track-address__phone">
                      📞 {order.customer.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="track-card">
              <h2 className="track-card__title">🛍️ Items Ordered</h2>
              <div className="track-items">
                {order.items?.map((item, i) => (
                  <div key={i} className="track-item">
                    <div className="track-item__img">
                      <img
                        src={item.product?.images?.[0] || "/placeholder.jpg"}
                        alt={item.product?.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="track-item__info">
                      <p className="track-item__name">
                        {item.product?.name || "Product"}
                      </p>
                      <p className="track-item__meta">
                        {[
                          item.size && `Size: ${item.size}`,
                          item.color && `Color: ${item.color}`,
                          `Qty: ${item.qty}`,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="track-item__price">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price summary */}
              <div className="track-price-summary">
                <div className="track-price-row">
                  <span>Items Total</span>
                  <span>₹{orderTotal.toLocaleString("en-IN")}</span>
                </div>
                {order.discount > 0 && (
                  <div className="track-price-row track-price-row--discount">
                    <span>
                      Discount {order.couponCode && `(${order.couponCode})`}
                    </span>
                    <span>− ₹{order.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="track-price-row track-price-row--total">
                  <span>
                    Total{" "}
                    {order.paymentMethod === "cod"
                      ? "(Pay on delivery)"
                      : "(Paid)"}
                  </span>
                  <span>
                    ₹{(order.totalAmount || orderTotal).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Need help */}
            <div className="track-help">
              <span className="track-help__icon">💬</span>
              <div>
                <p className="track-help__title">Need help with this order?</p>
                <p className="track-help__sub">
                  Contact the store directly or reach out to ClothMart support.
                </p>
              </div>
              <Link to="/orders" className="track-help__btn">
                View All Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
