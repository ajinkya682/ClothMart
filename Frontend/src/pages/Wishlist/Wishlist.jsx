import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../components/ui/ProductCard";

export default function Wishlist() {
  const { wishlistItems, clearWishlist } = useWishlist();

  return (
    <main className="min-h-screen bg-background pt-32 pb-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.4em] block mb-6">Personal Curation</span>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-primary tracking-tighter leading-none mb-10">
              Wishlist.
            </h1>
            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-xl">
              Items you've reserved from our collections. A personal archive of craft and style.
            </p>
          </div>
          
          {wishlistItems.length > 0 && (
            <button 
              onClick={clearWishlist}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-1"
            >
              Clear Archive —
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="py-40 text-center border-t border-gray-50">
            <div className="w-32 h-32 bg-surface-low rounded-full flex items-center justify-center mx-auto mb-10">
              <Heart size={48} strokeWidth={1} className="text-gray-200" />
            </div>
            <h3 className="text-3xl font-display font-bold text-primary mb-6">Archive is Empty</h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-12 font-light leading-relaxed">Your personal curation starts here. Explore our collections and save your favorite pieces.</p>
            <Link to="/products" className="inline-block bg-primary text-white px-12 py-5 rounded-sm text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-accent hover:text-primary transition-all shadow-2xl group">
              Explore Collections <ArrowRight size={16} className="inline-block ml-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24">
            <AnimatePresence>
              {wishlistItems.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
