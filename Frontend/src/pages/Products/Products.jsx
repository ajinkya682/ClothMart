import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../utils/api";
import "./Products.scss";

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

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const RATING_FILTERS = [
  { value: 4, label: "4★ & above" },
  { value: 3, label: "3★ & above" },
  { value: 0, label: "All ratings" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtPrice(n) {
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `₹${n}`;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
  >
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 10a4 4 0 0 1-8 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// ─── WishlistButton ───────────────────────────────────────────────────────────
function WishlistButton({ productId, className = "" }) {
  const [saved, setSaved] = useState(false);
  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved((s) => !s);
  };
  return (
    <button
      className={`wishlist-btn${saved ? " wishlist-btn--on" : ""} ${className}`}
      onClick={toggle}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
    >
      <HeartIcon filled={saved} />
    </button>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ product, style }) {
  const { addToCart } = useCart();
  const navigate = useNavigate(); // ✅ Fixed: inside component
  const [selectedSize, setSelectedSize] = useState("");
  const [addedAnim, setAddedAnim] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedSize, product.colors?.[0] || "");
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const handleSizeClick = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize((s) => (s === size ? "" : size));
  };

  // Use slug if available, fallback to _id
  const productLink = `/products/${product.slug || product._id}`;
  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : null;

  return (
    <Link to={productLink} className="product-card" style={style}>
      {/* Image */}
      <div className="product-card__img-wrap">
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-card__badges">
          {discount > 0 && (
            <span className="pc-badge pc-badge--discount">-{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <WishlistButton
          productId={product._id}
          className="product-card__wishlist"
        />

        {/* Quick Add overlay */}
        <div className="product-card__overlay">
          {product.sizes?.length > 0 && (
            <div className="product-card__sizes-row">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`product-card__size${selectedSize === size ? " product-card__size--active" : ""}`}
                  onClick={(e) => handleSizeClick(e, size)}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <button
            className={`product-card__cart-btn${addedAnim ? " product-card__cart-btn--added" : ""}`}
            onClick={handleAddToCart}
          >
            <CartIcon />
            {addedAnim ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="product-card__body">
        {/* Store — span with navigate, not nested Link */}
        {product.store && (
          <span
            className="product-card__store"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/stores/${product.store?.slug || product.store?._id}`);
            }}
          >
            {product.store?.name}
          </span>
        )}

        {/* Name */}
        <h3 className="product-card__name">{product.name}</h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="product-card__rating">
            <StarIcon />
            <span className="product-card__rating-num">
              {product.rating.toFixed(1)}
            </span>
            <span className="product-card__rating-cnt">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Sizes preview */}
        {product.sizes?.length > 0 && (
          <div className="product-card__size-preview">
            {product.sizes.slice(0, 5).map((s) => (
              <span key={s} className="product-card__size-dot">
                {s}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="product-card__size-dot product-card__size-dot--more">
                +{product.sizes.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="product-card__price-row">
          <span className="product-card__price">
            {fmtPrice(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="product-card__original">
              {fmtPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── FilterSidebar ────────────────────────────────────────────────────────────
function FilterSidebar({
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  selectedSizes,
  toggleSize,
  minRating,
  setMinRating,
  onClear,
  activeCount,
  isOpen,
  onClose,
}) {
  return (
    <>
      {isOpen && <div className="filter-backdrop" onClick={onClose} />}
      <aside
        className={`filter-sidebar${isOpen ? " filter-sidebar--open" : ""}`}
      >
        <div className="filter-sidebar__head">
          <h3 className="filter-sidebar__title">Filters</h3>
          {activeCount > 0 && (
            <button className="filter-sidebar__clear" onClick={onClear}>
              Clear all{" "}
              <span className="filter-sidebar__badge">{activeCount}</span>
            </button>
          )}
          <button
            className="filter-sidebar__close"
            onClick={onClose}
            aria-label="Close filters"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6 6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Category */}
        <div className="filter-group">
          <h4 className="filter-group__title">Category</h4>
          <div className="filter-group__list">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={`filter-cat${activeCategory === cat.value ? " filter-cat--active" : ""}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                <span>{cat.icon}</span>
                {cat.value}
                {activeCategory === cat.value && (
                  <svg
                    className="filter-cat__check"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <h4 className="filter-group__title">
            Price Range
            <span className="filter-group__range-label">
              {fmtPrice(priceRange[0])} – {fmtPrice(priceRange[1])}
            </span>
          </h4>
          <div className="filter-price">
            <input
              type="range"
              min={0}
              max={10000}
              step={100}
              value={priceRange[0]}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v < priceRange[1]) setPriceRange([v, priceRange[1]]);
              }}
              className="filter-price__range"
            />
            <input
              type="range"
              min={0}
              max={10000}
              step={100}
              value={priceRange[1]}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v > priceRange[0]) setPriceRange([priceRange[0], v]);
              }}
              className="filter-price__range"
            />
            <div className="filter-price__labels">
              <span>₹0</span>
              <span>₹10k+</span>
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="filter-group">
          <h4 className="filter-group__title">Size</h4>
          <div className="filter-sizes">
            {SIZES.map((size) => (
              <button
                key={size}
                className={`filter-size${selectedSizes.includes(size) ? " filter-size--active" : ""}`}
                onClick={() => toggleSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="filter-group">
          <h4 className="filter-group__title">Minimum Rating</h4>
          <div className="filter-group__list">
            {RATING_FILTERS.map((r) => (
              <button
                key={r.value}
                className={`filter-rating${minRating === r.value ? " filter-rating--active" : ""}`}
                onClick={() => setMinRating(r.value)}
              >
                {r.value > 0 && <StarIcon />}
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ── Fetch from real API ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          sort: sortBy,
        };
        if (search) params.search = search;
        if (activeCategory !== "All") params.category = activeCategory;
        if (priceRange[0] > 0) params.minPrice = priceRange[0];
        if (priceRange[1] < 10000) params.maxPrice = priceRange[1];

        const res = await api.get("/products", { params });
        setProducts(res.data.products || []);
        setTotalPages(res.data.pages || 1);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, activeCategory, sortBy, priceRange, page]);

  const toggleSize = useCallback((size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setActiveCategory("All");
    setSortBy("newest");
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setMinRating(0);
    setPage(1);
  }, []);

  // Client-side size + rating filter (API doesn't support these)
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSize =
        selectedSizes.length === 0 ||
        selectedSizes.some((s) => p.sizes?.includes(s));
      const matchRating = p.rating >= minRating;
      return matchSize && matchRating;
    });
  }, [products, selectedSizes, minRating]);

  const activeFilterCount = useMemo(
    () =>
      (search ? 1 : 0) +
      (activeCategory !== "All" ? 1 : 0) +
      (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
      (selectedSizes.length > 0 ? 1 : 0) +
      (minRating > 0 ? 1 : 0),
    [search, activeCategory, priceRange, selectedSizes, minRating],
  );

  return (
    <main className="products-page">
      {/* ── Hero / Top bar ────────────────────────────────────────────────── */}
      <section className="products-hero">
        <div className="products-hero__bg" aria-hidden />
        <div className="products-hero__container">
          <div className="products-hero__left">
            <span className="products-hero__label">ClothMart</span>
            <h1 className="products-hero__title">
              All <span className="products-hero__accent">Products</span>
            </h1>
            <p className="products-hero__sub">
              {loading
                ? "Loading…"
                : `${filtered.length} styles from top clothing brands across India`}
            </p>
          </div>

          {/* Search */}
          <div className="products-hero__search">
            <svg
              className="products-hero__search-ico"
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
              placeholder="Search clothes, brands, styles…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="products-hero__search-input"
            />
            {search && (
              <button
                className="products-hero__search-clear"
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

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="products-body">
        <div className="products-body__container">
          <FilterSidebar
            activeCategory={activeCategory}
            setActiveCategory={(c) => {
              setActiveCategory(c);
              setPage(1);
            }}
            priceRange={priceRange}
            setPriceRange={(r) => {
              setPriceRange(r);
              setPage(1);
            }}
            selectedSizes={selectedSizes}
            toggleSize={toggleSize}
            minRating={minRating}
            setMinRating={setMinRating}
            onClear={clearAll}
            activeCount={activeFilterCount}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="products-main">
            {/* Toolbar */}
            <div className="products-toolbar">
              <div className="products-toolbar__left">
                <button
                  className="products-toolbar__filter-btn"
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="products-toolbar__filter-badge">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <span className="products-toolbar__count">
                  {loading
                    ? "…"
                    : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
                </span>

                {/* Active filter chips */}
                {activeFilterCount > 0 && (
                  <div className="products-toolbar__chips">
                    {activeCategory !== "All" && (
                      <span className="filter-chip">
                        {activeCategory}
                        <button onClick={() => setActiveCategory("All")}>
                          ×
                        </button>
                      </span>
                    )}
                    {selectedSizes.map((s) => (
                      <span key={s} className="filter-chip">
                        Size {s}
                        <button onClick={() => toggleSize(s)}>×</button>
                      </span>
                    ))}
                    {minRating > 0 && (
                      <span className="filter-chip">
                        {minRating}★+
                        <button onClick={() => setMinRating(0)}>×</button>
                      </span>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                      <span className="filter-chip">
                        {fmtPrice(priceRange[0])}–{fmtPrice(priceRange[1])}
                        <button onClick={() => setPriceRange([0, 10000])}>
                          ×
                        </button>
                      </span>
                    )}
                    <button
                      className="filter-chip filter-chip--clear"
                      onClick={clearAll}
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              <div className="products-toolbar__right">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18M7 12h10M10 18h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <select
                  className="products-toolbar__sort"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="products-skeleton">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="products-skeleton__card">
                    <div className="products-skeleton__img" />
                    <div className="products-skeleton__body">
                      <div className="products-skeleton__line products-skeleton__line--w60" />
                      <div className="products-skeleton__line products-skeleton__line--w80" />
                      <div className="products-skeleton__line products-skeleton__line--w40" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="products-empty">
                <span className="products-empty__ico">🔍</span>
                <h3 className="products-empty__title">No products found</h3>
                <p className="products-empty__sub">
                  {search
                    ? `No results for "${search}"`
                    : "Try adjusting your filters"}
                </p>
                <button className="products-empty__btn" onClick={clearAll}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {filtered.map((product, i) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      style={{ animationDelay: `${i * 0.055}s` }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="products-pagination">
                    <button
                      className="products-pagination__btn"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      ← Prev
                    </button>
                    <span className="products-pagination__info">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      className="products-pagination__btn"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
