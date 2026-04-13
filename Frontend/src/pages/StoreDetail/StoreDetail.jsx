import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Search, MapPin, Phone, Star, PackageSearch, Filter, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ProductCard({ product }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-black transition-all flex flex-col"
    >
      <Link to={`/products/${product.slug || product._id}`} className="relative aspect-[4/5] bg-gray-50 block overflow-hidden">
        <img src={product.images?.[0] || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        
        {product.discountPrice && (
           <span className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
             {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
           </span>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/products/${product.slug || product._id}`}>
          <h3 className="font-bold text-gray-900 group-hover:underline line-clamp-1">{product.name}</h3>
        </Link>
        
        <div className="flex items-center gap-2 mt-2">
           <span className="font-black font-heading text-lg text-gray-900">₹{(product.discountPrice || product.price).toLocaleString("en-IN")}</span>
           {product.discountPrice && <span className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString("en-IN")}</span>}
        </div>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
           {product.rating > 0 && (
             <div className="flex items-center gap-1 text-amber-500">
               <Star size={12} fill="currentColor" />
               <span className="text-xs font-bold text-gray-700">{product.rating.toFixed(1)}</span>
               <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
             </div>
           )}
           <Link to={`/products/${product.slug || product._id}`} className="text-[10px] font-bold uppercase tracking-widest text-black ml-auto border-b border-black">View Details</Link>
        </div>
      </div>
    </motion.div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200"></div>
      <div className="max-w-6xl mx-auto px-4 relative -mt-16 sm:-mt-24">
         <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-3xl border-4 border-white mb-4 shadow-sm" />
         <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
         <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
}

export default function StoreDetail() {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/stores/${slug}`);
        setStore(res.data.store);
      } catch (err) {
        setError("Store not found");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [slug]);

  useEffect(() => {
    if (!store) return;
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const res = await api.get("/products", { params: { store: store._id, sort, search, page, limit: 12 } });
        setProducts(res.data.products);
        setTotalPages(res.data.pages);
      } catch {
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [store, sort, search, page]);

  if (loading) return <Skeleton />;
  
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-black font-heading text-gray-900 mb-4">Store not found</h2>
        <Link to="/stores" className="px-6 py-3 bg-black text-white rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all">← Browse all stores</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-fade-in">
      
      {/* Banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-black overflow-hidden group">
        {store.banner ? (
          <img src={store.banner} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity" />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-gray-900 to-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Store Info */}
      <div className="max-w-6xl mx-auto px-4 relative -mt-16 sm:-mt-24 lg:-mt-32">
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-12">
           
           <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-3xl bg-white shadow-md p-1 border border-gray-100 shrink-0">
              <div className="w-full h-full bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
                 {store.logo ? (
                   <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-4xl font-black font-heading text-gray-300">{store.name?.[0]?.toUpperCase()}</span>
                 )}
              </div>
           </div>

           <div className="flex-1 text-center sm:text-left mt-2 sm:mt-4">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                 <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-widest rounded-lg">{store.category}</span>
                 {store.isVerified && (
                   <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-green-200">
                     <CheckCircle2 size={12} /> Verified
                   </span>
                 )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-gray-900 tracking-tight mb-4">{store.name}</h1>
              
              {store.description && <p className="text-gray-600 mb-6 max-w-2xl text-sm sm:text-base leading-relaxed">{store.description}</p>}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-sm text-gray-600 font-medium">
                 {store.rating > 0 && (
                   <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-bold border border-amber-200">
                     <Star size={16} fill="currentColor" /> {store.rating.toFixed(1)}
                   </div>
                 )}
                 {store.address?.city && (
                   <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {store.address.city}, {store.address.state}</span>
                 )}
                 {store.phone && (
                   <span className="flex items-center gap-1.5"><Phone size={16} className="text-gray-400" /> +91 {store.phone}</span>
                 )}
              </div>
           </div>
        </div>

        {/* Products Section */}
        <div>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold font-heading text-gray-900">Collection</h2>
                <p className="text-sm text-gray-500 mt-1">{products.length} products available</p>
              </div>

              <div className="flex items-center gap-3">
                 <div className="flex-1 md:w-64 bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center shadow-sm focus-within:border-black focus-within:ring-2 focus-within:ring-black transition-all">
                    <Search size={16} className="text-gray-400 mr-2" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="w-full bg-transparent border-none outline-none text-sm placeholder:text-gray-400 text-gray-900"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                 </div>
                 
                 <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm focus-within:border-black transition-all">
                    <Filter size={16} className="text-gray-400" />
                    <select className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 appearance-none min-w-[70px]" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
                      <option value="newest">Newest</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </select>
                 </div>
              </div>
           </div>

           {productsLoading ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                     <div className="aspect-[4/5] bg-gray-100" />
                     <div className="p-4 space-y-2">
                       <div className="h-4 bg-gray-200 rounded w-3/4" />
                       <div className="h-4 bg-gray-200 rounded w-1/4" />
                     </div>
                  </div>
                ))}
             </div>
           ) : products.length === 0 ? (
             <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-[2rem] shadow-sm">
                <PackageSearch size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">{search ? `No items matched your search "${search}"` : "This store hasn't added any products yet."}</p>
             </div>
           ) : (
             <>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  <AnimatePresence>
                     {products.map(p => <ProductCard key={p._id} product={p} />)}
                  </AnimatePresence>
               </div>
               
               {totalPages > 1 && (
                 <div className="flex items-center justify-center gap-6 mt-12 bg-white px-6 py-4 rounded-full shadow-sm border border-gray-100 w-max mx-auto">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 text-gray-500 hover:text-black disabled:opacity-30 transition-colors">
                       <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold text-gray-900">Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 text-gray-500 hover:text-black disabled:opacity-30 transition-colors">
                       <ChevronRight size={20} />
                    </button>
                 </div>
               )}
             </>
           )}
        </div>
      </div>
    </div>
  );
}
