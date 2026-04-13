import { useState, useEffect } from "react";
import api from "../../../../utils/api";
import toast from "react-hot-toast";
import { ChevronDown, MapPin, PackageCircle, User } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800 border-blue-200" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800 border-purple-200" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800 border-green-200" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200" },
};

const FILTERS = ["all", "pending", "confirmed", "shipped", "delivered"];

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/store");
      setOrders(res.data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success(`Order marked as ${status}`);
      setExpandedId(null);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-gray-900 tracking-tight">Orders Management</h2>
          <p className="text-sm text-gray-500 mt-1">{orders.length} total orders received</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                filter === f ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} {f !== 'all' && `(${orders.filter(o => o.status === f).length})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50">
          <PackageCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium pb-2">No {filter === 'all' ? '' : filter} orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
             const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
             const isExpanded = expandedId === order._id;
             const nextStatus = { pending: "confirmed", confirmed: "shipped", shipped: "delivered" }[order.status];
             const orderTotal = order.items?.reduce((s, i) => s + (i.price * i.qty), 0) || 0;

             return (
               <div key={order._id} className={`bg-white border rounded-2xl transition-all ${isExpanded ? 'border-black shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                 {/* Header (Clickable) */}
                 <div onClick={() => setExpandedId(isExpanded ? null : order._id)} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                        {order.customer?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 mb-0.5 flex items-center gap-2">
                           #{order._id.slice(-6).toUpperCase()}
                           <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-md tracking-wider uppercase ${statusConfig.color}`}>
                             {statusConfig.label}
                           </span>
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {day:'numeric', month:'short'})} • {order.customer?.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 pl-16 sm:pl-0">
                       <div className="text-left sm:text-right">
                         <p className="font-black text-gray-900 text-lg">₹{orderTotal.toLocaleString("en-IN")}</p>
                         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{order.paymentMethod === 'cod' ? 'COD' : 'Prepaid'}</p>
                       </div>
                       <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-black' : ''}`} />
                    </div>
                 </div>

                 {/* Expanded Body */}
                 {isExpanded && (
                   <div className="border-t border-gray-100 p-5 bg-gray-50/50 rounded-b-2xl animate-fade-in space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={14}/> Customer</h4>
                          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-2">
                            <p className="text-sm font-semibold text-gray-900">{order.customer?.name || "Unknown"}</p>
                            <p className="text-sm text-gray-600">{order.customer?.email}</p>
                            <p className="text-sm text-gray-600 font-mono">{order.customer?.phone || "No phone"}</p>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div>
                           <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin size={14}/> Address</h4>
                           <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                              <p className="text-sm text-gray-900 leading-relaxed">
                                {order.deliveryAddress?.street}<br/>
                                {order.deliveryAddress?.city}, {order.deliveryAddress?.state}<br/>
                                <span className="font-mono font-medium">{order.deliveryAddress?.pincode}</span>
                              </p>
                           </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Items Ordered</h4>
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                          {order.items?.map((item, i) => (
                            <div key={i} className={`p-4 flex items-center gap-4 ${i !== order.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                               <img src={item.product?.images?.[0] || "/placeholder.jpg"} alt={item.product?.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                               <div className="flex-1">
                                 <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.product?.name || "Product"}</p>
                                 <p className="text-xs text-gray-500 mt-0.5">
                                   {[item.size, item.color, `Qty: ${item.qty}`].filter(Boolean).join(" • ")}
                                 </p>
                               </div>
                               <p className="text-sm font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        {order.status === "pending" && (
                          <button onClick={() => updateStatus(order._id, "cancelled")} disabled={updatingId === order._id} className="px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                            Reject & Cancel
                          </button>
                        )}
                        {nextStatus && (
                          <button onClick={() => updateStatus(order._id, nextStatus)} disabled={updatingId === order._id} className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                             {updatingId === order._id ? <span className="animate-spin text-xl leading-none w-4 h-4 rounded-full border-2 border-t-white border-white/20"></span> : null}
                             Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                          </button>
                        )}
                      </div>

                   </div>
                 )}
               </div>
             )
          })}
        </div>
      )}
    </div>
  );
}
