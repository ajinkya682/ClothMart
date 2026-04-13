import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Star, Truck, ShieldCheck, RotateCcw, ChevronRight, Check, Plus, Minus, ShoppingBag, Heart } from "lucide-react";
import toast from "react-hot-toast";

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const initials = review.user?.name
    ? review.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <div className="py-6 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{review.user?.name || "Customer"}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={12} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} fill="currentColor" />
              ))}
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>
      {review.comment && <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>}
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
  const [wished, setWished] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // ── Fetch product ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        const p = res.data.product;
        setProduct(p);
        document.title = `${p.name} | ClothMart`;
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
  }, [product]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const validateSelection = () => {
    if (product.sizes?.length && !selectedSize) {
      setSizeError(true);
      document.getElementById('size-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    setSizeError(false);
    return true;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) return toast.error("Please login to add to cart");
    if (!validateSelection()) return;
    addToCart(product, qty, selectedSize, selectedColor);
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) return navigate("/login");
    if (!validateSelection()) return;
    addToCart(product, qty, selectedSize, selectedColor);
    navigate("/checkout");
  };

  const handleReviewSubmit = async () => {
    if (!isAuthenticated) return navigate("/login");
    setReviewLoading(true);
    try {
      await api.post("/reviews", {
        product: product._id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      toast.success("Review submitted successfully");
      setReviewComment("");
      setReviewRating(5);
      // refetch
      const res = await api.get(`/reviews?product=${product._id}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh] flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2 rounded-2xl bg-gray-100 aspect-[3/4] md:aspect-square animate-pulse" />
        <div className="w-full md:w-1/2 flex flex-col pt-4">
          <div className="w-32 h-4 bg-gray-100 animate-pulse rounded mb-4" />
          <div className="w-3/4 h-10 bg-gray-100 animate-pulse rounded mb-6" />
          <div className="w-24 h-6 bg-gray-100 animate-pulse rounded mb-8" />
          <div className="w-full h-1 bg-gray-50 mb-8" />
          <div className="flex gap-4 mb-4">
            {[1, 2, 3, 4].map(k => <div key={k} className="w-12 h-12 rounded-full bg-gray-100 animate-pulse" />)}
          </div>
          <div className="w-full h-12 bg-gray-100 animate-pulse rounded-full mt-10" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-sm">The product you are looking for might have been removed or is temporarily unavailable.</p>
        <Link to="/products" className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : null;
  const inStock = product.stock > 0;

  return (
    <main className="bg-white pb-32 md:pb-0">
      
      {/* Breadcrumb */}
      <nav className="bg-gray-50 py-3 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center text-xs font-medium text-gray-500 whitespace-nowrap overflow-x-auto hide-scrollbar">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/products" className="hover:text-black">Products</Link>
          {product.store && (
            <>
              <ChevronRight size={14} className="mx-2" />
              <Link to={`/stores/${product.store.slug}`} className="hover:text-black">{product.store.name}</Link>
            </>
          )}
          <ChevronRight size={14} className="mx-2 text-gray-300" />
          <span className="text-gray-900 truncate max-w-[200px] sm:max-w-md">{product.name}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-0 md:px-4 sm:px-6 lg:px-8 py-0 md:py-10">
        <div className="flex flex-col md:flex-row gap-0 md:gap-12 lg:gap-16">
          
          {/* ── Left: Image Gallery ─────────────────────────────────────────────── */}
          <div className="w-full md:w-1/2 flex flex-col">
            
            {/* Mobile Swipe Gallery */}
            <div className="w-full relative md:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar bg-gray-50 h-[60vh]">
              {product.images?.map((img, idx) => (
                <div key={idx} className="min-w-full h-full snap-center relative">
                  <img src={img || "/placeholder.jpg"} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {product.images.length > 1 && product.images.map((_, dotIdx) => (
                      <div key={dotIdx} className={`w-2 h-2 rounded-full shadow-sm transition-all ${idx === dotIdx ? "bg-black scale-110" : "bg-white/70"}`} />
                    ))}
                  </div>
                </div>
              ))}
              {discount && <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full z-10 shadow-md">Sale -{discount}%</span>}
              <button 
                onClick={() => { setWished(!wished); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full text-gray-700 shadow-sm z-10"
              >
                <Heart size={20} fill={wished ? "red" : "none"} color={wished ? "red" : "currentColor"} className="transition-all" />
              </button>
            </div>

            {/* Desktop Gallery */}
            <div className="hidden md:flex flex-col gap-4 sticky top-24">
              <div className="w-full aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative">
                <img src={product.images?.[activeImg] || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover cursor-zoom-in" />
                {discount && <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full z-10 shadow-md">Sale -{discount}%</span>}
                <button 
                  onClick={() => { setWished(!wished); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full text-gray-700 hover:text-red-500 shadow-sm z-10 hover:shadow-md transition-all"
                >
                  <Heart size={20} fill={wished ? "currentColor" : "none"} className={wished ? "text-red-500" : ""} />
                </button>
              </div>
              {product.images?.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImg(idx)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImg === idx ? "border-black" : "border-transparent opacity-70 hover:opacity-100"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Product Info ───────────────────────────────────────────────── */}
          <div className="w-full md:w-1/2 flex flex-col px-4 md:px-0 py-6 md:py-0">
            
            {/* Header Info */}
            <div className="mb-6">
               {product.store && (
                 <Link to={`/stores/${product.store.slug}`} className="inline-block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 hover:text-black transition-colors">
                   {product.store.name}
                 </Link>
               )}
               <h1 className="text-2xl md:text-4xl font-heading font-bold text-gray-900 leading-tight mb-4">{product.name}</h1>
               
               <div className="flex items-center gap-4 flex-wrap">
                 <div className="flex items-end gap-3">
                   <span className="text-2xl md:text-3xl font-bold text-gray-900">₹{(product.discountPrice || product.price).toLocaleString("en-IN")}</span>
                   {product.discountPrice && (
                     <span className="text-lg text-gray-400 line-through mb-1">₹{product.price.toLocaleString("en-IN")}</span>
                   )}
                 </div>
                 {product.rating > 0 && (
                   <div className="flex items-center gap-2 border-l border-gray-200 pl-4 h-6">
                     <span className="flex items-center text-yellow-400">
                       <Star size={16} fill="currentColor" />
                     </span>
                     <span className="text-sm font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
                     <span className="text-sm text-gray-500 underline cursor-pointer">({product.reviewCount} reviews)</span>
                   </div>
                 )}
               </div>
            </div>

            <div className="w-full h-px bg-gray-100 mb-8" />
            
            {/* Selectors */}
            <div className="flex flex-col gap-8 mb-8" id="size-selector">
              {/* Size Selector */}
              {product.sizes?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Select Size</span>
                    <button className="text-xs text-gray-500 underline font-medium hover:text-black">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSelectedSize(s); setSizeError(false); }}
                        className={`w-14 h-14 rounded-full font-medium transition-all ${
                          selectedSize === s 
                            ? "bg-black text-white ring-2 ring-black ring-offset-2" 
                            : sizeError 
                              ? "bg-white text-red-500 border border-red-500 ring-2 ring-red-100" 
                              : "bg-white text-gray-700 border border-gray-200 hover:border-black"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {sizeError && <span className="text-xs text-red-500 font-medium mt-3 flex items-center gap-1">Please select a size to proceed</span>}
                </div>
              )}

               {/* Color Flow */}
               {product.colors?.length > 0 && (
                 <div>
                   <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 block">Color: <span className="font-normal text-gray-500 normal-case">{selectedColor}</span></span>
                   <div className="flex flex-wrap gap-3">
                     {product.colors.map((c) => (
                       <button
                         key={c}
                         onClick={() => setSelectedColor(c)}
                         className={`px-6 py-3 rounded-full text-sm font-medium border transition-all ${
                           selectedColor === c ? "border-black bg-gray-50 text-black" : "border-gray-200 text-gray-600 hover:border-gray-400"
                         }`}
                       >
                         {c}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

               {/* Quantity & Actions (Desktop) */}
               <div className="hidden md:flex flex-col gap-4">
                 <div className="flex items-center gap-4">
                   {/* Qty */}
                   <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 w-32 justify-between">
                     <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-l-full">
                       <Minus size={16} />
                     </button>
                     <span className="font-semibold text-gray-900 w-8 text-center">{qty}</span>
                     <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-r-full">
                       <Plus size={16} />
                     </button>
                   </div>
                   
                   <p className={`text-sm font-medium flex items-center gap-2 ${inStock ? (product.stock < 10 ? 'text-orange-500' : 'text-green-600') : 'text-red-500'}`}>
                     {inStock ? <Check size={16} /> : <X size={16} />}
                     {inStock ? (product.stock < 10 ? `Only ${product.stock} left in stock` : 'In Stock') : 'Out of Stock'}
                   </p>
                 </div>

                 <div className="flex flex-col gap-3 mt-4">
                    <button 
                      onClick={handleAddToCart}
                      disabled={!inStock}
                      className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${inStock ? 'bg-white border-2 border-black text-black hover:bg-black hover:text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-100'}`}
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={handleBuyNow}
                      disabled={!inStock}
                      className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-md ${inStock ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      Buy Now
                    </button>
                 </div>
               </div>
            </div>

            {/* Product description & perks */}
            <div className="prose prose-sm text-gray-600 mb-10 max-w-none">
              <h4 className="text-gray-900 font-semibold mb-2">Product Description</h4>
              <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-gray-100 mb-10">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                <Truck size={24} className="text-gray-900 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm mb-0.5">Free Shipping</h5>
                  <p className="text-xs text-gray-500">On all orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                <RotateCcw size={24} className="text-gray-900 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm mb-0.5">Easy Returns</h5>
                  <p className="text-xs text-gray-500">14-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                <ShieldCheck size={24} className="text-gray-900 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm mb-0.5">Secure Checkout</h5>
                  <p className="text-xs text-gray-500">SSL encrypted payment</p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-heading text-gray-900">Customer Reviews <span className="text-gray-400 font-normal text-lg ml-1">({reviews.length})</span></h2>
              </div>

              {/* Review Form */}
              {isAuthenticated && user?.role === "customer" && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <Star size={24} fill="currentColor" className={star <= (hoverRating || reviewRating) ? "text-yellow-400" : "text-gray-300"} />
                      </button>
                    ))}
                    <span className="text-sm font-medium text-gray-500 ml-2 w-20">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hoverRating || reviewRating]}
                    </span>
                  </div>
                  
                  <textarea
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all mb-4 resize-none"
                    placeholder="What did you like or dislike?"
                    value={reviewComment}
                    rows={3}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                  
                  <button
                    onClick={handleReviewSubmit}
                    disabled={reviewLoading}
                    className={`px-6 py-3 rounded-full text-sm font-bold tracking-wide uppercase transition-colors ${reviewLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              )}

              {/* Review List */}
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-2xl">
                  <Star size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY ADD TO CART BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe shadow-[-0_10px_40px_-15px_rgba(0,0,0,0.1)] z-40 flex gap-3 animate-slide-up bg-white/90 backdrop-blur-md">
        <div className="flex items-center border border-gray-200 rounded-full bg-white w-28 justify-between flex-shrink-0">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-12 flex items-center justify-center text-gray-500 active:text-black transition-colors rounded-l-full">
            <Minus size={16} />
          </button>
          <span className="font-semibold text-gray-900 w-8 text-center text-sm">{qty}</span>
          <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-8 h-12 flex items-center justify-center text-gray-500 active:text-black transition-colors rounded-r-full">
            <Plus size={16} />
          </button>
        </div>
        <button 
          onClick={handleBuyNow}
          disabled={!inStock}
          className={`flex-1 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-transform active:scale-95 ${inStock ? 'bg-black text-white shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {inStock ? 'Buy Now' : 'Out of Stock'}
        </button>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pb-safe { padding-bottom: calc(env(safe-area-inset-bottom) + 16px); }
      `}} />
    </main>
  );
}
