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
      <div className="bg-background min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface rounded-2xl p-10 border border-gray-50 shadow-sm text-center animate-fade-in">
           <div className="w-20 h-20 bg-surface-low rounded-full flex items-center justify-center mx-auto mb-8">
             <PackageSearch size={32} strokeWidth={1} className="text-gray-300" />
           </div>
           <h2 className="text-2xl font-heading text-primary mb-3">Track Your Order</h2>
           <p className="text-[14px] text-gray-500 mb-10 leading-relaxed">Sign in to track the real-time status and location of your purchases.</p>
           <Link to="/login" state={{ from: { pathname: "/track-order" } }} className="block w-full py-4 bg-primary text-surface rounded-full text-[13px] font-semibold tracking-wide uppercase shadow-float hover:-translate-y-0.5 transition-all">
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
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-5 py-12 lg:py-16 animate-fade-in">
        
        <div className="mb-12 text-center max-w-xl mx-auto">
           <h1 className="text-4xl md:text-5xl font-heading text-primary tracking-tight mb-4">Track Order</h1>
           <p className="text-[15px] text-gray-400">Enter your order ID below to get live updates on your package.</p>
           
           <div className="mt-10 relative flex items-center">
              <Search size={20} strokeWidth={1.5} className="absolute left-6 text-gray-400" />
              <input 
                type="text" 
                placeholder="Paste your Order ID here..." 
                className="w-full bg-surface border border-gray-100 rounded-full py-5 pl-14 pr-36 outline-none focus:border-gray-300 transition-all text-[15px] placeholder:text-gray-400 shadow-sm"
                value={orderId}
                onChange={(e) => { setOrderId(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              />
              <button 
                onClick={() => handleTrack()} 
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 bg-primary text-surface px-8 rounded-full text-[13px] font-semibold tracking-wide uppercase shadow-float hover:bg-black/90 transition-all disabled:opacity-70 flex items-center gap-2"
              >
                {loading ? <LoaderCircle size={16} className="animate-spin" /> : "Track"}
              </button>
           </div>
        </div>

        <AnimatePresence>
          {error && searched && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-800 rounded-xl flex items-center justify-center gap-2 font-medium mb-10 border border-red-100 max-w-xl mx-auto text-[14px]">
               <AlertCircle size={18} strokeWidth={1.5} /> {error}
            </motion.div>
          )}

          {order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              <div className="bg-surface border border-gray-50 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 shadow-sm">
                 <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Order ID</p>
                    <p className="text-2xl sm:text-3xl font-heading text-primary tracking-tight">#{order._id.slice(-10).toUpperCase()}</p>
                    <p className="text-[13px] text-gray-500 mt-2">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className={`px-5 py-2.5 rounded-full text-[12px] font-semibold tracking-wide uppercase shadow-sm border ${
                      isCancelled ? 'bg-red-50 text-red-700 border-red-100' :
                      order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                      'bg-blue-50 text-blue-700 border-blue-100'
                   }`}>
                     {order.status}
                   </span>
                   <span className={`px-5 py-2.5 rounded-full text-[12px] font-semibold tracking-wide uppercase shadow-sm border ${order.paymentMethod === 'cod' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-surface-low text-primary border-gray-100'}`}>
                     {order.paymentMethod === 'cod' ? 'COD' : 'Paid'}
                   </span>
                 </div>
              </div>

              {isCancelled ? (
                 <div className="bg-red-50 border border-red-100 p-10 rounded-2xl text-center shadow-sm">
                    <XCircle size={48} strokeWidth={1} className="text-red-500 mx-auto mb-5" />
                    <h3 className="text-2xl font-heading text-red-800 mb-2">Order Cancelled</h3>
                    <p className="text-red-700 font-medium text-[14px]">This order has been cancelled. If paid online, a refund will process within 5-7 days.</p>
                 </div>
              ) : (
                 <div className="bg-surface border border-gray-50 rounded-2xl p-6 sm:p-10 shadow-sm">
                   <h3 className="text-xl font-heading text-primary mb-10 flex items-center gap-3"><PackageSearch size={24} strokeWidth={1.5} className="text-gray-400"/> Tracking Insight</h3>
                   
                   <div className="relative flex flex-col sm:flex-row justify-between pt-4 pb-8 sm:pb-0 px-4">
                      <div className="hidden sm:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-gray-100 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${(Math.max(0, currentIndex) / 3) * 100}%` }} className="h-full bg-primary transition-all duration-1000" />
                      </div>

                      {STEPS.map((step, i) => {
                        const isDone = i <= currentIndex;
                        const isCurrent = i === currentIndex;
                        return (
                          <div key={step.key} className="flex sm:flex-col items-center gap-5 sm:gap-4 relative z-10 mb-8 sm:mb-0">
                             {/* Mobile Line connecting nodes vertically */}
                             {i !== STEPS.length - 1 && <div className="sm:hidden w-[2px] h-12 bg-gray-100 absolute left-[19px] top-[40px] -z-10" />}

                             <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors shrink-0 ${isDone ? 'bg-primary border-primary text-surface shadow-float' : 'bg-surface border-gray-100 text-gray-300'}`}>
                                {isDone && !isCurrent ? <CheckCircle2 size={16} strokeWidth={2} /> : <step.icon size={16} strokeWidth={1.5} />}
                             </div>
                             <div className="sm:text-center">
                               <p className={`text-[13px] font-semibold uppercase tracking-wider ${isCurrent ? 'text-primary' : isDone ? 'text-primary/80' : 'text-gray-400'}`}>{step.label}</p>
                               <p className="text-[12px] text-gray-500 max-w-[140px] hidden sm:block mx-auto mt-1.5">{step.desc}</p>
                             </div>
                          </div>
                        )
                      })}
                   </div>
                 </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-surface border border-gray-50 rounded-2xl p-8 shadow-sm">
                    <h3 className="text-lg font-heading text-primary mb-6 flex items-center gap-2"><Building2 size={20} strokeWidth={1.5} className="text-gray-400"/> Sold By</h3>
                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 rounded-xl bg-surface-low border border-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                          {order.store?.logo ? <img src={order.store.logo} alt="" className="w-full h-full object-cover" /> : <Building2 size={24} strokeWidth={1} className="text-gray-300" />}
                       </div>
                       <div>
                         <p className="font-medium text-[15px] text-primary mb-1">{order.store?.name || "ClothMart Store"}</p>
                         {order.store?.address?.city && <p className="text-[13px] text-gray-500 flex items-center gap-1.5"><MapPin size={14} strokeWidth={1.5}/> {order.store.address.city}</p>}
                       </div>
                    </div>
                 </div>

                 <div className="bg-surface border border-gray-50 rounded-2xl p-8 shadow-sm">
                    <h3 className="text-lg font-heading text-primary mb-6 flex items-center gap-2"><MapPin size={20} strokeWidth={1.5} className="text-gray-400"/> Deliver To</h3>
                    <p className="font-medium text-[15px] text-primary">{order.customer?.name}</p>
                    <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">
                      {order.deliveryAddress?.street}<br/>
                      {order.deliveryAddress?.city}, {order.deliveryAddress?.state} <span className="font-medium text-gray-400 tracking-widest uppercase ml-1">{order.deliveryAddress?.pincode}</span>
                    </p>
                 </div>
              </div>

              <div className="bg-surface border border-gray-50 rounded-2xl p-6 sm:p-10 shadow-sm">
                 <h3 className="text-lg font-heading text-primary mb-8 flex items-center gap-2"><ShoppingBag size={20} strokeWidth={1.5} className="text-gray-400"/> Items Ordered</h3>
                 <div className="divide-y divide-gray-50 mb-8">
                   {order.items?.map((item, i) => (
                      <div key={i} className="py-5 flex items-center gap-5">
                         <div className="w-16 h-16 rounded-xl bg-surface-low overflow-hidden shrink-0">
                            <img src={item.product?.images?.[0] || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="font-medium text-[14px] text-primary truncate mb-1">{item.product?.name || "Product"}</p>
                            <p className="text-[12px] text-gray-400 uppercase tracking-widest">
                               {[item.size && `${item.size}`, item.color && `${item.color}`, `Qty: ${item.qty}`].filter(Boolean).join(" · ")}
                            </p>
                         </div>
                         <p className="font-medium text-[15px] text-primary">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                      </div>
                   ))}
                 </div>

                 <div className="space-y-4 pt-8 border-t border-gray-100 text-[14px]">
                    <div className="flex justify-between text-gray-500">
                       <span>Items Total</span>
                       <span className="font-medium text-primary">₹{orderTotal.toLocaleString("en-IN")}</span>
                    </div>
                    {order.discount > 0 && (
                       <div className="flex justify-between text-accent font-medium">
                          <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                          <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                       </div>
                    )}
                    <div className="flex justify-between items-end pt-6 border-t border-gray-100">
                       <span className="font-medium text-[15px] text-primary">Total Paid</span>
                       <span className="text-3xl font-heading text-primary tracking-tight">₹{(order.totalAmount || orderTotal).toLocaleString("en-IN")}</span>
                    </div>
                 </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
