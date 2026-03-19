import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "./Dashboard.scss";

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  pending: { color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  confirmed: { color: "#2563eb", bg: "rgba(37,99,235,0.1)" },
  shipped: { color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
  delivered: { color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  cancelled: { color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
};

const TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "products", label: "Products", icon: "👕" },
  { key: "orders", label: "Orders", icon: "📦" },
  { key: "coupons", label: "Coupons", icon: "🏷️" },
  { key: "store", label: "My Store", icon: "🏪" },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, highlight }) {
  return (
    <div className={`dash-stat${highlight ? " dash-stat--highlight" : ""}`}>
      <div className="dash-stat__icon">{icon}</div>
      <div>
        <p className="dash-stat__value">{value}</p>
        <p className="dash-stat__label">{label}</p>
        {sub && <p className="dash-stat__sub">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [store, setStore] = useState(null);
  const [storeLoading, setStoreLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "store_owner") navigate("/");
  }, [user]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await api.get("/stores/my");
        setStore(res.data.store);
      } catch {
      } finally {
        setStoreLoading(false);
      }
    };
    fetchStore();
  }, []);

  if (storeLoading)
    return (
      <div className="dash-loading">
        <div className="dash-loading__inner">
          <span className="dash-loading__spinner" />
          <p>Loading your dashboard…</p>
        </div>
      </div>
    );

  if (!store)
    return (
      <div className="dash-no-store">
        <div className="dash-no-store__inner">
          <div className="dash-no-store__icon">🏪</div>
          <h2 className="dash-no-store__title">No store found</h2>
          <p className="dash-no-store__sub">You don't have a store yet.</p>
          <Link to="/register" className="dash-no-store__btn">
            Create a Store
          </Link>
        </div>
      </div>
    );

  return (
    <div className="dash-page">
      <div className="dash-container">
        {/* Header */}
        <div className="dash-header">
          <div className="dash-header__left">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                className="dash-header__logo"
              />
            ) : (
              <div className="dash-header__logo-placeholder">
                {store.name?.[0]}
              </div>
            )}
            <div>
              <p className="dash-header__greeting">
                Welcome back, {user?.name?.split(" ")[0]}!
              </p>
              <h1 className="dash-header__store">{store.name}</h1>
            </div>
          </div>
          <div className="dash-header__badges">
            <span
              className={`dash-header__badge${store.isVerified ? " dash-header__badge--verified" : ""}`}
            >
              {store.isVerified ? "✓ Verified" : "⏳ Pending Review"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="dash-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`dash-tab${activeTab === t.key ? " dash-tab--active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="dash-content">
          {activeTab === "overview" && <OverviewTab store={store} />}
          {activeTab === "products" && <ProductsTab store={store} />}
          {activeTab === "coupons" && <CouponsTab store={store} />}
          {activeTab === "orders" && <OrdersTab store={store} />}
          {activeTab === "store" && (
            <StoreTab store={store} setStore={setStore} />
          )}
        </div>
      </div>
    </div>
  );
}

function CouponsTab({ store }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minOrderAmount: "",
    expiresAt: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/coupons");
      setCoupons(res.data.coupons || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.code || !form.discountValue) {
      setFormError("Code and discount value are required");
      return;
    }
    setFormLoading(true);
    setFormError("");
    try {
      await api.post("/coupons", {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        expiresAt: form.expiresAt || null,
      });
      setForm({
        code: "",
        discountType: "percent",
        discountValue: "",
        minOrderAmount: "",
        expiresAt: "",
      });
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Failed to create coupon");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch {}
  };

  return (
    <div className="dash-panel">
      <div className="dash-panel__head">
        <div>
          <h2 className="dash-panel__title">Coupons</h2>
          <p className="dash-panel__sub">
            {coupons.length} active coupon{coupons.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="dash-add-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ New Coupon"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="dash-product-form">
          <h3 className="dash-product-form__title">Create Coupon</h3>
          <div className="dash-form-grid">
            <div className="dash-form-field">
              <label className="dash-form-field__label">Coupon Code *</label>
              <input
                className="dash-form-field__input"
                placeholder="e.g. SAVE20"
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
              />
            </div>

            <div className="dash-form-field">
              <label className="dash-form-field__label">Discount Type *</label>
              <select
                className="dash-form-field__input"
                value={form.discountType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountType: e.target.value }))
                }
              >
                <option value="percent">Percent (%) off</option>
                <option value="flat">Flat (₹) off</option>
              </select>
            </div>

            <div className="dash-form-field">
              <label className="dash-form-field__label">
                Discount Value *{" "}
                {form.discountType === "percent" ? "(%)" : "(₹)"}
              </label>
              <input
                className="dash-form-field__input"
                type="number"
                placeholder={
                  form.discountType === "percent" ? "e.g. 20" : "e.g. 100"
                }
                value={form.discountValue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountValue: e.target.value }))
                }
              />
            </div>

            <div className="dash-form-field">
              <label className="dash-form-field__label">
                Min Order Amount (₹)
              </label>
              <input
                className="dash-form-field__input"
                type="number"
                placeholder="e.g. 500 (optional)"
                value={form.minOrderAmount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, minOrderAmount: e.target.value }))
                }
              />
            </div>

            <div className="dash-form-field">
              <label className="dash-form-field__label">
                Expires At (optional)
              </label>
              <input
                className="dash-form-field__input"
                type="date"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expiresAt: e.target.value }))
                }
              />
            </div>
          </div>

          {formError && <p className="dash-form-error">{formError}</p>}

          <div className="dash-form-actions">
            <button
              className="dash-form-actions__cancel"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button
              className={`dash-form-actions__save${formLoading ? " dash-form-actions__save--loading" : ""}`}
              onClick={handleCreate}
              disabled={formLoading}
            >
              {formLoading ? "Creating…" : "Create Coupon"}
            </button>
          </div>
        </div>
      )}

      {/* Coupons list */}
      {loading ? (
        <div className="dash-shimmer" />
      ) : coupons.length === 0 ? (
        <div className="dash-empty">
          <p>No coupons yet. Create one to offer discounts to customers!</p>
        </div>
      ) : (
        <div className="dash-coupons-list">
          {coupons.map((coupon) => {
            const isExpired =
              coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
            return (
              <div
                key={coupon._id}
                className={`dash-coupon-card${isExpired ? " dash-coupon-card--expired" : ""}`}
              >
                <div className="dash-coupon-card__left">
                  <div className="dash-coupon-card__icon">🏷️</div>
                  <div>
                    <p className="dash-coupon-card__code">{coupon.code}</p>
                    <p className="dash-coupon-card__details">
                      {coupon.discountType === "percent"
                        ? `${coupon.discountValue}% off`
                        : `₹${coupon.discountValue} off`}
                      {coupon.minOrderAmount > 0 &&
                        ` · Min order ₹${coupon.minOrderAmount}`}
                    </p>
                  </div>
                </div>
                <div className="dash-coupon-card__right">
                  {coupon.expiresAt && (
                    <span
                      className={`dash-coupon-card__expiry${isExpired ? " dash-coupon-card__expiry--expired" : ""}`}
                    >
                      {isExpired
                        ? "Expired"
                        : `Expires ${new Date(coupon.expiresAt).toLocaleDateString("en-IN")}`}
                    </span>
                  )}
                  <button
                    className="dash-coupon-card__delete"
                    onClick={() => handleDelete(coupon._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ store }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/analytics/summary");
        setAnalytics(res.data.summary);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading)
    return (
      <div className="dash-panel">
        <div className="dash-shimmer" />
      </div>
    );

  return (
    <div className="dash-panel">
      <h2 className="dash-panel__title">Store Overview</h2>

      <div className="dash-stats-grid">
        <StatCard
          icon="🛍️"
          label="Today's Orders"
          value={analytics?.todayOrders ?? 0}
          sub="New orders today"
          highlight
        />
        <StatCard
          icon="💰"
          label="Today's Revenue"
          value={`₹${(analytics?.todayRevenue ?? 0).toLocaleString("en-IN")}`}
          sub="Earned today"
        />
        <StatCard
          icon="📦"
          label="Total Orders"
          value={analytics?.totalOrders ?? 0}
          sub="All time"
        />
        <StatCard
          icon="💵"
          label="Total Revenue"
          value={`₹${(analytics?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
          sub="All time"
        />
      </div>

      {analytics?.lowStockProducts?.length > 0 && (
        <div className="dash-alert">
          <span className="dash-alert__icon">⚠️</span>
          <div>
            <p className="dash-alert__title">Low Stock Warning</p>
            <p className="dash-alert__sub">
              {analytics.lowStockProducts.map((p) => p.name).join(", ")} —
              restock soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
function ProductsTab({ store }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "Saree",
    sizes: "",
    colors: "",
    stock: "",
  });
  const [images, setImages] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: { store: store._id, limit: 50 },
      });
      setProducts(res.data.products || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm({
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "Saree",
      sizes: "",
      colors: "",
      stock: "",
    });
    setImages([]);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      discountPrice: p.discountPrice || "",
      category: p.category,
      sizes: p.sizes?.join(", ") || "",
      colors: p.colors?.join(", ") || "",
      stock: p.stock,
    });
    setImages([]);
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      setFormError("Name, price and stock are required");
      return;
    }
    setFormLoading(true);
    setFormError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      if (form.discountPrice) fd.append("discountPrice", form.discountPrice);
      fd.append("category", form.category);
      fd.append("stock", form.stock);
      fd.append(
        "sizes",
        JSON.stringify(
          form.sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        ),
      );
      fd.append(
        "colors",
        JSON.stringify(
          form.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
        ),
      );
      images.forEach((img) => fd.append("images", img));

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, fd);
      } else {
        await api.post("/products", fd);
      }

      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Failed to save product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="dash-panel">
      <div className="dash-panel__head">
        <div>
          <h2 className="dash-panel__title">Products</h2>
          <p className="dash-panel__sub">
            {products.length} product{products.length !== 1 ? "s" : ""} in your
            store
          </p>
        </div>
        <button className="dash-add-btn" onClick={openAdd}>
          + Add Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="dash-product-form">
          <h3 className="dash-product-form__title">
            {editProduct ? "Edit Product" : "Add New Product"}
          </h3>

          <div className="dash-form-grid">
            {[
              {
                key: "name",
                label: "Product Name *",
                placeholder: "e.g. Cotton Saree",
                full: true,
              },
              {
                key: "price",
                label: "Price (₹) *",
                placeholder: "599",
                type: "number",
              },
              {
                key: "discountPrice",
                label: "Discount Price (₹)",
                placeholder: "499 (optional)",
                type: "number",
              },
              {
                key: "stock",
                label: "Stock *",
                placeholder: "20",
                type: "number",
              },
              { key: "sizes", label: "Sizes", placeholder: "S, M, L, XL" },
              {
                key: "colors",
                label: "Colors",
                placeholder: "Red, Blue, Green",
              },
            ].map(({ key, label, placeholder, type, full }) => (
              <div
                key={key}
                className={`dash-form-field${full ? " dash-form-field--full" : ""}`}
              >
                <label className="dash-form-field__label">{label}</label>
                <input
                  className="dash-form-field__input"
                  type={type || "text"}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                />
              </div>
            ))}

            <div className="dash-form-field">
              <label className="dash-form-field__label">Category *</label>
              <select
                className="dash-form-field__input"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                {["Saree", "Kids", "Mens", "Ethnic", "Western", "Other"].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="dash-form-field dash-form-field--full">
              <label className="dash-form-field__label">Description</label>
              <textarea
                className="dash-form-field__textarea"
                placeholder="Describe your product…"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div className="dash-form-field dash-form-field--full">
              <label className="dash-form-field__label">
                Product Images{" "}
                {editProduct ? "(leave empty to keep existing)" : ""}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="dash-form-field__file"
                onChange={(e) => setImages(Array.from(e.target.files))}
              />
              {images.length > 0 && (
                <p className="dash-form-field__file-count">
                  {images.length} image{images.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          {formError && <p className="dash-form-error">{formError}</p>}

          <div className="dash-form-actions">
            <button
              className="dash-form-actions__cancel"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button
              className={`dash-form-actions__save${formLoading ? " dash-form-actions__save--loading" : ""}`}
              onClick={handleSubmit}
              disabled={formLoading}
            >
              {formLoading
                ? "Saving…"
                : editProduct
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="dash-shimmer" />
      ) : products.length === 0 ? (
        <div className="dash-empty">
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="dash-products-table">
          {products.map((p) => (
            <div key={p._id} className="dash-product-row">
              <div className="dash-product-row__img">
                <img
                  src={p.images?.[0] || "/placeholder.jpg"}
                  alt={p.name}
                  loading="lazy"
                />
              </div>
              <div className="dash-product-row__info">
                <p className="dash-product-row__name">{p.name}</p>
                <p className="dash-product-row__meta">
                  {p.category} · Stock: {p.stock}
                </p>
              </div>
              <div className="dash-product-row__price">
                <span className="dash-product-row__current">
                  ₹{(p.discountPrice || p.price).toLocaleString("en-IN")}
                </span>
                {p.discountPrice && (
                  <span className="dash-product-row__original">
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <span
                className={`dash-product-row__stock${p.stock < 5 ? " dash-product-row__stock--low" : ""}`}
              >
                {p.stock < 5 ? "⚠️ Low" : "✅ OK"}
              </span>
              <div className="dash-product-row__actions">
                <button
                  className="dash-product-row__edit"
                  onClick={() => openEdit(p)}
                >
                  Edit
                </button>
                <button
                  className={`dash-product-row__delete${deleteId === p._id ? " dash-product-row__delete--loading" : ""}`}
                  onClick={() => handleDelete(p._id)}
                  disabled={deleteId === p._id}
                >
                  {deleteId === p._id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
// ─── Replace only the OrdersTab function in your Dashboard.jsx ───────────────
// Find: function OrdersTab() { ... }
// Replace with this entire function:

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get("/orders/store");
        setOrders(res.data.orders || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
    } catch {
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const STATUS_COLORS = {
    pending: { color: "#d97706", bg: "rgba(217,119,6,0.1)" },
    confirmed: { color: "#2563eb", bg: "rgba(37,99,235,0.1)" },
    shipped: { color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
    delivered: { color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
    cancelled: { color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
  };

  return (
    <div className="dash-panel">
      <div className="dash-panel__head">
        <div>
          <h2 className="dash-panel__title">Orders</h2>
          <p className="dash-panel__sub">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="dash-order-filters">
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
            className={`dash-order-filter${filter === f ? " dash-order-filter--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all"
              ? `All (${orders.length})`
              : `${f.charAt(0).toUpperCase() + f.slice(1)} (${orders.filter((o) => o.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="dash-shimmer" />
      ) : filtered.length === 0 ? (
        <div className="dash-empty">
          <p>No {filter === "all" ? "" : filter} orders found.</p>
        </div>
      ) : (
        <div className="dash-orders-list">
          {filtered.map((order) => {
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            const isExpanded = expandedId === order._id;
            const nextStatus = {
              pending: "confirmed",
              confirmed: "shipped",
              shipped: "delivered",
              delivered: null,
              cancelled: null,
            }[order.status];
            const orderTotal =
              order.items?.reduce((s, i) => s + i.price * i.qty, 0) || 0;

            return (
              <div key={order._id} className="dash-order-card">
                {/* ── Card Header ─────────────────────────────────────── */}
                <div
                  className="dash-order-card__head"
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}
                >
                  <div className="dash-order-card__head-left">
                    <div>
                      <p className="dash-order-card__id">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="dash-order-card__date">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Customer quick info */}
                    <div className="dash-order-card__customer-quick">
                      <div className="dash-order-card__avatar">
                        {order.customer?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="dash-order-card__customer-name">
                          {order.customer?.name || "Unknown"}
                        </p>
                        <p className="dash-order-card__customer-phone">
                          {order.customer?.phone || "No phone"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="dash-order-card__head-right">
                    <div className="dash-order-card__badges">
                      <span
                        className="dash-order-card__status"
                        style={{ color: sc.color, background: sc.bg }}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`dash-order-card__payment${order.paymentMethod === "cod" ? " dash-order-card__payment--cod" : " dash-order-card__payment--paid"}`}
                      >
                        {order.paymentMethod === "cod" ? "💵 COD" : "⚡ Paid"}
                      </span>
                    </div>
                    <span className="dash-order-card__total">
                      ₹{orderTotal.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`dash-order-card__chevron${isExpanded ? " dash-order-card__chevron--open" : ""}`}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {/* ── Expanded Details ─────────────────────────────────── */}
                {isExpanded && (
                  <div className="dash-order-card__body">
                    {/* Customer Full Details */}
                    <div className="dash-order-detail-section">
                      <h4 className="dash-order-detail-section__title">
                        👤 Customer Details
                      </h4>
                      <div className="dash-order-customer-grid">
                        <div className="dash-order-detail-item">
                          <span className="dash-order-detail-item__label">
                            Name
                          </span>
                          <span className="dash-order-detail-item__value">
                            {order.customer?.name || "—"}
                          </span>
                        </div>
                        <div className="dash-order-detail-item">
                          <span className="dash-order-detail-item__label">
                            Email
                          </span>
                          <span className="dash-order-detail-item__value">
                            {order.customer?.email || "—"}
                          </span>
                        </div>
                        <div className="dash-order-detail-item">
                          <span className="dash-order-detail-item__label">
                            Phone
                          </span>
                          <span className="dash-order-detail-item__value">
                            {order.customer?.phone || "Not provided"}
                          </span>
                        </div>
                        <div className="dash-order-detail-item">
                          <span className="dash-order-detail-item__label">
                            Payment
                          </span>
                          <span className="dash-order-detail-item__value">
                            {order.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : "Razorpay (Online)"}
                            {" · "}
                            <span
                              style={{
                                color:
                                  order.paymentStatus === "paid"
                                    ? "#16a34a"
                                    : "#d97706",
                                fontWeight: 700,
                              }}
                            >
                              {order.paymentStatus === "paid"
                                ? "✓ Paid"
                                : "Unpaid"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="dash-order-detail-section">
                      <h4 className="dash-order-detail-section__title">
                        📍 Delivery Address
                      </h4>
                      <div className="dash-order-address">
                        <p className="dash-order-address__street">
                          {order.deliveryAddress?.street}
                        </p>
                        <p className="dash-order-address__rest">
                          {order.deliveryAddress?.city},{" "}
                          {order.deliveryAddress?.state} —{" "}
                          {order.deliveryAddress?.pincode}
                        </p>
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="dash-order-detail-section">
                      <h4 className="dash-order-detail-section__title">
                        🛍️ Ordered Items
                      </h4>
                      <div className="dash-order-items">
                        {order.items?.map((item, i) => (
                          <div key={i} className="dash-order-item">
                            <div className="dash-order-item__img">
                              <img
                                src={
                                  item.product?.images?.[0] ||
                                  "/placeholder.jpg"
                                }
                                alt={item.product?.name}
                                loading="lazy"
                              />
                            </div>
                            <div className="dash-order-item__info">
                              <p className="dash-order-item__name">
                                {item.product?.name || "Product"}
                              </p>
                              <p className="dash-order-item__meta">
                                {[
                                  item.size && `Size: ${item.size}`,
                                  item.color && `Color: ${item.color}`,
                                  `Qty: ${item.qty}`,
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            </div>
                            <span className="dash-order-item__price">
                              ₹{(item.price * item.qty).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="dash-order-detail-section">
                      <h4 className="dash-order-detail-section__title">
                        💰 Order Summary
                      </h4>
                      <div className="dash-order-summary">
                        <div className="dash-order-summary__row">
                          <span>Items Total</span>
                          <span>₹{orderTotal.toLocaleString("en-IN")}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="dash-order-summary__row dash-order-summary__row--discount">
                            <span>
                              Discount{" "}
                              {order.couponCode && `(${order.couponCode})`}
                            </span>
                            <span>
                              − ₹{order.discount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                        <div className="dash-order-summary__row dash-order-summary__row--total">
                          <span>Total Paid</span>
                          <span>
                            ₹
                            {(order.totalAmount || orderTotal).toLocaleString(
                              "en-IN",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="dash-order-card__actions">
                      {nextStatus && (
                        <button
                          className={`dash-order-card__advance${updatingId === order._id ? " dash-order-card__advance--loading" : ""}`}
                          onClick={() => updateStatus(order._id, nextStatus)}
                          disabled={updatingId === order._id}
                        >
                          {updatingId === order._id
                            ? "Updating…"
                            : `✓ Mark as ${nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}`}
                        </button>
                      )}
                      {order.status === "pending" && (
                        <button
                          className="dash-order-card__cancel"
                          onClick={() => updateStatus(order._id, "cancelled")}
                          disabled={updatingId === order._id}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Store Tab ────────────────────────────────────────────────────────────────
function StoreTab({ store, setStore }) {
  const [form, setForm] = useState({
    name: store.name || "",
    description: store.description || "",
    phone: store.phone || "",
    gst: store.gst || "",
    street: store.address?.street || "",
    city: store.address?.city || "",
    state: store.address?.state || "",
    pincode: store.address?.pincode || "",
  });
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logo) fd.append("logo", logo);
      if (banner) fd.append("banner", banner);

      const res = await api.put(`/stores/${store._id}`, fd);
      setStore(res.data.store);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-panel">
      <h2 className="dash-panel__title">Store Settings</h2>

      <div className="dash-form-grid">
        {[
          {
            key: "name",
            label: "Store Name *",
            placeholder: "Velvet Noir",
            full: false,
          },
          { key: "phone", label: "Contact Phone", placeholder: "9876543210" },
          { key: "gst", label: "GST Number", placeholder: "22AAAAA0000A1Z5" },
          {
            key: "street",
            label: "Street Address",
            placeholder: "123, MG Road",
            full: true,
          },
          { key: "city", label: "City", placeholder: "Mumbai" },
          { key: "state", label: "State", placeholder: "Maharashtra" },
          { key: "pincode", label: "Pincode", placeholder: "400001" },
        ].map(({ key, label, placeholder, full }) => (
          <div
            key={key}
            className={`dash-form-field${full ? " dash-form-field--full" : ""}`}
          >
            <label className="dash-form-field__label">{label}</label>
            <input
              className="dash-form-field__input"
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
            />
          </div>
        ))}

        <div className="dash-form-field dash-form-field--full">
          <label className="dash-form-field__label">Store Description</label>
          <textarea
            className="dash-form-field__textarea"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Tell customers about your store…"
          />
        </div>

        <div className="dash-form-field">
          <label className="dash-form-field__label">Store Logo</label>
          {store.logo && (
            <img src={store.logo} alt="logo" className="dash-store-preview" />
          )}
          <input
            type="file"
            accept="image/*"
            className="dash-form-field__file"
            onChange={(e) => setLogo(e.target.files?.[0])}
          />
        </div>

        <div className="dash-form-field">
          <label className="dash-form-field__label">Store Banner</label>
          {store.banner && (
            <img
              src={store.banner}
              alt="banner"
              className="dash-store-preview dash-store-preview--banner"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className="dash-form-field__file"
            onChange={(e) => setBanner(e.target.files?.[0])}
          />
        </div>
      </div>

      {error && <p className="dash-form-error">{error}</p>}
      {success && (
        <p className="dash-form-success">✓ Store updated successfully!</p>
      )}

      <button
        className={`dash-save-btn${loading ? " dash-save-btn--loading" : ""}`}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
