import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import api from "../../utils/api";
import ProductCard from "../../components/ui/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "ClothMart | Premium Fashion";
    api
      .get("/products?limit=8&sort=newest")
      .then((r) => setProducts(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full flex flex-col bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full h-[70vh] md:h-[85vh] bg-gray-100 overflow-hidden flex items-center justify-center">
        {/* Placeholder for real hero image - using a subtle abstract background for now or you can put premium photo URL */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Fashion Hero" 
            className="w-full h-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-black/30 md:bg-black/20" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10 md:mt-0"
        >
          <span className="block text-white/90 text-sm md:text-base font-semibold tracking-[0.2em] uppercase mb-4">
            New Collection 2026
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Elevate Your <br /> Everyday Style.
          </h1>
          <p className="text-white/90 text-base md:text-xl font-medium max-w-2xl mx-auto mb-10 hidden md:block">
            Discover the latest trends from premium verified stores across India.
          </p>
          <Link 
            to="/products"
            className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
          >
            Shop Now <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-gray-900 mb-2">
              Trending Now
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              The styles everyone is talking about.
            </p>
          </div>
          <Link 
            to="/products" 
            className="mt-4 md:mt-0 inline-flex items-center text-sm font-semibold hover:text-gray-600 transition-colors border-b border-black pb-1 w-max"
          >
            View All Collection
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
          {loading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl" />
                  <div className="w-24 h-3 bg-gray-200 animate-pulse rounded" />
                  <div className="w-full h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />
                </div>
              ))
            : products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-10 pb-24 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gray-50 rounded-3xl mx-2 mb-10 md:mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-gray-900 mb-2">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[800px] md:h-[500px]">
          {/* Men */}
          <Link to="/products?category=men" className="group relative rounded-2xl overflow-hidden h-full">
            <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop" alt="Men" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h3 className="text-3xl font-heading font-bold text-white mb-2">Men</h3>
              <span className="text-white/80 text-sm font-medium uppercase tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all">Explore <ArrowRight size={16} /></span>
            </div>
          </Link>

          {/* Women */}
          <Link to="/products?category=women" className="group relative rounded-2xl overflow-hidden h-full">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" alt="Women" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h3 className="text-3xl font-heading font-bold text-white mb-2">Women</h3>
              <span className="text-white/80 text-sm font-medium uppercase tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all">Explore <ArrowRight size={16} /></span>
            </div>
          </Link>

          {/* Accessories */}
          <Link to="/products?category=accessories" className="group relative rounded-2xl overflow-hidden h-full">
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop" alt="Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h3 className="text-3xl font-heading font-bold text-white mb-2">Accessories</h3>
              <span className="text-white/80 text-sm font-medium uppercase tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all">Explore <ArrowRight size={16} /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="border-t border-gray-100 bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Truck size={24} className="text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Free Shipping</h4>
              <p className="text-gray-500 text-sm">On all orders over ₹999.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <RotateCcw size={24} className="text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Free Returns</h4>
              <p className="text-gray-500 text-sm">30 days return policy.</p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={24} className="text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Secure Payments</h4>
              <p className="text-gray-500 text-sm">100% secure checkout.</p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-gray-900" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Premium Quality</h4>
              <p className="text-gray-500 text-sm">Verified stores only.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
