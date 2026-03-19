import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../utils/api";
import "./Orders.scss";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  pending: { label: "Pending", color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  confirmed: {
    label: "Confirmed",
    color: "#2563eb",
    bg: "rgba(37,99,235,0.1)",
  },
  shipped: { label: "Shipped", color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
  delivered: {
    label: "Delivered",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.1)",
  },
  cancelled: {
    label: "Cancelled",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.1)",
  },
};

const PAYMENT_STATUS = {
  pending: { label: "Unpaid", color: "#d97706" },
  paid: { label: "Paid", color: "#16a34a" },
  failed: { label: "Failed", color: "#dc2626" },
};

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ order, isNew }) {
  const [open, setOpen] = useState(isNew);
  const s = STATUS[order.status] || STATUS.pending;
  const ps = PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS.pending;
  const total = order.items?.reduce((sum, i) => sum + i.price * i.qty, 0) || 0;

  return (
    <div className={`order-card${isNew ? " order-card--new" : ""}`}>
      {/* Card Header */}
      <div className="order-card__head" onClick={() => setOpen((v) => !v)}>
        <div className="order-card__head-left">
          <div>
            <p className="order-card__id">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="order-card__date">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="order-card__badges">
            <span
              className="order-card__status"
              style={{ color: s.color, background: s.bg }}
            >
              {s.label}
            </span>
            <span className="order-card__payment" style={{ color: ps.color }}>
              {order.paymentMethod === "cod" ? "COD" : ps.label}
            </span>
          </div>
        </div>

        <div className="order-card__head-right">
          <span className="order-card__total">
            ₹{total.toLocaleString("en-IN")}
          </span>
          <span
            className={`order-card__chevron${open ? " order-card__chevron--open" : ""}`}
          >
            ▾
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {open && (
        <div className="order-card__body">
          {/* Progress tracker */}
          {order.status !== "cancelled" && (
            <div className="order-progress">
              {["pending", "confirmed", "shipped", "delivered"].map(
                (step, i) => {
                  const steps = [
                    "pending",
                    "confirmed",
                    "shipped",
                    "delivered",
                  ];
                  const currentIdx = steps.indexOf(order.status);
                  const isDone = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step} className="order-progress__step">
                      <div
                        className={`order-progress__dot${isDone ? " order-progress__dot--done" : ""}${isCurrent ? " order-progress__dot--current" : ""}`}
                      >
                        {isDone && !isCurrent && "✓"}
                      </div>
                      <span
                        className={`order-progress__label${isCurrent ? " order-progress__label--current" : ""}`}
                      >
                        {STATUS[step].label}
                      </span>
                      {i < 3 && (
                        <div
                          className={`order-progress__line${isDone && i < currentIdx ? " order-progress__line--done" : ""}`}
                        />
                      )}
                    </div>
                  );
                },
              )}
            </div>
          )}

          {/* Items */}
          <div className="order-items">
            {order.items?.map((item, i) => (
              <div key={i} className="order-item">
                <div className="order-item__img">
                  <img
                    src={item.product?.images?.[0] || "/placeholder.jpg"}
                    alt={item.product?.name}
                    loading="lazy"
                  />
                </div>
                <div className="order-item__info">
                  <p className="order-item__name">
                    {item.product?.name || "Product"}
                  </p>
                  <p className="order-item__meta">
                    {[item.size, item.color, `Qty: ${item.qty}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <span className="order-item__price">
                  ₹{(item.price * item.qty).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery address */}
          {order.deliveryAddress && (
            <div className="order-addr">
              <p className="order-addr__label">📍 Delivery Address</p>
              <p className="order-addr__text">
                {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
              </p>
            </div>
          )}

          {/* Footer: total */}
          <div className="order-card__foot">
            <span className="order-card__foot-label">Order Total</span>
            <span className="order-card__foot-total">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="order-card__track">
            <Link
              to={`/track-order?id=${order._id}`}
              className="order-card__track-btn"
              onClick={(e) => e.stopPropagation()}
            >
              🔍 Track this order →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Orders() {
  const location = useLocation();
  const newOrderId = location.state?.newOrderId;
  const newOrderMethod = location.state?.method;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // 🔁 GET /orders/my
        const res = await api.get("/orders/my");
        setOrders(res.data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Success banner for new order */}
        {newOrderId && (
          <div className="orders-success-banner">
            <span className="orders-success-banner__icon">🎉</span>
            <div>
              <p className="orders-success-banner__title">
                {newOrderMethod === "cod"
                  ? "Order placed successfully!"
                  : "Payment successful! Order confirmed!"}
              </p>
              <p className="orders-success-banner__sub">
                Your order #{newOrderId.slice(-8).toUpperCase()} has been
                placed.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="orders-header">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-sub">
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link to="/products" className="orders-shop-btn">
            Continue Shopping
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="orders-filters">
          {[
            "all",
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
          ].map((f) => (
            <button
              key={f}
              className={`orders-filter${filter === f ? " orders-filter--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : STATUS[f]?.label}
              {f !== "all" && (
                <span className="orders-filter__count">
                  {orders.filter((o) => o.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="orders-list">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="order-shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty__icon">📦</div>
            <h2 className="orders-empty__title">
              {filter === "all" ? "No orders yet" : `No ${filter} orders`}
            </h2>
            <p className="orders-empty__sub">
              {filter === "all"
                ? "Start shopping to see your orders here!"
                : "Try a different filter."}
            </p>
            {filter === "all" && (
              <Link to="/products" className="orders-empty__btn">
                Browse Products
              </Link>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {filtered.map((order, i) => (
              <div key={order._id} style={{ animationDelay: `${i * 0.06}s` }}>
                <OrderCard order={order} isNew={order._id === newOrderId} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
