import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api from "../../utils/api";
import "./Checkout.scss";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const { user } = useAuth();
  const { items, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    coupon,
    discountAmount = 0,
    deliveryCharge = 49,
  } = location.state || {};
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addressError, setAddressError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addrLoading, setAddrLoading] = useState(false);
  const orderTotal = cartSubtotal - discountAmount + deliveryCharge;

  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items]);
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress)
      setSelectedAddress(addresses[0]);
  }, [addresses]);

  const handleAddAddress = async () => {
    const { street, city, state, pincode } = newAddress;
    if (!street || !city || !state || !pincode) {
      setAddressError("All fields are required");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setAddressError("Enter a valid 6-digit pincode");
      return;
    }
    setAddrLoading(true);
    setAddressError("");
    try {
      const res = await api.post("/auth/address", newAddress);
      setAddresses(res.data.addresses);
      setSelectedAddress(res.data.addresses[res.data.addresses.length - 1]);
      setNewAddress({ street: "", city: "", state: "", pincode: "" });
      setShowAddressForm(false);
    } catch (err) {
      setAddressError(err?.response?.data?.message || "Failed to save address");
    } finally {
      setAddrLoading(false);
    }
  };

  const buildOrderItems = () =>
    items.map((i) => ({
      product: i.product._id,
      qty: i.qty,
      size: i.size,
      color: i.color,
      price: i.price,
    }));

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // COD: create order directly in DB
      if (paymentMethod === "cod") {
        const res = await api.post("/orders", {
          items: buildOrderItems(),
          deliveryAddress: {
            street: selectedAddress.street,
            city: selectedAddress.city,
            state: selectedAddress.state,
            pincode: selectedAddress.pincode,
          },
          paymentMethod: "cod",
          ...(coupon?.code && { couponCode: coupon.code }),
        });
        clearCart();
        navigate("/orders", {
          state: { newOrderId: res.data.order._id, method: "cod" },
        });
        return;
      }

      // Razorpay Step 1: create payment intent only (NO DB order yet)
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError("Payment gateway failed to load. Try again.");
        setLoading(false);
        return;
      }

      const intentRes = await api.post("/payment/create-intent", {
        amount: orderTotal,
      });

      const options = {
        key: intentRes.data.keyId,
        amount: intentRes.data.amount * 100,
        currency: intentRes.data.currency || "INR",
        name: "ClothMart",
        description: "Fashion order",
        order_id: intentRes.data.razorpayOrderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
        theme: { color: "#ffcf40" },

        // Razorpay Step 2: payment success → verify signature → THEN create DB order
        handler: async (response) => {
          try {
            const verifyRes = await api.post(
              "/payment/verify-and-create-order",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: buildOrderItems(),
                deliveryAddress: {
                  street: selectedAddress.street,
                  city: selectedAddress.city,
                  state: selectedAddress.state,
                  pincode: selectedAddress.pincode,
                },
                amount: orderTotal,
                ...(coupon?.code && { couponCode: coupon.code }),
              },
            );
            clearCart();
            navigate("/orders", {
              state: {
                newOrderId: verifyRes.data.order._id,
                method: "razorpay",
              },
            });
          } catch {
            setError(
              "Payment verification failed. Contact support with payment ID: " +
                response.razorpay_payment_id,
            );
            setLoading(false);
          }
        },

        // User closed popup — nothing saved in DB
        modal: {
          ondismiss: () => {
            setError("Payment cancelled. No amount was charged.");
            setLoading(false);
          },
        },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to place order. Try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <Link to="/cart" className="checkout-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Cart
          </Link>
          <h1 className="checkout-title">Checkout</h1>
        </div>
        <div className="checkout-layout">
          <div className="checkout-left">
            <div className="checkout-section">
              <div className="checkout-section__head">
                <h2 className="checkout-section__title">
                  <span className="checkout-section__num">1</span>Delivery
                  Address
                </h2>
                <button
                  className="checkout-section__add"
                  onClick={() => setShowAddressForm((v) => !v)}
                >
                  {showAddressForm ? "Cancel" : "+ Add New"}
                </button>
              </div>
              {showAddressForm && (
                <div className="checkout-addr-form">
                  <div className="checkout-addr-form__grid">
                    {[
                      {
                        key: "street",
                        label: "Street Address",
                        placeholder: "123, MG Road",
                        full: true,
                      },
                      { key: "city", label: "City", placeholder: "Mumbai" },
                      {
                        key: "state",
                        label: "State",
                        placeholder: "Maharashtra",
                      },
                      {
                        key: "pincode",
                        label: "Pincode",
                        placeholder: "400001",
                      },
                    ].map(({ key, label, placeholder, full }) => (
                      <div
                        key={key}
                        className={`checkout-addr-form__field${full ? " checkout-addr-form__field--full" : ""}`}
                      >
                        <label className="checkout-addr-form__label">
                          {label}
                        </label>
                        <input
                          className="checkout-addr-form__input"
                          placeholder={placeholder}
                          value={newAddress[key]}
                          onChange={(e) =>
                            setNewAddress((f) => ({
                              ...f,
                              [key]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  {addressError && (
                    <p className="checkout-error-text">{addressError}</p>
                  )}
                  <button
                    className={`checkout-addr-form__save${addrLoading ? " checkout-addr-form__save--loading" : ""}`}
                    onClick={handleAddAddress}
                    disabled={addrLoading}
                  >
                    {addrLoading ? "Saving…" : "Save Address"}
                  </button>
                </div>
              )}
              {addresses.length === 0 && !showAddressForm ? (
                <div className="checkout-no-addr">
                  <p>No saved addresses. Add one above to continue.</p>
                </div>
              ) : (
                <div className="checkout-addr-list">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`checkout-addr-card${selectedAddress?._id === addr._id ? " checkout-addr-card--selected" : ""}`}
                      onClick={() => setSelectedAddress(addr)}
                    >
                      <div className="checkout-addr-card__radio">
                        <div className="checkout-addr-card__dot" />
                      </div>
                      <div className="checkout-addr-card__body">
                        <p className="checkout-addr-card__street">
                          {addr.street}
                        </p>
                        <p className="checkout-addr-card__rest">
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="checkout-section">
              <h2 className="checkout-section__title">
                <span className="checkout-section__num">2</span>Payment Method
              </h2>
              <div className="checkout-payment-options">
                {[
                  {
                    value: "razorpay",
                    label: "Pay Online",
                    sub: "UPI, Cards, Net Banking, Wallets",
                    icon: "⚡",
                  },
                  {
                    value: "cod",
                    label: "Cash on Delivery",
                    sub: "Pay when your order arrives",
                    icon: "💵",
                  },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    className={`checkout-payment-opt${paymentMethod === opt.value ? " checkout-payment-opt--active" : ""}`}
                    onClick={() => setPaymentMethod(opt.value)}
                  >
                    <div className="checkout-payment-opt__radio">
                      <div className="checkout-payment-opt__dot" />
                    </div>
                    <span className="checkout-payment-opt__icon">
                      {opt.icon}
                    </span>
                    <div>
                      <p className="checkout-payment-opt__label">{opt.label}</p>
                      <p className="checkout-payment-opt__sub">{opt.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              {paymentMethod === "razorpay" && (
                <div className="checkout-payment-info">
                  🔒 Your order is only placed after successful payment. No
                  charge if you cancel.
                </div>
              )}
            </div>
          </div>
          <div className="checkout-right">
            <div className="checkout-summary">
              <h2 className="checkout-summary__title">Order Summary</h2>
              <div className="checkout-items">
                {items.map((item) => (
                  <div
                    key={`${item.product._id}-${item.size}-${item.color}`}
                    className="checkout-item"
                  >
                    <div className="checkout-item__img">
                      <img
                        src={item.product.images?.[0] || "/placeholder.jpg"}
                        alt={item.product.name}
                        loading="lazy"
                      />
                      <span className="checkout-item__qty">{item.qty}</span>
                    </div>
                    <div className="checkout-item__info">
                      <p className="checkout-item__name">{item.product.name}</p>
                      <p className="checkout-item__meta">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <span className="checkout-item__price">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="checkout-breakdown">
                <div className="checkout-breakdown__row">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="checkout-breakdown__row checkout-breakdown__row--discount">
                    <span>Discount {coupon?.code && `(${coupon.code})`}</span>
                    <span>− ₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="checkout-breakdown__row">
                  <span>Delivery</span>
                  <span
                    className={
                      deliveryCharge === 0 ? "checkout-breakdown__free" : ""
                    }
                  >
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="checkout-breakdown__divider" />
                <div className="checkout-breakdown__row checkout-breakdown__row--total">
                  <span>Total</span>
                  <span>₹{orderTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
              {error && (
                <div className="checkout-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="12"
                      y1="16"
                      x2="12.01"
                      y2="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {error}
                </div>
              )}
              <button
                className={`checkout-place-btn${loading ? " checkout-place-btn--loading" : ""}`}
                onClick={handlePlaceOrder}
                disabled={loading || addresses.length === 0}
              >
                {loading ? (
                  <>
                    <span className="checkout-spinner" />
                    Processing…
                  </>
                ) : paymentMethod === "cod" ? (
                  <>Place Order — ₹{orderTotal.toLocaleString("en-IN")}</>
                ) : (
                  <>Pay ₹{orderTotal.toLocaleString("en-IN")}</>
                )}
              </button>
              <p className="checkout-secure">
                🔒 Secured by Razorpay · SSL Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
