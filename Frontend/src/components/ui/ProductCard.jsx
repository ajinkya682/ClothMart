import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const [wished, setWished] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const currentPrice = product.discountPrice || product.price;

  return (
    <div 
      className="group relative flex flex-col bg-transparent overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <Link to={`/products/${product.slug || product._id}`} className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-2xl">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex w-full h-full items-center justify-center text-gray-400">
            <ShoppingBag size={32} opacity={0.2} />
          </div>
        )}

        {/* Badges */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full z-10 tracking-widest shadow-sm">
            Sale
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWished(!wished);
            toast.success(wished ? "Removed from wishlist" : "Added to wishlist", {
              icon: wished ? '💔' : '❤️',
            });
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
            wished ? "bg-white/90 text-red-500 shadow-sm" : "bg-white/50 text-gray-700 hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 md:opacity-0"
          } md:group-hover:opacity-100 mobile-opacity-override`}
          aria-label="Wishlist"
        >
          <Heart size={18} fill={wished ? "currentColor" : "none"} strokeWidth={wished ? 0 : 2} />
        </button>
        
        {/* Mobile styling override for touch devices to always show heart */}
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 768px) {
            .mobile-opacity-override { opacity: 1 !important; transform: translateY(0) !important; }
          }
        `}} />

        {/* Quick Add Overlay (Desktop only mostly) */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 translate-y-full transition-transform duration-300 ease-in-out hidden md:block ${isHovered ? 'translate-y-0' : ''}`}>
          <button 
            className="w-full bg-white text-black py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              toast.success("Added to cart");
            }}
          >
            <ShoppingBag size={16} /> Quick Add
          </button>
        </div>
      </Link>

      {/* Info Area */}
      <div className="pt-4 pb-2 px-1">
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-1.5">
          {product.store?.name || "ClothMart"}
        </p>
        <Link to={`/products/${product.slug || product._id}`}>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-1 leading-tight">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">
            ₹{currentPrice}
          </span>
          {discount > 0 && (
            <span className="text-[11px] text-gray-400 line-through">
              ₹{product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
