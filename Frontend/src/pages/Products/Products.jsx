import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
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
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Best Discount" },
];

const RATING_FILTERS = [
  { value: 4, label: "4★ & above" },
  { value: 3, label: "3★ & above" },
  { value: 0, label: "All ratings" },
];

const MOCK_PRODUCTS = [
  {
    _id: "p1",
    name: "Linen Relaxed Shirt",
    slug: "linen-relaxed-shirt",
    store: { name: "Thread & Co.", slug: "thread-co" },
    category: "Men's Fashion",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
    ],
    price: 2499,
    discountPrice: 1799,
    discountPercent: 28,
    rating: 4.6,
    reviewCount: 214,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Beige", "Sky Blue"],
    isNew: false,
    isBestseller: true,
    inStock: true,
    joinedAt: "2023-03-10",
    popularity: 92,
  },
  {
    _id: "p2",
    name: "Floral Wrap Midi Dress",
    slug: "floral-wrap-midi-dress",
    store: { name: "Velvet Noir", slug: "velvet-noir" },
    category: "Women's Fashion",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80",
    ],
    price: 3999,
    discountPrice: 2999,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 389,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Floral Pink", "Floral Blue"],
    isNew: true,
    isBestseller: false,
    inStock: true,
    joinedAt: "2024-01-05",
    popularity: 97,
  },
  {
    _id: "p3",
    name: "Banarasi Silk Kurta Set",
    slug: "banarasi-silk-kurta-set",
    store: { name: "Rang Mahal", slug: "rang-mahal" },
    category: "Ethnic Wear",
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&q=80",
    ],
    price: 5499,
    discountPrice: 4199,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 562,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Royal Blue", "Maroon", "Emerald"],
    isNew: false,
    isBestseller: true,
    inStock: true,
    joinedAt: "2022-11-20",
    popularity: 99,
  },
  {
    _id: "p4",
    name: "Oversized Graphic Hoodie",
    slug: "oversized-graphic-hoodie",
    store: { name: "Urban Stitch", slug: "urban-stitch" },
    category: "Streetwear",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80",
    ],
    price: 2199,
    discountPrice: 1649,
    discountPercent: 25,
    rating: 4.5,
    reviewCount: 178,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Washed Grey", "Cream"],
    isNew: true,
    isBestseller: false,
    inStock: true,
    joinedAt: "2024-02-14",
    popularity: 85,
  },
  {
    _id: "p5",
    name: "Kids Rainbow Dungaree",
    slug: "kids-rainbow-dungaree",
    store: { name: "Tiny Threads", slug: "tiny-threads" },
    category: "Kids' Wear",
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&q=80",
    ],
    price: 1299,
    discountPrice: 899,
    discountPercent: 31,
    rating: 4.7,
    reviewCount: 304,
    sizes: ["S", "M", "L"],
    colors: ["Rainbow", "Denim Blue"],
    isNew: false,
    isBestseller: true,
    inStock: true,
    joinedAt: "2023-06-01",
    popularity: 88,
  },
  {
    _id: "p6",
    name: "Cashmere Turtleneck Sweater",
    slug: "cashmere-turtleneck-sweater",
    store: { name: "Frost & Wool", slug: "frost-wool" },
    category: "Winterwear",
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&q=80",
    ],
    price: 7999,
    discountPrice: 5999,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 143,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Camel", "Charcoal", "Ivory"],
    isNew: false,
    isBestseller: false,
    inStock: true,
    joinedAt: "2023-09-22",
    popularity: 76,
  },
  {
    _id: "p7",
    name: "Yoga Flex Leggings",
    slug: "yoga-flex-leggings",
    store: { name: "FlexFit Studio", slug: "flexfit-studio" },
    category: "Activewear",
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80",
    ],
    price: 1899,
    discountPrice: 1399,
    discountPercent: 26,
    rating: 4.6,
    reviewCount: 421,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Olive"],
    isNew: false,
    isBestseller: true,
    inStock: true,
    joinedAt: "2023-04-18",
    popularity: 93,
  },
  {
    _id: "p8",
    name: "Block Print Linen Co-ord",
    slug: "block-print-linen-coord",
    store: { name: "Loom & Grace", slug: "loom-grace" },
    category: "Women's Fashion",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
    ],
    price: 3299,
    discountPrice: 2499,
    discountPercent: 24,
    rating: 4.7,
    reviewCount: 267,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Indigo", "Terracotta", "Sage"],
    isNew: true,
    isBestseller: false,
    inStock: true,
    joinedAt: "2024-01-30",
    popularity: 89,
  },
  {
    _id: "p9",
    name: "Slim Fit Chino Trousers",
    slug: "slim-fit-chino-trousers",
    store: { name: "Thread & Co.", slug: "thread-co" },
    category: "Men's Fashion",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
    ],
    price: 2799,
    discountPrice: 1999,
    discountPercent: 29,
    rating: 4.4,
    reviewCount: 198,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Khaki", "Olive", "Navy"],
    isNew: false,
    isBestseller: false,
    inStock: true,
    joinedAt: "2023-05-12",
    popularity: 78,
  },
  {
    _id: "p10",
    name: "Anarkali Embroidered Kurta",
    slug: "anarkali-embroidered-kurta",
    store: { name: "Rang Mahal", slug: "rang-mahal" },
    category: "Ethnic Wear",
    images: [
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&q=80",
    ],
    price: 4499,
    discountPrice: 3299,
    discountPercent: 27,
    rating: 4.8,
    reviewCount: 476,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rose Gold", "Teal", "Peach"],
    isNew: false,
    isBestseller: true,
    inStock: true,
    joinedAt: "2023-02-08",
    popularity: 96,
  },
  {
    _id: "p11",
    name: "Cargo Jogger Pants",
    slug: "cargo-jogger-pants",
    store: { name: "Urban Stitch", slug: "urban-stitch" },
    category: "Streetwear",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
    ],
    price: 2499,
    discountPrice: 1899,
    discountPercent: 24,
    rating: 4.3,
    reviewCount: 132,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Olive", "Black", "Stone"],
    isNew: false,
    isBestseller: false,
    inStock: true,
    joinedAt: "2023-07-25",
    popularity: 72,
  },
  {
    _id: "p12",
    name: "Puffer Jacket — Quilted",
    slug: "puffer-jacket-quilted",
    store: { name: "Frost & Wool", slug: "frost-wool" },
    category: "Winterwear",
    images: [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=500&q=80",
    ],
    price: 8999,
    discountPrice: 6499,
    discountPercent: 28,
    rating: 4.7,
    reviewCount: 201,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Dusty Pink", "Forest Green"],
    isNew: true,
    isBestseller: false,
    inStock: true,
    joinedAt: "2024-01-10",
    popularity: 84,
  },
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

  return (
    <Link
      to={`/products/${product.slug}`}
      className="product-card"
      style={style}
    >
      {/* Image */}
      <div className="product-card__img-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-card__badges">
          {product.discountPercent > 0 && (
            <span className="pc-badge pc-badge--discount">
              -{product.discountPercent}%
            </span>
          )}
          {product.isNew && <span className="pc-badge pc-badge--new">New</span>}
          {product.isBestseller && (
            <span className="pc-badge pc-badge--best">Bestseller</span>
          )}
        </div>

        {/* Wishlist */}
        <WishlistButton
          productId={product._id}
          className="product-card__wishlist"
        />

        {/* Quick Add to Cart overlay */}
        <div className="product-card__overlay">
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
        {/* Store */}
        <Link
          to={`/stores/${product.store.slug}`}
          className="product-card__store"
          onClick={(e) => e.stopPropagation()}
        >
          {product.store.name}
        </Link>

        {/* Name */}
        <h3 className="product-card__name">{product.name}</h3>

        {/* Rating */}
        <div className="product-card__rating">
          <StarIcon />
          <span className="product-card__rating-num">
            {product.rating.toFixed(1)}
          </span>
          <span className="product-card__rating-cnt">
            ({product.reviewCount})
          </span>
        </div>

        {/* Sizes preview */}
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
      {/* Mobile backdrop */}
      {isOpen && <div className="filter-backdrop" onClick={onClose} />}

      <aside
        className={`filter-sidebar${isOpen ? " filter-sidebar--open" : ""}`}
      >
        <div className="filter-sidebar__head">
          <h3 className="filter-sidebar__title">Filters</h3>
          {activeCount > 0 && (
            <button className="filter-sidebar__clear" onClick={onClear}>
              Clear all
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
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    // 🔁 Replace with: api.get("/products").then(r => setProducts(r.data.products))
    const t = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const toggleSize = useCallback((size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setActiveCategory("All");
    setSortBy("popular");
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setMinRating(0);
  }, []);

  const activeFilterCount = useMemo(
    () =>
      (search ? 1 : 0) +
      (activeCategory !== "All" ? 1 : 0) +
      (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
      (selectedSizes.length > 0 ? 1 : 0) +
      (minRating > 0 ? 1 : 0),
    [search, activeCategory, priceRange, selectedSizes, minRating],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products
      .filter((p) => {
        const matchSearch =
          p.name.toLowerCase().includes(q) ||
          p.store.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        const matchCat =
          activeCategory === "All" || p.category === activeCategory;
        const matchPrice =
          (p.discountPrice || p.price) >= priceRange[0] &&
          (p.discountPrice || p.price) <= priceRange[1];
        const matchSize =
          selectedSizes.length === 0 ||
          selectedSizes.some((s) => p.sizes.includes(s));
        const matchRating = p.rating >= minRating;
        return (
          matchSearch && matchCat && matchPrice && matchSize && matchRating
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.joinedAt) - new Date(a.joinedAt);
        if (sortBy === "price_asc")
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        if (sortBy === "price_desc")
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "discount") return b.discountPercent - a.discountPercent;
        return b.popularity - a.popularity; // popular (default)
      });
  }, [
    products,
    search,
    activeCategory,
    priceRange,
    selectedSizes,
    minRating,
    sortBy,
  ]);

  return (
    <main className="products-page">
      {/* ── Hero / Top bar ───────────────────────────────────────────────── */}
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
                : `${products.length} styles from top clothing brands across India`}
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
              onChange={(e) => setSearch(e.target.value)}
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

      {/* ── Body: Sidebar + Grid ─────────────────────────────────────────── */}
      <div className="products-body">
        <div className="products-body__container">
          {/* Sidebar */}
          <FilterSidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedSizes={selectedSizes}
            toggleSize={toggleSize}
            minRating={minRating}
            setMinRating={setMinRating}
            onClear={clearAll}
            activeCount={activeFilterCount}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main content */}
          <div className="products-main">
            {/* Toolbar */}
            <div className="products-toolbar">
              <div className="products-toolbar__left">
                {/* Mobile filter toggle */}
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
              <div className="products-grid">
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    style={{ animationDelay: `${i * 0.055}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
