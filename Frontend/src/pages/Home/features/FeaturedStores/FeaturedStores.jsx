import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../../utils/api";
import "./FeaturedStores.scss";

// ── Skeleton ──────────────────────────────────────────────────────────────────
const StoreSkeleton = () => (
  <div className="store-skeleton">
    <div className="store-skeleton__banner" />
    <div className="store-skeleton__body">
      <div className="store-skeleton__line store-skeleton__line--md" />
      <div className="store-skeleton__line store-skeleton__line--sm" />
      <div className="store-skeleton__line store-skeleton__line--lg" />
    </div>
  </div>
);

// ── Store Card ────────────────────────────────────────────────────────────────
const StoreCard = ({ store }) => (
  <Link to={`/stores/${store._id}`} className="store-card">
    <div className="store-card__banner">
      {store.banner ? (
        <img src={store.banner} alt={store.name} loading="lazy" />
      ) : (
        <div className="store-card__banner-fallback">🏪</div>
      )}
      <span className="store-card__badge">{store.category}</span>
    </div>

    <div className="store-card__body">
      <div className="store-card__header">
        {store.logo && (
          <img src={store.logo} alt="" className="store-card__logo" />
        )}
        <span className="store-card__arrow">↗</span>
      </div>
      <h3 className="store-card__name">{store.name}</h3>
      <p className="store-card__desc">
        {store.description || "Discover our premium cloth collection."}
      </p>
      <div className="store-card__footer">
        <div className="store-card__rating">
          <span className="store-card__star">★</span>
          {store.rating > 0 ? store.rating.toFixed(1) : "New"}
        </div>
        <span className="store-card__city">
          📍 {store.address?.city || "India"}
        </span>
      </div>
    </div>
  </Link>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const FeaturedStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/stores?limit=6")
      .then((r) => setStores(r.data.stores || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="featured-stores">
      <div className="featured-stores__inner">
        <div className="featured-stores__top">
          <div>
            <span className="featured-stores__label">Discover</span>
            <h2 className="featured-stores__heading">Featured Stores</h2>
          </div>
          <Link to="/stores" className="featured-stores__viewall">
            All stores
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

        {loading ? (
          <div className="featured-stores__grid">
            {[...Array(6)].map((_, i) => (
              <StoreSkeleton key={i} />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <p className="featured-stores__empty">
            No stores yet. Check back soon!
          </p>
        ) : (
          <div className="featured-stores__grid">
            {stores.map((s) => (
              <StoreCard key={s._id} store={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedStores;
