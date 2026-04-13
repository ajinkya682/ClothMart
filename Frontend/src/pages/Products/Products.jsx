import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Star } from "lucide-react";
import api from "../../utils/api";
import ProductCard from "../../components/ui/ProductCard";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "All", label: "All Products" },
  { value: "men", label: "Men's Fashion" },
  { value: "women", label: "Women's Fashion" },
  { value: "kids", label: "Kids' Wear" },
  { value: "accessories", label: "Accessories" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const RATING_FILTERS = [
  { value: 4, label: "4★ & above" },
  { value: 3, label: "3★ & above" },
  { value: 0, label: "All ratings" },
];

function fmtPrice(n) {
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `₹${n}`;
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ClothMart | Shop Products";
  }, []);

  // ── Fetch from real API ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          sort: sortBy,
        };
        if (search) params.search = search;
        if (activeCategory !== "All") params.category = activeCategory.toLowerCase();
        if (priceRange[0] > 0) params.minPrice = priceRange[0];
        if (priceRange[1] < 10000) params.maxPrice = priceRange[1];

        const res = await api.get("/products", { params });
        setProducts(res.data.products || []);
        setTotalPages(res.data.pages || 1);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, activeCategory, sortBy, priceRange, page]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [sidebarOpen]);

  // Handlers
  const toggleSize = useCallback((size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setActiveCategory("All");
    setSortBy("newest");
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setMinRating(0);
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSize =
        selectedSizes.length === 0 ||
        selectedSizes.some((s) => p.sizes?.includes(s));
      const matchRating = p.rating >= minRating;
      return matchSize && matchRating;
    });
  }, [products, selectedSizes, minRating]);

  const activeFilterCount = useMemo(
    () =>
      (activeCategory !== "All" ? 1 : 0) +
      (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
      (selectedSizes.length > 0 ? 1 : 0) +
      (minRating > 0 ? 1 : 0),
    [activeCategory, priceRange, selectedSizes, minRating],
  );

  // ── FILTER CONTENT COMPONENT ───────────────────────────────────────────────
  const FilterContent = () => (
    <div className="flex flex-col space-y-8">
      {/* Category */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
        <div className="flex flex-col space-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === cat.value ? "bg-black text-white font-medium" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => { setActiveCategory(cat.value); setPage(1); }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
          Price Range <span className="text-xs font-normal text-gray-500">{fmtPrice(priceRange[0])} – {fmtPrice(priceRange[1])}</span>
        </h4>
        <div className="flex flex-col gap-4">
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={priceRange[1]}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v > priceRange[0]) { setPriceRange([priceRange[0], v]); setPage(1); }
            }}
            className="w-full accent-black"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Sizes</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-medium transition-colors ${
                selectedSizes.includes(size) ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-gray-900"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Minimum Rating</h4>
        <div className="flex flex-col space-y-2">
          {RATING_FILTERS.map((r) => (
            <button
              key={r.value}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                minRating === r.value ? "bg-gray-100 font-medium text-black" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setMinRating(r.value)}
            >
              {r.value > 0 ? <Star size={14} className="text-yellow-400 mr-2" fill="currentColor" /> : <div className="w-[14px] mr-2" />}
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white">
      {/* PAGE HEADER */}
      <div className="bg-gray-50 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4 tracking-tight">All Collection</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg">
            Discover premium clothing and accessories optimized for every moment of your journey.
          </p>
          
          <div className="mt-8 relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT DIV */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-100 gap-4">
          <div className="flex items-center w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-full text-sm font-medium"
            >
              <SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            
            <p className="text-sm text-gray-500 whitespace-nowrap hidden sm:block">
              Showing {filtered.length} products
            </p>
          </div>

          <div className="flex items-center w-full sm:w-auto justify-end gap-3">
             <span className="text-sm text-gray-500">Sort by</span>
             <select
               value={sortBy}
               onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
               className="bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black cursor-pointer"
             >
               {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
             </select>
          </div>
        </div>

        {/* CONTENT LAYOUT */}
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-heading">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll} className="text-xs font-semibold text-gray-500 hover:text-black underline">Clear All</button>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-grow">
            {loading ? (
               <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                 {[...Array(8)].map((_, i) => (
                   <div key={i} className="flex flex-col gap-3">
                     <div className="w-full aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl" />
                     <div className="w-2/3 h-4 bg-gray-100 animate-pulse rounded" />
                     <div className="w-1/3 h-4 bg-gray-100 animate-pulse rounded" />
                   </div>
                 ))}
               </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 max-w-sm mb-6">We couldn't find anything matching your current filters. Try adjusting them.</p>
                <button onClick={clearAll} className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 mb-12">
                  {filtered.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center border-t border-gray-100 pt-8">
                    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                      <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className={`text-sm px-4 py-2 font-medium rounded-full ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-100'}`}
                      >
                        Prev
                      </button>
                      <span className="text-sm font-semibold px-4">{page} / {totalPages}</span>
                      <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className={`text-sm px-4 py-2 font-medium rounded-full ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-100'}`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET FOR FILTERS */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-3xl z-50 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-heading text-gray-900">Filters</h3>
                  {activeFilterCount > 0 && <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">{activeFilterCount}</span>}
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
                <FilterContent />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white grid grid-cols-2 gap-4 pb-safe">
                <button 
                  onClick={clearAll}
                  className="w-full py-4 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="w-full py-4 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
