import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../../utils/api";
import "./TrendingProducts.scss";

// ── Skeleton ──────────────────────────────────────────────────────────────────
const ProdSkeleton = () => (
  <div className="prod-skeleton">
    <div className="prod-skeleton__img" />
    <div className="prod-skeleton__body">
      <div className="prod-skeleton__line prod-skeleton__line--sm" />
      <div className="prod-skeleton__line prod-skeleton__line--lg" />
      <div className="prod-skeleton__line prod-skeleton__line--md" />
    </div>
  </div>
);

// ── Product Card ──────────────────────────────────────────────────────────────
const ProdCard = ({ product }) => {
  const [wished, setWished] = useState(false);

  const discount =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : 0;

  return (
    <Link to={`/products/${product.slug || product._id}`} className="prod-card">
      <div className="prod-card__img-wrap">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} loading="lazy" />
        ) : (
          <div className="prod-card__img-placeholder">👕</div>
        )}

        {discount > 0 && (
          <span className="prod-card__discount">{discount}% OFF</span>
        )}

        <button
          className={`prod-card__wish ${wished ? "prod-card__wish--active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWished((w) => !w);
          }}
          aria-label="Add to wishlist"
        >
          {wished ? "❤️" : "🤍"}
        </button>

        <div className="prod-card__quick">
          <button
            className="prod-card__quick-btn"
            onClick={(e) => e.preventDefault()}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="prod-card__body">
        <p className="prod-card__store">{product.store?.name || "ClothMart"}</p>
        <h3 className="prod-card__name">{product.name}</h3>
        <div className="prod-card__foot">
          <div className="prod-card__price">
            <span className="prod-card__price-now">
              ₹{product.discountPrice || product.price}
            </span>
            {discount > 0 && (
              <span className="prod-card__price-was">₹{product.price}</span>
            )}
          </div>
          {product.rating > 0 && (
            <div className="prod-card__rating">
              <span>★</span>
              {product.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products?limit=8&sort=newest")
      .then((r) => setProducts(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="trending">
      <div className="trending__inner">
        <div className="trending__top">
          <div>
            <span className="trending__label">Trending</span>
            <h2 className="trending__heading">New Arrivals</h2>
          </div>
          <Link to="/products" className="trending__viewall">
            View all
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="trending__grid">
          {loading
            ? [...Array(8)].map((_, i) => <ProdSkeleton key={i} />)
            : products.map((p) => <ProdCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
