import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "./Stores.scss";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "All", icon: "✦" },
  { value: "saree", icon: "🪡" },
  { value: "mens", icon: "👔" },
  { value: "western", icon: "👗" },
  { value: "kids", icon: "🧸" },
  { value: "ethnic", icon: "🎋" },
  { value: "other", icon: "✨" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtPrice(n) {
  if (!n) return "₹0";
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `₹${n}`;
}

// ─── StarRating ───────────────────────────────────────────────────────────────
function StarRating({ rating, reviewCount }) {
  const full = Math.floor(rating || 0);
  const half = (rating || 0) - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="star-rating">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} className="star star--full">
          ★
        </span>
      ))}
      {half && <span className="star star--half">★</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className="star star--empty">
          ★
        </span>
      ))}
      <span className="star-rating__num">{(rating || 0).toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="star-rating__cnt">({reviewCount})</span>
      )}
    </span>
  );
}

// ─── FollowButton ─────────────────────────────────────────────────────────────
function FollowButton({ storeId }) {
  const [followed, setFollowed] = useState(false);
  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowed((f) => !f);
  };
  return (
    <button
      className={`follow-btn${followed ? " follow-btn--on" : ""}`}
      onClick={toggle}
      aria-label={followed ? "Unfollow" : "Follow store"}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={followed ? "currentColor" : "none"}
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {followed ? "Following" : "Follow"}
    </button>
  );
}

// ─── StoreCard ────────────────────────────────────────────────────────────────
function StoreCard({ store, style }) {
  // Use slug if available, fallback to _id
  const storeLink = `/stores/${store.slug || store._id}`;

  return (
    <Link to={storeLink} className="store-card" style={style}>
      {/* Banner */}
      <div className="store-card__banner">
        {store.banner ? (
          <img src={store.banner} alt={store.name} loading="lazy" />
        ) : (
          <div className="store-card__banner-placeholder" />
        )}
        <div className="store-card__banner-overlay" />
        <div className="store-card__badges">
          {store.isVerified && (
            <span className="sc-badge sc-badge--verified">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Verified
            </span>
          )}
          <span className="sc-badge sc-badge--cat">{store.category}</span>
        </div>
        <div className="store-card__follow">
          <FollowButton storeId={store._id} />
        </div>
      </div>

      {/* Body */}
      <div className="store-card__body">
        <div className="store-card__hd">
          <div className="store-card__logo">
            {store.logo ? (
              <img src={store.logo} alt={store.name} />
            ) : (
              <span className="store-card__logo-init">
                {store.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="store-card__id">
            <h3 className="store-card__name">{store.name}</h3>
            {store.address?.city && (
              <span className="store-card__loc">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {store.address.city}
              </span>
            )}
          </div>
        </div>

        {store.description && (
          <p className="store-card__desc">{store.description}</p>
        )}

        {/* Stats */}
        <div className="store-card__stats">
          <StarRating rating={store.rating || 0} />
          {store.phone && (
            <>
              <span className="store-card__divider" />
              <span className="store-card__phone">📞 {store.phone}</span>
            </>
          )}
        </div>

        {/* Footer CTA */}
        <div className="store-card__footer">
          <span className="store-card__cta">
            Visit Store
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Stores() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch real stores from API ─────────────────────────────────────────────
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (activeCategory !== "All") params.category = activeCategory;

        const res = await api.get("/stores", { params });
        setStores(res.data.stores || []);
      } catch {
        setStores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [search, activeCategory]);

  const clearAll = useCallback(() => {
    setSearch("");
    setActiveCategory("All");
    setSortBy("newest");
  }, []);

  // Client-side sort
  const sorted = [...stores].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return new Date(b.createdAt) - new Date(a.createdAt); // newest
  });

  const activeFCount =
    (search ? 1 : 0) +
    (activeCategory !== "All" ? 1 : 0) +
    (sortBy !== "newest" ? 1 : 0);

  return (
    <main className="stores-page">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="stores-hero">
        <div className="stores-hero__grid-bg" aria-hidden />
        <div className="stores-hero__blob" aria-hidden />
        <div className="stores-hero__container">
          <span className="stores-hero__label">ClothMart Brands</span>
          <h1 className="stores-hero__title">
            Shop the Best
            <br />
            <span className="stores-hero__accent">Fashion Stores</span>
          </h1>
          <p className="stores-hero__sub">
            Discover verified clothing brands across India — from luxury fashion
            and ethnic wear to streetwear and activewear.
          </p>

          {/* Quick stats */}
          <div className="stores-hero__stats">
            <div className="stores-hero__stat">
              <strong>{stores.length}+</strong>
              <span>Brands</span>
            </div>
            <div className="stores-hero__sep" />
            <div className="stores-hero__stat">
              <strong>{stores.filter((s) => s.isVerified).length}</strong>
              <span>Verified</span>
            </div>
          </div>

          {/* Search */}
          <div className="stores-hero__search">
            <svg
              className="stores-hero__search-ico"
              width="17"
              height="17"
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
              type="text"
              placeholder="Search brands by name or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="stores-hero__search-input"
            />
            {search && (
              <button
                className="stores-hero__search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6 6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Category pills ────────────────────────────────────────────────── */}
      <div className="cats-bar">
        <div className="cats-bar__scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`cats-bar__pill${activeCategory === cat.value ? " cats-bar__pill--active" : ""}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              <span className="cats-bar__icon">{cat.icon}</span>
              {cat.value === "All"
                ? "All"
                : cat.value.charAt(0).toUpperCase() + cat.value.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── All Stores ────────────────────────────────────────────────────── */}
      <section className="stores-all">
        <div className="stores-all__container">
          {/* Toolbar */}
          <div className="stores-toolbar">
            <div className="stores-toolbar__left">
              <h2 className="stores-toolbar__title">
                {activeCategory === "All" ? "All Brands" : activeCategory}
              </h2>
              <span className="stores-toolbar__count">
                {loading
                  ? "…"
                  : `${sorted.length} brand${sorted.length !== 1 ? "s" : ""}`}
              </span>
            </div>
            <div className="stores-toolbar__right">
              {activeFCount > 0 && (
                <button className="stores-toolbar__clear" onClick={clearAll}>
                  Clear filters
                  <span className="stores-toolbar__badge">{activeFCount}</span>
                </button>
              )}
              <div className="stores-toolbar__sort-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18M7 12h10M10 18h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <select
                  className="stores-toolbar__sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="stores-skeleton">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="stores-skeleton__card">
                  <div className="stores-skeleton__banner" />
                  <div className="stores-skeleton__body">
                    <div className="stores-skeleton__line stores-skeleton__line--w80" />
                    <div className="stores-skeleton__line stores-skeleton__line--w60" />
                    <div className="stores-skeleton__line stores-skeleton__line--w40" />
                  </div>
                </div>
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="stores-empty">
              <span className="stores-empty__ico">🔍</span>
              <h3 className="stores-empty__title">No stores found</h3>
              <p className="stores-empty__sub">
                {search
                  ? `No results for "${search}" — try a different keyword`
                  : "No stores in this category yet. Be the first to open one!"}
              </p>
              <button className="stores-empty__btn" onClick={clearAll}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="stores-grid">
              {sorted.map((store, i) => (
                <StoreCard
                  key={store._id}
                  store={store}
                  style={{ animationDelay: `${i * 0.065}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
