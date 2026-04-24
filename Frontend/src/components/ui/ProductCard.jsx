import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWished = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addToCart(product, 1, product.sizes?.[0] || 'One Size');
    toast.success(`${product.name} added to cart`, {
      style: {
        borderRadius: '2px',
        background: '#0E0E0E',
        color: '#fff',
        fontSize: '12px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    toast(isWished ? "Removed from wishlist" : "Added to wishlist", {
      icon: isWished ? '🤍' : '🖤',
      style: {
        borderRadius: '2px',
        background: '#0E0E0E',
        color: '#fff',
        fontSize: '12px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }
    });
  };

  return (
    <div className="group relative flex flex-col bg-transparent overflow-hidden">
      {/* Image Area - Tonal Layering (No Borders) */}
      <Link 
        to={`/products/${product.id}`} 
        className="relative aspect-[3/4] overflow-hidden bg-surface-low rounded-sm transition-all duration-700"
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22, 1, 0.36, 1)] group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex w-full h-full items-center justify-center bg-gray-100">
             <span className="text-gray-400 text-[10px] uppercase tracking-widest">No Image</span>
          </div>
        )}

        {/* Ambient Overlay on Hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Wishlist Button - Floating & Minimal */}
        <button
          onClick={handleWishlist}
          className={`absolute top-5 right-5 p-3 rounded-full backdrop-blur-md transition-all duration-500 z-10 
            active:scale-90 md:opacity-0 md:translate-y-[-10px] md:group-hover:opacity-100 md:group-hover:translate-y-0
            ${isWished ? "bg-accent text-primary shadow-xl" : "bg-white/20 text-white hover:bg-white/40"}`}
          aria-label="Wishlist"
        >
          <Heart 
            size={16} 
            fill={isWished ? "currentColor" : "none"} 
            strokeWidth={isWished ? 0 : 2}
            className={`transition-transform duration-500 ${isWished ? 'scale-110' : 'scale-100'}`} 
          />
        </button>

        {/* Quick Add Overlay - Editorial Style */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)] hidden md:block group-hover:translate-y-0 group-hover:opacity-100">
          <button 
            className="w-full bg-primary text-white py-4 rounded-sm font-bold text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 hover:bg-accent hover:text-primary active:scale-[0.98] shadow-2xl"
            onClick={handleQuickAdd}
          >
            <ShoppingBag size={14} strokeWidth={2} /> QUICK ADD
          </button>
        </div>
      </Link>

      {/* Info Area - Clean Typography */}
      <div className="pt-6 pb-2 flex flex-col items-start">
        <div className="w-full flex justify-between items-start mb-2">
          <Link to={`/products/${product.id}`} className="flex-grow pr-4">
            <h3 className="text-[11px] uppercase font-bold tracking-[0.15em] text-primary transition-colors hover:text-accent line-clamp-1">
              {product.name}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 tracking-wider uppercase font-medium">{product.store}</p>
          </Link>
          <span className="text-[13px] font-display font-bold text-primary tracking-tight">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        {/* Tags - Subtle background shift */}
        {product.tags && (
          <div className="flex gap-2 mt-2">
            {product.tags.slice(0, 1).map(tag => (
              <span key={tag} className="text-[9px] uppercase tracking-[0.1em] font-bold text-gray-400 bg-surface-low px-2 py-1 rounded-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
