import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Search, LoaderCircle, ArrowLeft, CheckCircle2, Clock, Navigation2, PackageSearch, XCircle, MapPin, Building2, AlertCircle, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock, desc: "Awaiting confirmation" },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2, desc: "Preparing your order" },
  { key: "shipped", label: "Shipped", icon: Navigation2, desc: "On the way" },
  { key: "delivered", label: "Delivered", icon: PackageSearch, desc: "Successfully delivered" },
];

const STATUS_INDEX = { pending: 0, confirmed: 1, shipped: 2, delivered: 3, cancelled: -1 };

export default function TrackOrder() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (searchParams.get("id")) handleTrack(searchParams.get("id"));
  }, []);

  async function handleTrack(id) {
    const trackId = (id || orderId).trim();
    if (!trackId) { setError("Please enter an Order ID"); return; }
    
    setLoading(true); setError(""); setOrder(null); setSearched(false);
    try {
      const res = await api.get(`/orders/${trackId}`);
      setOrder(res.data.order);
      setSearched(true);
    } catch (err) {
      setError(err?.response?.status === 404 ? "Order not found. Please check your ID." : "Something went wrong.");
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm text-center animate-fade-in">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <PackageSearch size={32} className="text-gray-400" />
           </div>
           <h2 className="text-2xl font-black font-heading text-gray-900 mb-2">Sign in to track orders</h2>
           <p className="text-gray-500 mb-8">You need to be logged in to track the status of your purchases.</p>
           <Link to="/login" state={{ from: { pathname: "/track-order" } }} className="block w-full py-4 bg-black text-white rounded-xl text-sm font-bold shadow-sm hover:-translate-y-0.5 transition-transform">
             Sign In Now
           </Link>
        </div>
      </div>
    );
  }

  const currentIndex = order ? STATUS_INDEX[order.status] : -1;
  const isCancelled = order?.status === "cancelled";
  const orderTotal = order?.items?.reduce((s, i) => s + i.price * i.qty, 0) || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      
      <div className="mb-8 text-center max-w-xl mx-auto">
         <h1 className="text-4xl font-black font-heading text-gray-900 tracking-tight mb-3">Track Order</h1>
         <p className="text-gray-500">Enter your order ID below to get live updates on your package.</p>
         
         <div className="mt-8 relative flex items-center">
            <Search size={20} className="absolute left-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Paste your Order ID here..." 
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-32 outline-none focus:border-black focus:ring-2 focus:ring-black/5 shadow-sm transition-all text-base"
              value={orderId}
              onChange={(e) => { setOrderId(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            />
            <button 
              onClick={() => handleTrack()} 
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-black text-white px-6 rounded-xl text-sm font-bold shadow-md hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {loading && <LoaderCircle size={16} className="animate-spin" />} Track
            </button>
         </div>
      </div>

      <AnimatePresence>
        {error && searched && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-800 rounded-xl flex items-center justify-center gap-2 font-bold mb-8 border border-red-100 max-w-xl mx-auto text-sm">
             <AlertCircle size={18} /> {error}
          </motion.div>
        )}

        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 shadow-sm">
               <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="text-xl sm:text-2xl font-black font-heading text-gray-900 tracking-tight">#{order._id.slice(-10).toUpperCase()}</p>
                  <p className="text-sm text-gray-500 mt-2">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
               </div>
               <div className="flex items-center gap-2">
                 <span className={`px-4 py-2 rounded-xl text-sm font-bold capitalize shadow-sm ${
                    isCancelled ? 'bg-red-100 text-red-700 border border-red-200' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-700 border border-green-200' :
                    'bg-blue-100 text-blue-700 border border-blue-200'
                 }`}>
                   {order.status}
                 </span>
                 <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${order.paymentMethod === 'cod' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                   {order.paymentMethod === 'cod' ? 'COD' : 'Paid'}
                 </span>
               </div>
            </div>

            {isCancelled ? (
               <div className="bg-red-50 border border-red-100 p-8 rounded-[2rem] text-center shadow-sm">
                  <XCircle size={48} className="text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-800 mb-2">Order Cancelled</h3>
                  <p className="text-red-700 font-medium text-sm">This order has been cancelled. If paid online, a refund will process within 5-7 days.</p>
               </div>
            ) : (
               <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                 <h3 className="text-lg font-bold font-heading text-gray-900 mb-8 flex items-center gap-2"><PackageSearch size={20}/> Tracking Insight</h3>
                 
                 <div className="relative flex flex-col sm:flex-row justify-between pt-4 pb-8 sm:pb-0 px-4">
                    <div className="hidden sm:block absolute top-7 left-[10%] right-[10%] h-1 bg-gray-100 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${(Math.max(0, currentIndex) / 3) * 100}%` }} className="h-full bg-black transition-all duration-1000" />
                    </div>

                    {STEPS.map((step, i) => {
                      const isDone = i <= currentIndex;
                      const isCurrent = i === currentIndex;
                      return (
                        <div key={step.key} className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 mb-8 sm:mb-0">
                           {/* Mobile Line connecting nodes vertically */}
                           {i !== STEPS.length - 1 && <div className="sm:hidden w-1 h-12 bg-gray-100 absolute left-[15px] top-[32px] -z-10" />}

                           <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors shrink-0 ${isDone ? 'bg-black border-white text-white shadow-xl shadow-black/20' : 'bg-gray-50 border-white text-gray-300'}`}>
                              {isDone && !isCurrent ? <CheckCircle2 size={16} /> : <step.icon size={16} />}
                           </div>
                           <div className="sm:text-center mt-1">
                             <p className={`text-sm font-bold uppercase tracking-wider ${isCurrent ? 'text-black' : isDone ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
                             <p className="text-[10px] text-gray-500 max-w-[120px] hidden sm:block mx-auto mt-1">{step.desc}</p>
                           </div>
                        </div>
                      )
                    })}
                 </div>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
                  <h3 className="text-lg font-bold font-heading text-gray-900 mb-6 flex items-center gap-2"><Building2 size={20}/> Sold By</h3>
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {order.store?.logo ? <img src={order.store.logo} alt="" className="w-full h-full object-cover" /> : <Building2 size={24} className="text-gray-300" />}
                     </div>
                     <div>
                       <p className="font-bold text-gray-900">{order.store?.name || "ClothMart Store"}</p>
                       {order.store?.address?.city && <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {order.store.address.city}</p>}
                     </div>
                  </div>
               </div>

               <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
                  <h3 className="text-lg font-bold font-heading text-gray-900 mb-6 flex items-center gap-2"><MapPin size={20}/> Deliver To</h3>
                  <p className="font-bold text-gray-900">{order.customer?.name}</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {order.deliveryAddress?.street}<br/>
                    {order.deliveryAddress?.city}, {order.deliveryAddress?.state} <span className="font-mono text-gray-400">{order.deliveryAddress?.pincode}</span>
                  </p>
               </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm">
               <h3 className="text-lg font-bold font-heading text-gray-900 mb-6 flex items-center gap-2"><ShoppingBag size={20}/> Items Ordered</h3>
               <div className="divide-y divide-gray-100 mb-6">
                 {order.items?.map((item, i) => (
                    <div key={i} className="py-4 flex items-center gap-4">
                       <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                          <img src={item.product?.images?.[0] || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{item.product?.name || "Product"}</p>
                          <p className="text-xs text-gray-500 mt-1">
                             {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`, `Qty: ${item.qty}`].filter(Boolean).join(" · ")}
                          </p>
                       </div>
                       <p className="font-black text-gray-900">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                    </div>
                 ))}
               </div>

               <div className="space-y-3 pt-6 border-t border-gray-100 text-sm">
                  <div className="flex justify-between text-gray-600">
                     <span>Items Total</span>
                     <span className="font-bold text-gray-900">₹{orderTotal.toLocaleString("en-IN")}</span>
                  </div>
                  {order.discount > 0 && (
                     <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                        <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                     </div>
                  )}
                  <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                     <span className="font-bold text-gray-900">Total Paid</span>
                     <span className="text-2xl font-black font-heading text-gray-900 tracking-tight">₹{(order.totalAmount || orderTotal).toLocaleString("en-IN")}</span>
                  </div>
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
