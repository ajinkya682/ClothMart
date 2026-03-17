import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Stores.scss";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "All", icon: "✦" },
  { value: "Men's Fashion", icon: "👔" },
  { value: "Women's Fashion", icon: "👗" },
  { value: "Ethnic Wear", icon: "🪡" },
  { value: "Streetwear", icon: "🧢" },
  { value: "Kids' Wear", icon: "🧸" },
  { value: "Winterwear", icon: "🧥" },
  { value: "Activewear", icon: "🏃" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "products", label: "Most Products" },
];

const MOCK_STORES = [
  {
    _id: "1",
    name: "Velvet Noir",
    slug: "velvet-noir",
    description:
      "Luxury women's fashion blending contemporary cuts with timeless elegance. Signature fabrics, curated drops.",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=VN&backgroundColor=ffcf40&textColor=09090b",
    banner:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=80",
    category: "Women's Fashion",
    rating: 4.9,
    reviewCount: 847,
    productCount: 186,
    location: "Mumbai",
    delivery: { free: true, minDays: 2, maxDays: 4 },
    priceRange: { min: 1299, max: 18999 },
    avgPrice: 5800,
    isVerified: true,
    isFeatured: true,
    joinedAt: "2022-08-10",
  },
  {
    _id: "2",
    name: "Thread & Co.",
    slug: "thread-co",
    description:
      "Premium men's essentials — tailored shirts, structured blazers and everyday staples built to last.",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TC&backgroundColor=09090b&textColor=ffcf40",
    banner:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=80",
    category: "Men's Fashion",
    rating: 4.7,
    reviewCount: 623,
    productCount: 214,
    location: "Delhi",
    delivery: { free: true, minDays: 1, maxDays: 3 },
    priceRange: { min: 799, max: 12999 },
    avgPrice: 3400,
    isVerified: true,
    isFeatured: true,
    joinedAt: "2022-11-20",
  },
  {
    _id: "3",
    name: "Rang Mahal",
    slug: "rang-mahal",
    description:
      "Celebrating Indian craftsmanship — handwoven sarees, kurtas and festive ethnic wear for every occasion.",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=RM&backgroundColor=dc2626&textColor=ffffff",
    banner:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80",
    category: "Ethnic Wear",
    rating: 4.8,
    reviewCount: 1102,
    productCount: 342,
    location: "Jaipur",
    delivery: { free: true, minDays: 2, maxDays: 5 },
    priceRange: { min: 599, max: 24999 },
    avgPrice: 4200,
    isVerified: true,
    isFeatured: true,
    joinedAt: "2022-06-14",
  },
  {
    _id: "4",
    name: "Urban Stitch",
    slug: "urban-stitch",
    description:
      "Streetwear for the bold — graphic tees, oversized hoodies and drop-culture pieces from indie designers.",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=US&backgroundColor=242429&textColor=ffcf40",
    banner:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&q=80",
    category: "Streetwear",
    rating: 4.6,
    reviewCount: 489,
    productCount: 167,
    location: "Bangalore",
    delivery: { free: false, charge: 49, minDays: 2, maxDays: 5 },
    priceRange: { min: 499, max: 6999 },
    avgPrice: 1800,
    isVerified: true,
    isFeatured: false,
    joinedAt: "2023-02-05",
  },
  {
    _id: "5",
    name: "Tiny Threads",
    slug: "tiny-threads",
    description:
      "Adorable, durable and comfortable clothing for kids aged 0–14. Soft fabrics, vibrant prints, safe dyes.",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TT&backgroundColor=fff8dc&textColor=09090b",
    banner:
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=700&q=80",
    category: "Kids' Wear",
    rating: 4.8,
    reviewCount: 712,
    productCount: 298,
    location: "Pune",
    delivery: { free: true, minDays: 2, maxDays: 4 },
    priceRange: { min: 299, max: 3999 },
    avgPrice: 980,
    isVerified: true,
    isFeatured: false,
    joinedAt: "2022-12-01",
  },
  {
    _id: "6",
    name: "Frost & Wool",
    slug: "frost-wool",
    description:
      "Premium winterwear — woollen coats, cashmere sweaters and thermal innerwear for the coldest days.",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=FW&backgroundColor=f3f2ee&textColor=09090b",
    banner:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=80",
    category: "Winterwear",
    rating: 4.5,
    reviewCount: 334,
    productCount: 124,
    location: "Shimla",
    delivery: { free: false, charge: 79, minDays: 3, maxDays: 6 },
    priceRange: { min: 899, max: 19999 },
    avgPrice: 5200,
    isVerified: true,
    isFeatured: false,
    joinedAt: "2023-09-15",
  },
  {
    _id: "7",
    name: "FlexFit Studio",
    slug: "flexfit-studio",
    description:
      "High-performance activewear for yoga, gym and outdoor sports. Breathable, flexible and sweat-proof.",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=FF&backgroundColor=121215&textColor=ffcf40",
    banner:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=700&q=80",
    category: "Activewear",
    rating: 4.6,
    reviewCount: 558,
    productCount: 143,
    location: "Chennai",
    delivery: { free: true, minDays: 1, maxDays: 3 },
    priceRange: { min: 699, max: 8999 },
    avgPrice: 2400,
    isVerified: false,
    isFeatured: false,
    joinedAt: "2023-04-20",
  },
  {
    _id: "8",
    name: "Loom & Grace",
    slug: "loom-grace",
    description:
      "Sustainable women's fashion — linen dresses, block-printed kurtas and slow-fashion wardrobe staples.",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=LG&backgroundColor=ffcf40&textColor=09090b",
    banner:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=80",
    category: "Women's Fashion",
    rating: 4.7,
    reviewCount: 421,
    productCount: 109,
    location: "Ahmedabad",
    delivery: { free: true, minDays: 2, maxDays: 5 },
    priceRange: { min: 699, max: 9999 },
    avgPrice: 2900,
    isVerified: true,
    isFeatured: false,
    joinedAt: "2023-01-28",
  },
  {
    _id: "9",
    name: "Khadi Roots",
    slug: "khadi-roots",
    description:
      "Authentic handspun khadi clothing — men's kurtas, Nehru jackets and women's ethnic sets from artisan weavers.",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=KR&backgroundColor=16a34a&textColor=ffffff",
    banner:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&q=80",
    category: "Ethnic Wear",
    rating: 4.4,
    reviewCount: 278,
    productCount: 196,
    location: "Varanasi",
    delivery: { free: false, charge: 49, minDays: 3, maxDays: 7 },
    priceRange: { min: 499, max: 11999 },
    avgPrice: 2600,
    isVerified: false,
    isFeatured: false,
    joinedAt: "2023-07-11",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtPrice(n) {
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `₹${n}`;
}

// ─── StarRating ───────────────────────────────────────────────────────────────
function StarRating({ rating, reviewCount }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
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
      <span className="star-rating__num">{rating.toFixed(1)}</span>
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
  return (
    <Link to={`/stores/${store.slug}`} className="store-card" style={style}>
      {/* Banner */}
      <div className="store-card__banner">
        <img src={store.banner} alt={store.name} loading="lazy" />
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
        {/* Header */}
        <div className="store-card__hd">
          <div className="store-card__logo">
            <img src={store.logo} alt={store.name} />
          </div>
          <div className="store-card__id">
            <h3 className="store-card__name">{store.name}</h3>
            <span className="store-card__loc">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {store.location}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="store-card__desc">{store.description}</p>

        {/* Delivery + Price range */}
        <div className="store-card__info">
          <span
            className={`store-card__delivery${store.delivery.free ? " store-card__delivery--free" : ""}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect
                x="1"
                y="3"
                width="15"
                height="13"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16 8h4l3 5v4h-7V8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle
                cx="5.5"
                cy="18.5"
                r="2.5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="18.5"
                cy="18.5"
                r="2.5"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {store.delivery.free
              ? "Free delivery"
              : `₹${store.delivery.charge} delivery`}
          </span>
          <span className="store-card__sep">·</span>
          <span className="store-card__price">
            {fmtPrice(store.priceRange.min)} – {fmtPrice(store.priceRange.max)}
          </span>
        </div>

        {/* Delivery time */}
        <div className="store-card__eta">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 6v6l4 2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Delivers in {store.delivery.minDays}–{store.delivery.maxDays} days
        </div>

        {/* Stats */}
        <div className="store-card__stats">
          <StarRating rating={store.rating} reviewCount={store.reviewCount} />
          <span className="store-card__divider" />
          <span className="store-card__prod-count">
            <strong>{store.productCount}</strong> Products
          </span>
        </div>

        {/* CTA */}
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

// ─── FeaturedCard ─────────────────────────────────────────────────────────────
function FeaturedCard({ store }) {
  return (
    <Link to={`/stores/${store.slug}`} className="feat-card">
      <div className="feat-card__bg">
        <img src={store.banner} alt={store.name} loading="lazy" />
        <div className="feat-card__overlay" />
      </div>
      <div className="feat-card__content">
        <span className="feat-card__tag">Featured</span>
        <div className="feat-card__bottom">
          <div className="feat-card__logo">
            <img src={store.logo} alt={store.name} />
          </div>
          <div className="feat-card__info">
            <h3 className="feat-card__name">{store.name}</h3>
            <p className="feat-card__desc">{store.description}</p>
            <div className="feat-card__meta">
              <StarRating
                rating={store.rating}
                reviewCount={store.reviewCount}
              />
              <span className="feat-card__dot">·</span>
              <span className="feat-card__prods">
                {store.productCount} styles
              </span>
            </div>
            <div className="feat-card__delivery-row">
              <span
                className={`feat-card__delivery${store.delivery.free ? " feat-card__delivery--free" : ""}`}
              >
                {store.delivery.free
                  ? "Free delivery"
                  : `₹${store.delivery.charge} delivery`}
              </span>
              <span className="feat-card__price-range">
                {fmtPrice(store.priceRange.min)} –{" "}
                {fmtPrice(store.priceRange.max)}
              </span>
            </div>
          </div>
          <FollowButton storeId={store._id} />
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Stores() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔁 Replace with: api.get("/stores").then(r => setStores(r.data.stores))
    const t = setTimeout(() => {
      setStores(MOCK_STORES);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setActiveCategory("All");
    setSortBy("featured");
  }, []);

  const featured = stores.filter((s) => s.isFeatured);
  const showFeatured = !search && activeCategory === "All";

  const filtered = stores
    .filter((s) => {
      const q = search.toLowerCase();
      return (
        (s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)) &&
        (activeCategory === "All" || s.category === activeCategory)
      );
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest")
        return new Date(b.joinedAt) - new Date(a.joinedAt);
      if (sortBy === "price_asc") return a.avgPrice - b.avgPrice;
      if (sortBy === "price_desc") return b.avgPrice - a.avgPrice;
      if (sortBy === "products") return b.productCount - a.productCount;
      return b.isFeatured - a.isFeatured;
    });

  const activeFCount =
    (search ? 1 : 0) +
    (activeCategory !== "All" ? 1 : 0) +
    (sortBy !== "featured" ? 1 : 0);

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
              <strong>
                {stores
                  .reduce((s, x) => s + x.productCount, 0)
                  .toLocaleString()}
                +
              </strong>
              <span>Styles</span>
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
              placeholder="Search brands by name, style or city…"
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
              {cat.value}
            </button>
          ))}
        </div>
      </div>

      {/* ── Featured Stores ───────────────────────────────────────────────── */}
      {showFeatured && featured.length > 0 && (
        <section className="stores-featured">
          <div className="stores-featured__container">
            <div className="section-hd">
              <span className="section-label">Hand-picked</span>
              <h2 className="section-title">Featured Brands</h2>
            </div>
            <div className="stores-featured__grid">
              {featured.map((s) => (
                <FeaturedCard key={s._id} store={s} />
              ))}
            </div>
          </div>
        </section>
      )}

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
                  : `${filtered.length} brand${filtered.length !== 1 ? "s" : ""}`}
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

          {/* Grid / States */}
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
          ) : filtered.length === 0 ? (
            <div className="stores-empty">
              <span className="stores-empty__ico">🔍</span>
              <h3 className="stores-empty__title">No brands found</h3>
              <p className="stores-empty__sub">
                {search
                  ? `No results for "${search}" — try a different keyword`
                  : "No brands in this category yet"}
              </p>
              <button className="stores-empty__btn" onClick={clearAll}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="stores-grid">
              {filtered.map((store, i) => (
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
