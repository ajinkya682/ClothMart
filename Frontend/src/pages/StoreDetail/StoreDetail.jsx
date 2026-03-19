import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "./StoreDetail.scss";

// ─── Icons ────────────────────────────────────────────────────────────────────
const StarIcon = ({ filled }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
  >
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="21" r="1" fill="currentColor" />
    <circle cx="20" cy="21" r="1" fill="currentColor" />
    <path
      d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    addToCart(product, 1, product.sizes?.[0] || "", product.colors?.[0] || "");
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : null;

  return (
    <Link
      to={`/products/${product.slug || product._id}`}
      className="sd-product-card"
    >
      <div className="sd-product-card__img-wrap">
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="sd-product-card__img"
          loading="lazy"
        />
        {discount && (
          <span className="sd-product-card__badge">{discount}% off</span>
        )}
        {isAuthenticated && (
          <button
            className={`sd-product-card__cart-btn${added ? " sd-product-card__cart-btn--added" : ""}`}
            onClick={handleAdd}
          >
            {added ? (
              "✓ Added"
            ) : (
              <>
                <CartIcon /> Add
              </>
            )}
          </button>
        )}
      </div>
      <div className="sd-product-card__body">
        <p className="sd-product-card__name">{product.name}</p>
        <div className="sd-product-card__price-row">
          <span className="sd-product-card__price">
            ₹{(product.discountPrice || product.price).toLocaleString("en-IN")}
          </span>
          {product.discountPrice && (
            <span className="sd-product-card__original">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        {product.rating > 0 && (
          <div className="sd-product-card__rating">
            <StarIcon filled />
            <span>{product.rating.toFixed(1)}</span>
            <span className="sd-product-card__reviews">
              ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="sd-skeleton">
      <div className="sd-skeleton__banner" />
      <div className="sd-skeleton__info">
        <div className="sd-skeleton__logo" />
        <div className="sd-skeleton__lines">
          <div className="sd-skeleton__line sd-skeleton__line--lg" />
          <div className="sd-skeleton__line sd-skeleton__line--sm" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StoreDetail() {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ── Fetch store ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        // 🔁 Replace with: api.get(`/stores/${slug}`)
        const res = await api.get(`/stores/${slug}`);
        setStore(res.data.store);
      } catch (err) {
        setError("Store not found");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [slug]);

  // ── Fetch products ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!store) return;
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const res = await api.get("/products", {
          params: { store: store._id, sort, search, page, limit: 12 },
        });
        setProducts(res.data.products);
        setTotalPages(res.data.pages);
      } catch {
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [store, sort, search, page]);

  if (loading) return <Skeleton />;
  if (error)
    return (
      <div className="sd-error">
        <h2>Store not found</h2>
        <Link to="/stores" className="sd-error__back">
          ← Browse all stores
        </Link>
      </div>
    );

  const stars = Array.from(
    { length: 5 },
    (_, i) => i < Math.round(store.rating || 0),
  );

  return (
    <div className="sd-page">
      {/* ── Banner ─────────────────────────────────────────────────────────── */}
      <div className="sd-banner">
        {store.banner ? (
          <img src={store.banner} alt="" className="sd-banner__img" />
        ) : (
          <div className="sd-banner__placeholder" />
        )}
        <div className="sd-banner__overlay" />
      </div>

      {/* ── Store Info ─────────────────────────────────────────────────────── */}
      <div className="sd-container">
        <div className="sd-info">
          <div className="sd-info__logo-wrap">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                className="sd-info__logo"
              />
            ) : (
              <div className="sd-info__logo-placeholder">
                {store.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="sd-info__body">
            <div className="sd-info__top">
              <div>
                <div className="sd-info__meta-row">
                  <span className="sd-info__category">{store.category}</span>
                  {store.isVerified && (
                    <span className="sd-info__verified">✓ Verified</span>
                  )}
                </div>
                <h1 className="sd-info__name">{store.name}</h1>
                {store.description && (
                  <p className="sd-info__desc">{store.description}</p>
                )}
              </div>

              <div className="sd-info__stats">
                {store.rating > 0 && (
                  <div className="sd-info__rating">
                    <div className="sd-info__stars">
                      {stars.map((filled, i) => (
                        <span
                          key={i}
                          className={`sd-info__star${filled ? " sd-info__star--filled" : ""}`}
                        >
                          <StarIcon filled={filled} />
                        </span>
                      ))}
                    </div>
                    <span className="sd-info__rating-val">
                      {store.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                {store.address?.city && (
                  <p className="sd-info__location">
                    📍 {store.address.city}, {store.address.state}
                  </p>
                )}
                {store.phone && (
                  <p className="sd-info__phone">📞 {store.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Products Section ───────────────────────────────────────────── */}
        <div className="sd-products-section">
          <div className="sd-products-header">
            <h2 className="sd-products-title">
              Products
              {!productsLoading && (
                <span className="sd-products-count">({products.length})</span>
              )}
            </h2>

            <div className="sd-products-controls">
              {/* Search */}
              <div className="sd-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="sd-search__input"
                />
              </div>

              {/* Sort */}
              <select
                className="sd-sort"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {productsLoading ? (
            <div className="sd-products-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="sd-product-shimmer" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="sd-no-products">
              <p>No products found{search ? ` for "${search}"` : ""}.</p>
            </div>
          ) : (
            <div className="sd-products-grid">
              {products.map((p, i) => (
                <div key={p._id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="sd-pagination">
              <button
                className="sd-pagination__btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span className="sd-pagination__info">
                Page {page} of {totalPages}
              </span>
              <button
                className="sd-pagination__btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
