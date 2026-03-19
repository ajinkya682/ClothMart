import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "./ProductDetail.scss";

// ─── Icons ────────────────────────────────────────────────────────────────────
const StarIcon = ({ filled }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
  >
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const initials = review.user?.name
    ? review.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
  return (
    <div className="pd-review">
      <div className="pd-review__head">
        <div className="pd-review__avatar">{initials}</div>
        <div>
          <p className="pd-review__name">{review.user?.name || "Customer"}</p>
          <div className="pd-review__stars">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={
                  i < review.rating
                    ? "pd-review__star--on"
                    : "pd-review__star--off"
                }
              >
                <StarIcon filled={i < review.rating} />
              </span>
            ))}
          </div>
        </div>
        <span className="pd-review__date">
          {new Date(review.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      {review.comment && <p className="pd-review__comment">{review.comment}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // ── Fetch product ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        const p = res.data.product;
        setProduct(p);
        if (p.sizes?.length) setSelectedSize(p.sizes[0]);
        if (p.colors?.length) setSelectedColor(p.colors[0]);
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  // ── Fetch reviews ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!product) return;
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews?product=${product._id}`);
        setReviews(res.data.reviews || []);
      } catch {}
    };
    fetchReviews();
  }, [product, reviewSuccess]);

  // ── Add to cart ─────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, qty, selectedSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.sizes?.length && !selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product, qty, selectedSize, selectedColor);
    navigate("/cart");
  };

  // ── Submit review ───────────────────────────────────────────────────────────
  const handleReviewSubmit = async () => {
    if (!isAuthenticated) return navigate("/login");
    setReviewLoading(true);
    setReviewError("");
    try {
      await api.post("/reviews", {
        product: product._id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewSuccess(true);
      setReviewComment("");
      setReviewRating(5);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  const discount = product?.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : null;

  if (loading)
    return (
      <div className="pd-loading">
        <div className="pd-loading__imgs">
          <div className="pd-loading__main" />
          <div className="pd-loading__thumbs">
            {[1, 2, 3].map((i) => (
              <div key={i} className="pd-loading__thumb" />
            ))}
          </div>
        </div>
        <div className="pd-loading__info">
          {[200, 120, 80, 160, 100].map((w, i) => (
            <div key={i} className="pd-loading__line" style={{ width: w }} />
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="pd-error">
        <h2>Product not found</h2>
        <Link to="/products" className="pd-error__back">
          ← Back to products
        </Link>
      </div>
    );

  return (
    <div className="pd-page">
      <div className="pd-container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> /<Link to="/products">Products</Link> /
          {product.store && (
            <Link to={`/stores/${product.store.slug}`}>
              {product.store.name}
            </Link>
          )}
          {product.store && " / "}
          <span>{product.name}</span>
        </div>

        <div className="pd-layout">
          {/* ── Left: Images ─────────────────────────────────────────────── */}
          <div className="pd-gallery">
            <div className="pd-gallery__main">
              <img
                src={product.images?.[activeImg] || "/placeholder.jpg"}
                alt={product.name}
                className="pd-gallery__img"
              />
              {discount && (
                <span className="pd-gallery__badge">{discount}% OFF</span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="pd-gallery__thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-gallery__thumb${activeImg === i ? " pd-gallery__thumb--active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ───────────────────────────────────────────────── */}
          <div className="pd-info">
            {/* Store */}
            {product.store && (
              <Link
                to={`/stores/${product.store.slug}`}
                className="pd-info__store"
              >
                🏪 {product.store.name}
              </Link>
            )}

            <h1 className="pd-info__name">{product.name}</h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="pd-info__rating">
                <div className="pd-info__stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.round(product.rating)
                          ? "pd-star--on"
                          : "pd-star--off"
                      }
                    >
                      <StarIcon filled={i < Math.round(product.rating)} />
                    </span>
                  ))}
                </div>
                <span className="pd-info__rating-val">
                  {product.rating.toFixed(1)}
                </span>
                <span className="pd-info__review-count">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="pd-info__price-block">
              <span className="pd-info__price">
                ₹
                {(product.discountPrice || product.price).toLocaleString(
                  "en-IN",
                )}
              </span>
              {product.discountPrice && (
                <>
                  <span className="pd-info__original">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="pd-info__discount-tag">{discount}% off</span>
                </>
              )}
            </div>

            {/* Stock */}
            <p
              className={`pd-info__stock${product.stock < 10 ? " pd-info__stock--low" : ""}`}
            >
              {product.stock === 0
                ? "❌ Out of stock"
                : product.stock < 10
                  ? `⚠️ Only ${product.stock} left`
                  : "✅ In stock"}
            </p>

            {/* Description */}
            {product.description && (
              <p className="pd-info__desc">{product.description}</p>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="pd-selector">
                <p
                  className={`pd-selector__label${sizeError ? " pd-selector__label--error" : ""}`}
                >
                  Size{" "}
                  {sizeError && (
                    <span className="pd-selector__error">
                      — Please select a size
                    </span>
                  )}
                </p>
                <div className="pd-selector__options">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`pd-selector__chip${selectedSize === s ? " pd-selector__chip--active" : ""}`}
                      onClick={() => {
                        setSelectedSize(s);
                        setSizeError(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="pd-selector">
                <p className="pd-selector__label">
                  Color: <strong>{selectedColor}</strong>
                </p>
                <div className="pd-selector__options">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={`pd-selector__chip${selectedColor === c ? " pd-selector__chip--active" : ""}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="pd-qty">
              <p className="pd-selector__label">Quantity</p>
              <div className="pd-qty__control">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="pd-qty__btn"
                >
                  −
                </button>
                <span className="pd-qty__val">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="pd-qty__btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action buttons */}
            {product.stock > 0 ? (
              <div className="pd-actions">
                <button
                  className={`pd-actions__cart${addedToCart ? " pd-actions__cart--added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={!isAuthenticated}
                >
                  {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
                <button
                  className="pd-actions__buy"
                  onClick={handleBuyNow}
                  disabled={!isAuthenticated}
                >
                  Buy Now
                </button>
                {!isAuthenticated && (
                  <p className="pd-actions__login-hint">
                    <Link to="/login">Sign in</Link> to add to cart
                  </p>
                )}
              </div>
            ) : (
              <button
                className="pd-actions__cart pd-actions__cart--disabled"
                disabled
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>

        {/* ── Reviews Section ────────────────────────────────────────────── */}
        <div className="pd-reviews-section">
          <h2 className="pd-reviews-title">
            Customer Reviews
            <span className="pd-reviews-count">({reviews.length})</span>
          </h2>

          {/* Write review */}
          {isAuthenticated && user?.role === "customer" && (
            <div className="pd-review-form">
              <h3 className="pd-review-form__title">Write a Review</h3>

              {reviewSuccess && (
                <div className="pd-review-form__success">
                  ✓ Review submitted successfully!
                </div>
              )}

              {/* Star picker */}
              <div className="pd-review-form__stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`pd-review-form__star${star <= (hoverRating || reviewRating) ? " pd-review-form__star--on" : ""}`}
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <StarIcon filled={star <= (hoverRating || reviewRating)} />
                  </button>
                ))}
                <span className="pd-review-form__rating-label">
                  {
                    ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                      hoverRating || reviewRating
                    ]
                  }
                </span>
              </div>

              <textarea
                className="pd-review-form__textarea"
                placeholder="Share your experience with this product…"
                value={reviewComment}
                rows={3}
                onChange={(e) => setReviewComment(e.target.value)}
              />

              {reviewError && (
                <p className="pd-review-form__error">{reviewError}</p>
              )}

              <button
                className={`pd-review-form__submit${reviewLoading ? " pd-review-form__submit--loading" : ""}`}
                onClick={handleReviewSubmit}
                disabled={reviewLoading}
              >
                {reviewLoading ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <p className="pd-reviews-empty">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="pd-reviews-list">
              {reviews.map((r) => (
                <ReviewCard key={r._id} review={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
