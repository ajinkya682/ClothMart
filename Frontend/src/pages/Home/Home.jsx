import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import ProductCard from "../../components/ui/ProductCard";
import { products as mockProducts, stores as mockStores } from "../../data/mockData";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "ClothMart | Digital Atelier";
    // Simulate loading
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col bg-background">
      {/* HERO SECTION */}
      <section className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden flex items-center justify-center bg-primary">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Fashion Hero" 
            className="w-full h-full object-cover object-center opacity-60"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.span 
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.25em' }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="block text-accent text-[10px] md:text-xs font-bold uppercase mb-8 tracking-[0.25em]"
          >
            The Digital Atelier
          </motion.span>
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-display text-white mb-10 leading-[0.9] tracking-tighter font-extrabold">
            Elevate <br /> <span className="text-white/90 italic font-light">Your Wardrobe</span>
          </h1>
          <p className="text-white/70 text-sm md:text-lg max-w-xl mx-auto mb-12 font-light leading-relaxed">
            Discover a curated selection of premium apparel crafted for those who define style on their own terms.
          </p>
          <Link 
            to="/products"
            className="inline-flex items-center justify-center gap-3 bg-accent text-primary px-12 py-5 rounded-sm text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:scale-105 active:scale-95 transition-all duration-500 shadow-2xl"
          >
            Explore Collections <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </motion.div>

        {/* Ambient Light Effect */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-32 px-5 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-display tracking-tighter text-primary mb-6 font-bold">
              Curated Edits
            </h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed">
              Explore our handcrafted selections across diverse styles and ages. Defined by quality, designed for longevity.
            </p>
          </div>
          <Link 
            to="/products" 
            className="mt-8 md:mt-0 inline-flex items-center text-[11px] font-bold text-primary hover:text-accent transition-colors pb-1 w-max tracking-[0.15em] uppercase group"
          >
            View All Products 
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 md:gap-x-10 md:gap-y-24">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-6">
                  <div className="w-full aspect-[3/4] skeleton rounded-sm" />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-3/4 h-4 skeleton rounded-sm" />
                    <div className="w-1/4 h-4 skeleton rounded-sm" />
                  </div>
                </div>
              ))
            : products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* CATEGORIES SECTION - Tonal Layering */}
      <section className="bg-surface-low py-24 md:py-32 px-5 sm:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display tracking-tighter text-primary mb-6 font-bold">The Atelier Collections</h2>
            <div className="w-20 h-1 bg-accent mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[1200px] md:h-[700px]">
            {/* Men */}
            <Link to="/products?category=men" className="group relative overflow-hidden h-full rounded-sm">
              <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop" alt="Men" className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.22, 1, 0.36, 1)] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Craftsmanship</span>
                <h3 className="text-4xl font-display text-white mb-6 tracking-tight font-bold">Men</h3>
                <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-500 group-hover:gap-5">
                  Explore Range <span className="text-accent text-lg">→</span>
                </span>
              </div>
            </Link>

            {/* Women */}
            <Link to="/products?category=women" className="group relative overflow-hidden h-full rounded-sm">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" alt="Women" className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.22, 1, 0.36, 1)] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Elegance</span>
                <h3 className="text-4xl font-display text-white mb-6 tracking-tight font-bold">Women</h3>
                <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-500 group-hover:gap-5">
                  Discover Store <span className="text-accent text-lg">→</span>
                </span>
              </div>
            </Link>

            {/* Accessories */}
            <div className="flex flex-col gap-8 h-full">
              <Link to="/products?category=accessories" className="group relative overflow-hidden h-1/2 rounded-sm">
                <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop" alt="Accessories" className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.22, 1, 0.36, 1)] group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-display text-white tracking-tight font-bold">Accessories</h3>
                </div>
              </Link>
              <div className="bg-primary h-1/2 p-10 flex flex-col justify-center rounded-sm">
                <h3 className="text-2xl font-display text-white mb-4 font-bold">Premium Selection</h3>
                <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
                  Defining the future of digital retail through artisanal curation.
                </p>
                <Link to="/stores" className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">
                  Meet the Ateliers →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - Minimal & Premium */}
      <section className="bg-background py-24 md:py-40 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12">
            <div className="flex flex-col group">
              <div className="mb-8 overflow-hidden">
                <Truck size={32} strokeWidth={1} className="text-primary transition-transform duration-500 group-hover:scale-110 group-hover:text-accent" />
              </div>
              <h4 className="text-sm font-bold text-primary mb-4 tracking-[0.1em] uppercase">Fast Delivery</h4>
              <p className="text-gray-400 text-sm font-light leading-relaxed">Global white-glove shipping to over 150 countries worldwide.</p>
            </div>
            
            <div className="flex flex-col group">
              <div className="mb-8 overflow-hidden">
                <RotateCcw size={32} strokeWidth={1} className="text-primary transition-transform duration-500 group-hover:scale-110 group-hover:text-accent" />
              </div>
              <h4 className="text-sm font-bold text-primary mb-4 tracking-[0.1em] uppercase">Sustainable</h4>
              <p className="text-gray-400 text-sm font-light leading-relaxed">Committed to ethical sourcing and reducing our carbon footprint.</p>
            </div>

            <div className="flex flex-col group">
              <div className="mb-8 overflow-hidden">
                <ShieldCheck size={32} strokeWidth={1} className="text-primary transition-transform duration-500 group-hover:scale-110 group-hover:text-accent" />
              </div>
              <h4 className="text-sm font-bold text-primary mb-4 tracking-[0.1em] uppercase">Authenticity</h4>
              <p className="text-gray-400 text-sm font-light leading-relaxed">Every piece is verified by our curation experts for 100% original design.</p>
            </div>

            <div className="flex flex-col group">
              <div className="mb-8 overflow-hidden">
                <ShoppingBag size={32} strokeWidth={1} className="text-primary transition-transform duration-500 group-hover:scale-110 group-hover:text-accent" />
              </div>
              <h4 className="text-sm font-bold text-primary mb-4 tracking-[0.1em] uppercase">24/7 Concierge</h4>
              <p className="text-gray-400 text-sm font-light leading-relaxed">Our style advisors are available around the clock to assist you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER - Minimal Minimalist */}
      <section className="py-24 md:py-32 bg-primary text-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-5 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter mb-8 italic">Join the Atelier</h2>
          <p className="text-white/60 text-lg font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Receive early access to collections, exclusive editorial content, and member-only event invitations.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="flex-grow bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <button className="bg-accent text-primary px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors">
              Subscribe
            </button>
          </form>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 skew-x-12 transform translate-x-1/2 pointer-events-none" />
      </section>
    </div>
  );
}
