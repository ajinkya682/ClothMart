import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { Search, X, CheckCircle2, MapPin, Store as StoreIcon, Star, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { value: "All", icon: "✦" },
  { value: "saree", icon: "🪡" },
  { value: "mens", icon: "👔" },
  { value: "western", icon: "👗" },
  { value: "kids", icon: "🧸" },
  { value: "ethnic", icon: "🎋" },
  { value: "other", icon: "✨" },
];

function StarRating({ rating, reviewCount }) {
  const full = Math.floor(rating || 0);
  const half = (rating || 0) - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-400 text-sm">
         {Array.from({ length: full }).map((_, i) => <span key={`f${i}`}>★</span>)}
         {half && <span>★</span>}
         {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`} className="text-gray-200">★</span>)}
      </div>
      <span className="text-xs font-bold text-gray-700 ml-1">{(rating || 0).toFixed(1)}</span>
      {reviewCount !== undefined && <span className="text-xs text-gray-400">({reviewCount})</span>}
    </div>
  );
}

function StoreCard({ store }) {
  const storeLink = `/stores/${store.slug || store._id}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-black transition-all flex flex-col"
    >
      <Link to={storeLink} className="relative h-40 bg-gray-50 block overflow-hidden">
        {store.banner ? (
          <img src={store.banner} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-gray-100 to-gray-50 flex items-center justify-center">
             <StoreIcon size={32} className="text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        <div className="absolute top-3 left-3 flex gap-2">
           {store.isVerified && (
             <span className="flex items-center gap-1 px-2 py-1 bg-green-500/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
               <CheckCircle2 size={12} /> Verified
             </span>
           )}
           <span className="px-2 py-1 bg-white/90 backdrop-blur text-black text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
             {store.category}
           </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col relative">
         <div className="absolute -top-8 right-5 w-16 h-16 bg-white rounded-2xl p-1 shadow-md border border-gray-100 z-10 group-hover:-translate-y-1 transition-transform">
            <div className="w-full h-full bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
               {store.logo ? (
                 <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="font-heading font-black text-2xl text-gray-400">{store.name?.[0]?.toUpperCase()}</span>
               )}
            </div>
         </div>

         <div className="mb-4 pr-16 bg-white shrink-0">
           <Link to={storeLink}><h3 className="text-lg font-bold font-heading text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">{store.name}</h3></Link>
           {store.address?.city && (
             <p className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-1">
               <MapPin size={12} /> {store.address.city}
             </p>
           )}
         </div>

         {store.description && (
           <p className="text-sm text-gray-600 line-clamp-2 mt-2 mb-6 flex-1 pr-2">{store.description}</p>
         )}

         <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
            <StarRating rating={store.rating || 0} reviewCount={store.reviews?.length || 0} />
            <Link to={storeLink} className="text-xs font-bold uppercase tracking-widest text-black group-hover:underline">Explore →</Link>
         </div>
      </div>
    </motion.div>
  );
}

export default function Stores() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (activeCategory !== "All") params.category = activeCategory;
        const res = await api.get("/stores", { params });
        setStores(res.data.stores || []);
      } catch {
        setStores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [search, activeCategory]);

  const clearAll = useCallback(() => {
    setSearch(""); setActiveCategory("All"); setSortBy("newest");
  }, []);

  const sorted = [...stores].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const activeFCount = (search ? 1 : 0) + (activeCategory !== "All" ? 1 : 0) + (sortBy !== "newest" ? 1 : 0);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 animate-fade-in">
      
      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24 px-4 relative overflow-hidden">
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
         
         <div className="max-w-6xl mx-auto relative z-10 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold tracking-widest uppercase mb-6">ClothMart Brands</span>
            <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-6 leading-tight">
               Shop the Best<br/> <span className="text-amber-200">Fashion Stores</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10">
               Discover verified clothing brands across India — from luxury fashion and ethnic wear to streetwear.
            </p>

            <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-1.5 rounded-2xl flex items-center border border-white/20 focus-within:bg-white/20 transition-all shadow-2xl">
               <div className="pl-4 text-white/50"><Search size={20} /></div>
               <input 
                 type="text" 
                 placeholder="Search brands by name or city..." 
                 className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-white/40"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
               {search && <button onClick={() => setSearch("")} className="pr-4 text-white/50 hover:text-white"><X size={20} /></button>}
            </div>
         </div>
      </section>

      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
         <div className="max-w-6xl mx-auto px-4 overflow-x-auto no-scrollbar flex items-center gap-2 py-3">
            {CATEGORIES.map((cat) => (
               <button
                 key={cat.value}
                 onClick={() => setActiveCategory(cat.value)}
                 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                   activeCategory === cat.value ? 'bg-black text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                 }`}
               >
                 <span>{cat.icon}</span> 
                 {cat.value === "All" ? "All" : cat.value.charAt(0).toUpperCase() + cat.value.slice(1)}
               </button>
            ))}
         </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
           <div>
             <h2 className="text-2xl font-bold font-heading text-gray-900">{activeCategory === "All" ? "All Brands" : activeCategory}</h2>
             <p className="text-sm text-gray-500 mt-1">{loading ? "Loading..." : `${sorted.length} stores found`}</p>
           </div>
           
           <div className="flex items-center gap-4">
              {activeFCount > 0 && <button onClick={clearAll} className="text-sm font-bold text-red-500 hover:underline">Clear Filters ({activeFCount})</button>}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:border-black transition-colors">
                <Filter size={16} className="text-gray-400" />
                <select className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 bg-none appearance-none" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
           </div>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="h-72 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
                  <div className="h-40 bg-gray-100" />
                  <div className="p-5 flex flex-col gap-3">
                     <div className="w-32 h-4 bg-gray-200 rounded" />
                     <div className="w-24 h-3 bg-gray-200 rounded" />
                     <div className="w-full h-8 bg-gray-100 rounded mt-4" />
                  </div>
               </div>
             ))}
           </div>
        ) : sorted.length === 0 ? (
           <div className="text-center py-24 bg-white border-2 border-dashed border-gray-200 rounded-[2rem] max-w-2xl mx-auto shadow-sm">
              <StoreIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold font-heading text-gray-900 mb-2">No stores found</h3>
              <p className="text-gray-500 mb-8">{search ? `No results for "${search}" — try a different keyword` : "No stores in this category yet."}</p>
              <button onClick={clearAll} className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:-translate-y-0.5 shadow-md transition-all">Clear Filters</button>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {sorted.map(store => (
                   <StoreCard key={store._id} store={store} />
                ))}
              </AnimatePresence>
           </div>
        )}
      </section>
    </main>
  );
}
