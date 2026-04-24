import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Star, Truck, ShieldCheck, RotateCcw, ChevronRight, Check, Plus, Minus, ShoppingBag, Heart, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { products as mockProducts } from "../../data/mockData";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate loading
    const timer = setTimeout(() => {
      const p = mockProducts.find(item => item.id === slug);
      if (p) {
        setProduct(p);
        document.title = `${p.name} | ClothMart Digital Atelier`;
      }
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [slug]);

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error("Please select a size", {
        style: { borderRadius: '2px', background: '#0E0E0E', color: '#fff' }
      });
      return;
    }
    addToCart(product, qty, selectedSize);
    toast.success("Added to Atelier Bag", {
      style: { borderRadius: '2px', background: '#0E0E0E', color: '#fff' }
    });
  };

  const handleBuyNow = () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error("Please select a size", {
        style: { borderRadius: '2px', background: '#0E0E0E', color: '#fff' }
      });
      return;
    }
    addToCart(product, qty, selectedSize);
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 min-h-screen flex flex-col md:flex-row gap-20">
        <div className="w-full md:w-1/2 aspect-[4/5] skeleton rounded-sm" />
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <div className="w-32 h-4 skeleton" />
          <div className="w-full h-16 skeleton" />
          <div className="w-40 h-8 skeleton" />
          <div className="w-full h-40 skeleton" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-display font-bold text-primary mb-6 tracking-tight">Atelier Item Not Found</h2>
        <Link to="/products" className="bg-primary text-white px-12 py-5 rounded-sm font-bold uppercase tracking-[0.2em] text-[11px]">
          Return to Collections
        </Link>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);

  return (
    <main className="bg-background pt-32 pb-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Breadcrumb - Minimalist */}
        <nav className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-12">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-gray-200">/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Collections</Link>
          <span className="text-gray-200">/</span>
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          {/* LEFT: IMAGE GALLERY - Editorial Presentation */}
          <div className="w-full lg:w-3/5">
            <div className="flex flex-col gap-6">
              <div className="relative aspect-[4/5] bg-surface-low rounded-sm overflow-hidden group">
                <img 
                  src={product.images?.[activeImg]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.22, 1, 0.36, 1)] group-hover:scale-105" 
                />
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-8 right-8 p-4 rounded-full backdrop-blur-xl transition-all duration-500 shadow-2xl ${isWished ? 'bg-accent text-primary' : 'bg-white/10 text-white hover:bg-white/30'}`}
                >
                  <Heart size={20} fill={isWished ? "currentColor" : "none"} strokeWidth={2} />
                </button>
              </div>
              
              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImg(idx)}
                      className={`aspect-[4/5] rounded-sm overflow-hidden border-2 transition-all duration-500 ${activeImg === idx ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO - Drama & Space */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <div className="sticky top-32">
              <div className="mb-12">
                <span className="text-accent text-[11px] font-bold uppercase tracking-[0.4em] block mb-6">{product.store}</span>
                <h1 className="text-5xl xl:text-6xl font-display font-bold text-primary tracking-tighter leading-none mb-8">{product.name}</h1>
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-display font-bold text-primary">${product.price.toFixed(2)}</span>
                  <div className="w-px h-6 bg-gray-100" />
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-accent" fill="currentColor" />
                    <span className="text-[11px] font-bold tracking-widest text-primary uppercase">4.9 (24 Reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                {/* Size Selection */}
                {product.sizes?.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Select Size</h3>
                      <button className="text-[9px] uppercase font-bold tracking-[0.2em] text-primary border-b border-primary pb-1">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-14 h-14 rounded-sm flex items-center justify-center text-[11px] font-bold transition-all border ${
                            selectedSize === s 
                              ? "bg-primary text-white border-primary shadow-xl" 
                              : "bg-transparent text-gray-400 border-gray-100 hover:border-gray-300"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Actions */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-surface-low rounded-sm p-1">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-white transition-colors rounded-sm text-gray-400">
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center text-[12px] font-bold">{qty}</span>
                      <button onClick={() => setQty(q => q + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-white transition-colors rounded-sm text-gray-400">
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                      <Check size={14} /> Limited Stock Available
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={handleAddToCart}
                      className="py-5 bg-white border border-primary text-primary text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-primary hover:text-white transition-all duration-500 rounded-sm"
                    >
                      Add to Bag
                    </button>
                    <button 
                      onClick={handleBuyNow}
                      className="py-5 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-accent hover:text-primary transition-all duration-500 rounded-sm shadow-2xl"
                    >
                      Instant Purchase
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="pt-12 border-t border-gray-50">
                  <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6">Atelier Insight</h3>
                  <p className="text-sm font-light leading-relaxed text-gray-500 italic">
                    "{product.description}"
                  </p>
                </div>

                {/* Perks */}
                <div className="grid grid-cols-3 gap-6 pt-12 border-t border-gray-50">
                  <div className="flex flex-col items-center text-center gap-3">
                    <Truck size={20} strokeWidth={1} className="text-accent" />
                    <span className="text-[9px] uppercase font-bold tracking-[0.1em] text-gray-400">Global Shipping</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-3">
                    <RotateCcw size={20} strokeWidth={1} className="text-accent" />
                    <span className="text-[9px] uppercase font-bold tracking-[0.1em] text-gray-400">Easy Returns</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-3">
                    <ShieldCheck size={20} strokeWidth={1} className="text-accent" />
                    <span className="text-[9px] uppercase font-bold tracking-[0.1em] text-gray-400">Authentic Only</span>
                  </div>
                </div>

                <button className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-300 hover:text-primary transition-colors">
                  <Share2 size={14} /> Share Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
