import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Star } from "lucide-react";
import ProductCard from "../../components/ui/ProductCard";
import { products as mockProducts, categories as mockCategories } from "../../data/mockData";

const SIZES = ["S", "M", "L", "XL"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Shop | ClothMart Digital Atelier";
    // Simulate loading
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleSize = useCallback((size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setActiveCategory("All");
    setSortBy("newest");
    setSelectedSizes([]);
  }, []);

  const filtered = useMemo(() => {
    let result = products;

    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }

    if (search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.store.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => 
        selectedSizes.some(s => p.sizes?.includes(s))
      );
    }

    if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, activeCategory, sortBy, selectedSizes]);

  const FilterContent = () => (
    <div className="flex flex-col space-y-12">
      {/* Category */}
      <div>
        <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6">Collections</h4>
        <div className="flex flex-col space-y-2">
          {mockCategories.map((cat) => (
            <button
              key={cat}
              className={`flex items-center justify-between px-4 py-3 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat ? "bg-primary text-white" : "text-gray-500 hover:bg-surface-low hover:text-primary"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6">Sizes</h4>
        <div className="flex flex-wrap gap-3">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`w-12 h-12 rounded-sm flex items-center justify-center text-[11px] font-bold transition-all border ${
                selectedSizes.includes(size) ? "bg-primary text-white border-primary" : "bg-transparent text-gray-500 border-gray-100 hover:border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      {/* Clear All */}
      <button 
        onClick={clearAll}
        className="text-[10px] uppercase font-bold tracking-[0.15em] text-accent hover:text-primary transition-colors text-left"
      >
        Reset Filters —
      </button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-background"
    >
      {/* PAGE HEADER - Minimalist Editorial */}
      <div className="bg-surface-low pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Curated Range</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-primary tracking-tighter mb-6">The Selection</h1>
              <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-lg">
                Discover a meticulously curated selection of premium apparel and artisanal accessories.
              </p>
            </div>
            
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={16} strokeWidth={2} />
              <input
                type="text"
                placeholder="SEARCH ATELIER..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white rounded-sm text-[11px] font-bold tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-accent/30 shadow-2xl placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-20">
        <div className="flex flex-col md:flex-row gap-16">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <FilterContent />
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-16 pb-6 border-b border-gray-50">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-primary"
                >
                  <SlidersHorizontal size={14} /> Filter
                </button>
                <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                  Showing <span className="text-primary">{filtered.length}</span> results
                </p>
              </div>

              <div className="flex items-center gap-4">
                 <span className="text-[10px] text-gray-300 uppercase font-bold tracking-[0.2em]">Sort By:</span>
                 <select
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value)}
                   className="bg-transparent text-primary text-[11px] font-bold uppercase tracking-widest outline-none cursor-pointer"
                 >
                   {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                 </select>
              </div>
            </div>

            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="flex flex-col gap-6">
                     <div className="w-full aspect-[3/4] skeleton rounded-sm" />
                     <div className="w-3/4 h-4 skeleton rounded-sm" />
                     <div className="w-1/4 h-4 skeleton rounded-sm" />
                   </div>
                 ))}
               </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40 text-center">
                <h3 className="text-3xl font-display font-bold text-primary mb-6">Nothing found in Atelier</h3>
                <p className="text-gray-400 max-w-sm mb-10 text-sm font-light">Try adjusting your filters to see more from our collection.</p>
                <button onClick={clearAll} className="bg-primary text-white px-10 py-4 rounded-sm text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-accent hover:text-primary transition-all">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] bg-white z-[70] flex flex-col md:hidden pt-32 px-10 overflow-y-auto"
            >
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-display font-bold">Filter</h3>
                  <button onClick={() => setSidebarOpen(false)}><X size={24} /></button>
               </div>
               <FilterContent />
               <div className="mt-12 pb-12">
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="w-full bg-primary text-white py-5 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em]"
                  >
                    Apply Filters
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
