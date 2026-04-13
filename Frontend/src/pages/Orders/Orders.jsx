import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { PackageSearch, ChevronDown, CheckCircle2, Navigation2, XCircle, Clock, PartyPopper, MapPin, ArrowRight } from "lucide-react";

const STATUS = {
  pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-200", icon: CheckCircle2 },
  shipped: { label: "Shipped", color: "text-purple-700", bg: "bg-purple-100", border: "border-purple-200", icon: Navigation2 },
  delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-100", border: "border-green-200", icon: PackageSearch },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-100", border: "border-red-200", icon: XCircle },
};

const PAYMENT_STATUS = {
  pending: { label: "Unpaid", color: "text-amber-600" },
  paid: { label: "Paid", color: "text-green-600" },
  failed: { label: "Failed", color: "text-red-600" },
};

function OrderCard({ order, isNew }) {
  const [open, setOpen] = useState(isNew);
  const s = STATUS[order.status] || STATUS.pending;
  const ps = PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS.pending;
  const total = order.items?.reduce((sum, i) => sum + i.price * i.qty, 0) || 0;
  const StatusIcon = s.icon;

  const steps = ["pending", "confirmed", "shipped", "delivered"];
  const currentIdx = steps.indexOf(order.status);

  return (
    <motion.div 
      layout
      initial={isNew ? { opacity: 0, y: 20, scale: 0.98 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`bg-white rounded-2xl border transition-all overflow-hidden ${open ? 'border-black shadow-lg' : 'border-gray-200 hover:border-gray-300 shadow-sm'} ${isNew ? 'ring-2 ring-black ring-offset-2' : ''}`}
    >
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
             <StatusIcon size={24} />
           </div>
           <div>
             <h3 className="font-bold font-heading text-gray-900 tracking-tight">Order #{order._id.slice(-8).toUpperCase()}</h3>
             <p className="text-gray-500 text-sm mt-0.5">
               {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
             </p>
           </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 pl-16 sm:pl-0">
           <div className="text-left sm:text-right">
             <p className="font-black text-gray-900 text-lg">₹{total.toLocaleString("en-IN")}</p>
             <p className={`text-[10px] font-bold uppercase tracking-wider ${ps.color}`}>
               {order.paymentMethod === "cod" ? "COD" : ps.label}
             </p>
           </div>
           <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180 text-black' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gray-50/50"
          >
            <div className="p-5 sm:p-6 space-y-8">
              
              {/* Progress Tracker */}
              {order.status !== "cancelled" && (
                <div className="relative pt-2 pb-6">
                   <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                     <motion.div 
                       className="h-full bg-black"
                       initial={{ width: 0 }}
                       animate={{ width: `${(Math.max(0, currentIdx) / (steps.length - 1)) * 100}%` }}
                       transition={{ duration: 0.5, ease: "easeOut" }}
                     />
                   </div>
                   <div className="relative flex justify-between">
                     {steps.map((step, i) => {
                       const isDone = i <= currentIdx;
                       const isCurrent = i === currentIdx;
                       return (
                         <div key={step} className="flex flex-col items-center">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] transition-colors relative z-10 ${isDone ? 'bg-black border-black text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                              {isDone && !isCurrent ? <CheckCircle2 size={16} /> : <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-white' : 'bg-gray-300'}`} />}
                           </div>
                           <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-2 ${isCurrent ? 'text-black' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>
                             {STATUS[step].label}
                           </span>
                         </div>
                       )
                     })}
                   </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Items</h4>
                 <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                   {order.items?.map((item, i) => (
                     <div key={i} className={`p-4 flex items-center gap-4 ${i !== order.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                       <div className="w-16 h-16 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0">
                         <img src={item.product?.images?.[0] || "/placeholder.jpg"} alt={item.product?.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="font-bold text-gray-900 truncate">{item.product?.name || "Product"}</p>
                         <p className="text-xs font-medium text-gray-500 mt-0.5">
                           {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`, `Qty: ${item.qty}`].filter(Boolean).join(" • ")}
                         </p>
                       </div>
                       <p className="font-black text-gray-900">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Delivery Address */}
              {order.deliveryAddress && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1"><MapPin size={14}/> Delivery Address</h4>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      {order.deliveryAddress.street}<br/>
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} <span className="font-mono">{order.deliveryAddress.pincode}</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-6">
                 <div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Total</p>
                   <p className="text-2xl font-black font-heading tracking-tight text-gray-900">₹{total.toLocaleString("en-IN")}</p>
                 </div>
                 
                 <Link to={`/track-order?id=${order._id}`} className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2 group">
                    Track Order <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Orders() {
  const location = useLocation();
  const newOrderId = location.state?.newOrderId;
  const newOrderMethod = location.state?.method;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12 animate-fade-in min-h-screen">
      
      {/* Success Banner */}
      <AnimatePresence>
        {newOrderId && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-green-50 border border-green-200 rounded-[2rem] flex items-start gap-4 shadow-sm"
          >
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
               <PartyPopper size={24} />
            </div>
            <div>
              <h2 className="text-green-800 font-bold text-lg mb-1">
                {newOrderMethod === "cod" ? "Order Placed Successfully!" : "Payment Successful!"}
              </h2>
              <p className="text-green-700 font-medium">Your order <span className="font-mono bg-green-100 px-1.5 rounded">#{newOrderId.slice(-8).toUpperCase()}</span> has been confirmed. We'll notify you when it ships.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-gray-900 tracking-tight">Order History</h1>
          <p className="text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
        </div>
        <Link to="/products" className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-black rounded-xl text-sm font-bold shadow-sm hover:border-black transition-all">
          Browse Products
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-4 border-b border-gray-100">
        {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              filter === f ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black'
            }`}
          >
            {f === "all" ? "All Orders" : STATUS[f]?.label}
            {f !== "all" && (
               <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${filter === f ? 'bg-white/20' : 'bg-white/50'}`}>
                 {orders.filter(o => o.status === f).length}
               </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4 pt-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="text-center py-24 border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50 mt-8"
        >
          <PackageSearch size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold font-heading text-gray-900 mb-2">No {filter === "all" ? "orders" : filter + " orders"} yet</h2>
          <p className="text-gray-500 font-medium mb-8">
            {filter === "all" ? "When you make a purchase, it will appear here." : "Try selecting a different filter."}
          </p>
          {filter === "all" && (
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all">
              Start Shopping <ArrowRight size={18}/>
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4 pt-4">
          <AnimatePresence>
            {filtered.map((order, i) => (
              <OrderCard key={order._id} order={order} isNew={order._id === newOrderId} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
