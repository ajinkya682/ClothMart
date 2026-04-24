import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { PackageSearch, ChevronDown, CheckCircle2, Navigation2, XCircle, Clock, PartyPopper, MapPin, ArrowRight } from "lucide-react";

const STATUS = {
  pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-100", icon: CheckCircle2 },
  shipped: { label: "Shipped", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-100", icon: Navigation2 },
  delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-50", border: "border-green-100", icon: PackageSearch },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50", border: "border-red-100", icon: XCircle },
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
      className={`bg-surface rounded-2xl border transition-all overflow-hidden ${open ? 'border-primary shadow-sm' : 'border-gray-50 hover:border-gray-200'} ${isNew ? 'ring-1 ring-primary ring-offset-2' : ''}`}
    >
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 cursor-pointer select-none" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.bg} ${s.color}`}>
             <StatusIcon size={20} strokeWidth={1.5} />
           </div>
           <div>
             <h3 className="font-heading text-primary text-lg tracking-tight">Order #{order._id.slice(-8).toUpperCase()}</h3>
             <p className="text-gray-400 text-[13px] mt-0.5">
               {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
             </p>
           </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 pl-16 sm:pl-0">
           <div className="text-left sm:text-right">
             <p className="font-medium text-primary text-[15px]">₹{total.toLocaleString("en-IN")}</p>
             <p className={`text-[11px] font-semibold uppercase tracking-widest mt-1 ${ps.color}`}>
               {order.paymentMethod === "cod" ? "COD" : ps.label}
             </p>
           </div>
           <ChevronDown size={20} strokeWidth={1.5} className={`text-gray-300 transition-transform duration-300 ${open ? 'rotate-180 text-primary' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-50 bg-surface-low"
          >
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Progress Tracker */}
              {order.status !== "cancelled" && (
                <div className="relative pt-2 pb-6">
                   <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
                     <motion.div 
                       className="h-full bg-primary"
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
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors relative z-10 ${isDone ? 'bg-primary border-primary text-surface' : 'bg-surface border-gray-100 text-gray-200'}`}>
                              {isDone && !isCurrent ? <CheckCircle2 size={16} strokeWidth={2} /> : <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-surface' : 'bg-gray-200'}`} />}
                           </div>
                           <span className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest mt-3 ${isCurrent ? 'text-primary' : isDone ? 'text-gray-500' : 'text-gray-300'}`}>
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
                 <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Items</h4>
                 <div className="bg-surface border border-gray-50 rounded-2xl overflow-hidden shadow-sm">
                   {order.items?.map((item, i) => (
                     <div key={i} className={`p-5 flex items-center gap-5 ${i !== order.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                       <div className="w-16 h-16 rounded-xl bg-surface-low overflow-hidden flex-shrink-0">
                         <img src={item.product?.images?.[0] || "/placeholder.jpg"} alt={item.product?.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="font-medium text-primary text-[14px] truncate">{item.product?.name || "Product"}</p>
                         <p className="text-[12px] text-gray-400 uppercase tracking-widest mt-1">
                           {[item.size && `${item.size}`, item.color && `${item.color}`, `Qty: ${item.qty}`].filter(Boolean).join(" · ")}
                         </p>
                       </div>
                       <p className="font-medium text-primary text-[14px]">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Delivery Address */}
              {order.deliveryAddress && (
                <div>
                  <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5"><MapPin size={14} strokeWidth={1.5}/> Delivery Address</h4>
                  <div className="bg-surface border border-gray-50 rounded-2xl p-5 shadow-sm">
                    <p className="text-[13px] text-primary leading-relaxed">
                      {order.deliveryAddress.street}<br/>
                      <span className="text-gray-500">{order.deliveryAddress.city}, {order.deliveryAddress.state}</span> <span className="text-[12px] font-medium text-gray-400 tracking-widest uppercase ml-1">{order.deliveryAddress.pincode}</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-8">
                 <div>
                   <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Order Total</p>
                   <p className="text-2xl font-heading tracking-tight text-primary">₹{total.toLocaleString("en-IN")}</p>
                 </div>
                 
                 <Link to={`/track-order?id=${order._id}`} className="px-8 py-3.5 bg-primary text-surface rounded-full text-[13px] font-semibold tracking-wide uppercase shadow-float hover:bg-black/90 transition-all flex items-center gap-2 group">
                    Track Order <ArrowRight size={16} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
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
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-5 py-8 lg:py-16 animate-fade-in">
        
        {/* Success Banner */}
        <AnimatePresence>
          {newOrderId && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-6 sm:p-8 bg-surface border border-green-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm"
            >
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                 <PartyPopper size={24} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h2 className="text-green-800 font-heading text-xl mb-1.5">
                  {newOrderMethod === "cod" ? "Order Placed Successfully" : "Payment Successful"}
                </h2>
                <p className="text-gray-500 text-[14px]">Your order <span className="font-medium text-primary tracking-widest uppercase ml-1 border-b border-gray-200 pb-0.5">#{newOrderId.slice(-8)}</span> has been confirmed. We'll notify you when it ships.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-heading text-primary tracking-tight">Order History</h1>
            <p className="text-gray-400 mt-2 text-[14px]">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
          </div>
          <Link to="/products" className="inline-flex items-center justify-center px-8 py-3.5 bg-surface border border-gray-100 text-primary rounded-full text-[13px] font-semibold tracking-wide uppercase shadow-sm hover:border-gray-300 transition-all">
            Browse Products
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-6 mb-6">
          {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-full text-[12px] font-semibold tracking-wide uppercase whitespace-nowrap transition-all border ${
                filter === f ? 'bg-primary text-surface border-primary shadow-float' : 'bg-surface text-gray-400 border-gray-50 hover:border-gray-200 hover:text-primary'
              }`}
            >
              {f === "all" ? "All Orders" : STATUS[f]?.label}
              {f !== "all" && (
                 <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${filter === f ? 'bg-surface/20 text-surface' : 'bg-surface-low text-gray-400'}`}>
                   {orders.filter(o => o.status === f).length}
                 </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-surface-low rounded-2xl animate-pulse"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-center py-24 border border-dashed border-gray-100 rounded-2xl bg-surface mt-8"
          >
            <PackageSearch size={48} strokeWidth={1} className="mx-auto text-gray-200 mb-5" />
            <h2 className="text-2xl font-heading text-primary mb-3">No {filter === "all" ? "orders" : filter + " orders"} yet</h2>
            <p className="text-gray-400 text-[14px] mb-8">
              {filter === "all" ? "When you make a purchase, it will appear here." : "Try selecting a different filter."}
            </p>
            {filter === "all" && (
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-surface rounded-full text-[13px] font-semibold tracking-wide uppercase shadow-float hover:-translate-y-0.5 transition-all">
                Start Shopping <ArrowRight size={16} strokeWidth={1.5}/>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence>
              {filtered.map((order, i) => (
                <OrderCard key={order._id} order={order} isNew={order._id === newOrderId} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
