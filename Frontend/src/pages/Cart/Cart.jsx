import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api from "../../utils/api";
import { ShoppingBag, Trash2, ShieldCheck, Undo2, Zap, ArrowRight, Minus, Plus, Tag, Check, LoaderCircle, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function CartItem({ item, onRemove, onQtyChange }) {
  const { product, qty, size, color, price } = item;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 bg-white border border-gray-100 rounded-2xl flex gap-4 hover:border-black transition-colors group relative overflow-hidden"
    >
      <div className="w-24 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden order-1">
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between order-2 py-1">
        <div>
           <Link to={`/stores/${product.store?._id}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
            {product.store?.name}
           </Link>
           <Link to={`/products/${product._id}`}>
             <h3 className="font-bold text-gray-900 leading-tight mt-0.5 mb-1 group-hover:underline">{product.name}</h3>
           </Link>
           <div className="flex flex-wrap gap-2 mb-2">
             {size && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">Size: {size}</span>}
             {color && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">Color: {color}</span>}
           </div>
        </div>

        <div className="flex items-end justify-between mt-4">
           <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5">
              <button 
                onClick={() => onQtyChange(product._id, size, color, qty - 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-md transition-all"
              ><Minus size={14}/></button>
              <span className="w-8 text-center text-sm font-bold text-gray-900">{qty}</span>
              <button 
                onClick={() => onQtyChange(product._id, size, color, qty + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-md transition-all"
              ><Plus size={14}/></button>
           </div>
           
           <div className="text-right">
             <p className="font-black text-gray-900 text-lg leading-none">₹{(price * qty).toLocaleString("en-IN")}</p>
             {qty > 1 && <p className="text-[10px] font-medium text-gray-400 mt-1">₹{price.toLocaleString("en-IN")} each</p>}
           </div>
        </div>
      </div>

      <button 
        onClick={() => onRemove(product._id, size, color)}
        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
        title="Remove item"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const { items, cartSubtotal, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  const DELIVERY_CHARGE = cartSubtotal >= 1499 ? 0 : 99;

  // Render Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm text-center">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Lock size={32} className="text-gray-400" />
           </div>
           <h2 className="text-2xl font-black font-heading text-gray-900 mb-2">Sign in to view cart</h2>
           <p className="text-gray-500 mb-8">Your cart items are saved securely. Log in to access them and continue shopping.</p>
           
           <Link to="/login" state={{ from: { pathname: "/cart" } }} className="flex items-center justify-center w-full py-4 bg-black text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-all mb-4">
              Sign In Now <ArrowRight size={16} className="ml-2" />
           </Link>
           <p className="text-sm text-gray-500">
             New here? <Link to="/register" className="font-bold text-black border-b border-black">Create account</Link>
           </p>
        </div>
      </div>
    );
  }

  // Render Empty State
  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[70vh] flex flex-col items-center justify-center px-4 max-w-lg mx-auto text-center"
      >
        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8 relative">
          <ShoppingBag size={48} className="text-gray-300" />
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2 }}
            className="absolute -bottom-2 -right-2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white"
          >
            0
          </motion.div>
        </div>
        <h2 className="text-3xl font-black font-heading text-gray-900 mb-3 tracking-tight">Your cart is empty</h2>
        <p className="text-gray-500 mb-10 text-lg">Looks like you haven't added anything yet. Discover our latest collections.</p>
        <Link to="/products" className="flex items-center gap-2 py-4 px-8 bg-black text-white rounded-xl font-bold shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:shadow-black/20 transition-all">
          Explore Products <ArrowRight size={18} />
        </Link>
      </motion.div>
    );
  }

  const discountAmount = appliedCoupon ? (appliedCoupon.discountType === "percent" ? Math.round((cartSubtotal * appliedCoupon.discountValue) / 100) : appliedCoupon.discountValue) : 0;
  const orderTotal = cartSubtotal - discountAmount + DELIVERY_CHARGE;

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { toast.error("Please enter a coupon code"); return; }
    
    setCouponLoading(true);
    try {
      const storeId = items[0]?.product?.store?._id;
      const res = await api.post("/coupons/validate", { code, orderAmount: cartSubtotal, storeId });
      if (res.data.success) {
        setAppliedCoupon({ code, discountType: res.data.coupon.discountType, discountValue: res.data.coupon.discountValue });
        setCouponCode("");
        toast.success("Coupon applied!");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid or expired coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: { coupon: appliedCoupon, discountAmount, orderTotal, deliveryCharge: DELIVERY_CHARGE },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-gray-900 tracking-tight">Shopping Bag</h1>
          <p className="text-gray-500 mt-1">{items.reduce((s, i) => s + i.qty, 0)} items in your cart</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
        
        {/* Left: Cart Items */}
        <div className="w-full lg:flex-[1.5] space-y-4">
           <AnimatePresence>
             {items.map((item, i) => (
                <CartItem key={`${item.product._id}-${item.size}-${item.color}`} item={item} onRemove={removeFromCart} onQtyChange={updateQty} />
             ))}
           </AnimatePresence>
        </div>

        {/* Right: Summary */}
        <div className="w-full lg:flex-1 lg:sticky lg:top-24 space-y-6">
           <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold font-heading text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-6 space-y-3 pb-6 border-b border-gray-100">
                 <label className="flex items-center gap-2 text-sm font-bold text-gray-900"><Tag size={16}/> Promo Code</label>
                 
                 {appliedCoupon ? (
                   <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-2 text-green-800">
                        <Check size={16} />
                        <span className="font-bold tracking-wider">{appliedCoupon.code}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-xs font-bold text-green-600">Saved ₹{discountAmount}</span>
                         <button onClick={() => setAppliedCoupon(null)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                      </div>
                   </div>
                 ) : (
                   <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                      <input 
                        type="text" 
                        placeholder="e.g. SAVE20" 
                        className="flex-1 bg-transparent px-4 py-3 text-sm outline-none font-mono uppercase placeholder:normal-case placeholder:font-sans" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      />
                      <button onClick={handleApplyCoupon} disabled={couponLoading} className="px-6 font-bold text-sm bg-gray-200 hover:bg-gray-300 transition-colors">
                        {couponLoading ? <LoaderCircle size={16} className="animate-spin text-gray-500" /> : "Apply"}
                      </button>
                   </div>
                 )}
              </div>

              {/* Breakdown */}
              <div className="space-y-4 mb-6">
                 <div className="flex justify-between text-gray-600">
                   <span>Subtotal</span>
                   <span className="font-bold text-gray-900">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                 </div>
                 
                 {discountAmount > 0 && (
                   <div className="flex justify-between text-green-600 font-medium">
                     <span className="flex items-center gap-1">Discount <span className="text-[10px] px-1.5 py-0.5 bg-green-100 rounded text-green-800 font-bold uppercase">{appliedCoupon?.code}</span></span>
                     <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                   </div>
                 )}

                 <div className="flex justify-between text-gray-600">
                   <span>Delivery</span>
                   <span className={DELIVERY_CHARGE === 0 ? "font-bold text-green-600" : "font-bold text-gray-900"}>
                     {DELIVERY_CHARGE === 0 ? "FREE" : `₹${DELIVERY_CHARGE}`}
                   </span>
                 </div>
                 
                 {DELIVERY_CHARGE > 0 && (
                   <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest text-right mt-1">
                     Add ₹{(1499 - cartSubtotal).toLocaleString("en-IN")} for free delivery
                   </p>
                 )}
              </div>

              <div className="pt-6 border-t border-black/10 flex justify-between items-end mb-8">
                 <span className="font-bold text-gray-900">Total</span>
                 <div className="text-right">
                   <span className="text-3xl font-black font-heading text-gray-900 tracking-tight leading-none">₹{orderTotal.toLocaleString("en-IN")}</span>
                   <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">Includes GST</p>
                 </div>
              </div>

              <button onClick={handleCheckout} className="w-full py-4 flex items-center justify-center gap-2 bg-black text-white rounded-xl font-bold shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all group">
                 Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>

           <div className="grid grid-cols-3 gap-2">
             {[{icon: ShieldCheck, text: "Secure Payment"}, {icon: Undo2, text: "14-Day Returns"}, {icon: Zap, text: "Fast Shipping"}].map((t, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center p-4 bg-gray-50 border border-gray-100 rounded-2xl gap-2 text-gray-500">
                   <t.icon size={20} className="text-gray-400" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">{t.text}</span>
                </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
