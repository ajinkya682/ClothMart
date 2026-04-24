import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, MapPin, Star, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { stores as mockStores } from "../../data/mockData";

function StoreCard({ store, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <Link to={`/stores/${store.id}`} className="relative aspect-[16/10] bg-surface-low rounded-sm overflow-hidden mb-8">
        <img 
          src={store.image} 
          alt={store.name} 
          className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.22, 1, 0.36, 1)] group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute bottom-8 left-8">
           <div className="flex gap-2">
              {store.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-primary rounded-sm shadow-2xl">
                  {tag}
                </span>
              ))}
           </div>
        </div>
      </Link>

      <div className="flex flex-col items-start pr-12">
        <h3 className="text-3xl font-display font-bold text-primary tracking-tight mb-4 group-hover:text-accent transition-colors duration-500">
          {store.name}
        </h3>
        <p className="text-sm font-light text-gray-400 leading-relaxed mb-8 italic">
          "{store.description}"
        </p>
        <Link 
          to={`/stores/${store.id}`} 
          className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-primary hover:text-accent transition-all group/link"
        >
          Enter Atelier <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function Stores() {
  const [search, setSearch] = useState("");
  const [filteredStores, setFilteredStores] = useState(mockStores);

  useEffect(() => {
    document.title = "Flagships | ClothMart Digital Atelier";
    const result = mockStores.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStores(result);
  }, [search]);

  return (
    <main className="min-h-screen bg-background pt-32 pb-40">
      <section className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header - Editorial Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <div className="max-w-2xl">
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.4em] block mb-6">Global Presence</span>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-primary tracking-tighter leading-none mb-10">
              The Flagships.
            </h1>
            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-xl">
              Curated spaces where craft meets modern luxury. Discover the flagship locations of ClothMart across the globe.
            </p>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={16} strokeWidth={2} />
            <input
              type="text"
              placeholder="SEARCH LOCATIONS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-surface-low rounded-sm text-[11px] font-bold tracking-widest uppercase focus:outline-none focus:bg-white focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Stores Grid - Editorial Layout */}
        {filteredStores.length === 0 ? (
          <div className="py-40 text-center border-t border-gray-50">
            <h3 className="text-3xl font-display font-bold text-primary mb-6">No Atelier Found</h3>
            <button onClick={() => setSearch("")} className="text-[11px] font-bold uppercase tracking-widest text-accent border-b border-accent pb-1">Reset Search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
            {filteredStores.map((store, index) => (
              <StoreCard key={store.id} store={store} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="mt-40 bg-primary py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter mb-10">
            Elevating the digital atelier experience through curated craft and timeless design.
          </h2>
          <Link to="/products" className="inline-block bg-white text-primary px-12 py-5 rounded-sm text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-accent hover:text-primary transition-all shadow-2xl">
            Explore All Creations
          </Link>
        </div>
      </section>
    </main>
  );
}
