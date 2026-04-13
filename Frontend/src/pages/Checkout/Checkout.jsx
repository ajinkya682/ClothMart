import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api from "../../utils/api";
import { ArrowLeft, LoaderCircle, MapPin, CheckCircle2, Circle, Plus, AlertCircle, ShieldCheck, Zap, HandCoins, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const { user } = useAuth();
  const { items, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { coupon, discountAmount = 0, deliveryCharge = 49 } = location.state || {};
  
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: "", city: "", state: "", pincode: "" });
  const [addressError, setAddressError] = useState("");
  const [addrLoading, setAddrLoading] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const orderTotal = cartSubtotal - discountAmount + deliveryCharge;

  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items, navigate]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) setSelectedAddress(addresses[0]);
  }, [addresses, selectedAddress]);

  const handleAddAddress = async () => {
    const { street, city, state, pincode } = newAddress;
    if (!street || !city || !state || !pincode) { setAddressError("All fields are required"); return; }
    if (!/^\d{6}$/.test(pincode)) { setAddressError("Enter a valid 6-digit pincode"); return; }
    
    setAddrLoading(true); setAddressError("");
    try {
      const res = await api.post("/auth/address", newAddress);
      setAddresses(res.data.addresses);
      setSelectedAddress(res.data.addresses[res.data.addresses.length - 1]);
      setNewAddress({ street: "", city: "", state: "", pincode: "" });
      setShowAddressForm(false);
    } catch (err) {
      setAddressError(err?.response?.data?.message || "Failed to save address");
    } finally {
      setAddrLoading(false);
    }
  };

  const buildOrderItems = () => items.map((i) => ({ product: i.product._id, qty: i.qty, size: i.size, color: i.color, price: i.price }));

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { setError("Please select a delivery address"); return; }
    setError(""); setLoading(true);

    try {
      if (paymentMethod === "cod") {
        const res = await api.post("/orders", {
          items: buildOrderItems(),
          deliveryAddress: { street: selectedAddress.street, city: selectedAddress.city, state: selectedAddress.state, pincode: selectedAddress.pincode },
          paymentMethod: "cod",
          ...(coupon?.code && { couponCode: coupon.code }),
        });
        clearCart();
        navigate("/orders", { state: { newOrderId: res.data.order._id, method: "cod" } });
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        setError("Payment gateway failed to load. Try again.");
        setLoading(false);
        return;
      }

      const intentRes = await api.post("/payment/create-intent", { amount: orderTotal });
      const options = {
        key: intentRes.data.keyId,
        amount: intentRes.data.amount * 100,
        currency: intentRes.data.currency || "INR",
        name: "ClothMart",
        description: "Fashion order",
        order_id: intentRes.data.razorpayOrderId,
        prefill: { name: user.name, email: user.email, contact: user.phone || "" },
        theme: { color: "#000000" },
        handler: async (response) => {
          try {
            const verifyRes = await api.post("/payment/verify-and-create-order", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: buildOrderItems(),
              deliveryAddress: { street: selectedAddress.street, city: selectedAddress.city, state: selectedAddress.state, pincode: selectedAddress.pincode },
              amount: orderTotal,
              ...(coupon?.code && { couponCode: coupon.code }),
            });
            clearCart();
            navigate("/orders", { state: { newOrderId: verifyRes.data.order._id, method: "razorpay" } });
          } catch {
            setError("Payment verification failed. Contact support with payment ID: " + response.razorpay_payment_id);
            setLoading(false);
          }
        },
        modal: { ondismiss: () => { setError("Payment cancelled. No amount was charged."); setLoading(false); } },
      };
      new window.Razorpay(options).open();

    } catch (err) {
      setError(err?.response?.data?.message || "Failed to place order. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 animate-fade-in">
       
       <div className="mb-8">
         <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black hover:-translate-x-1 transition-all mb-4">
           <ArrowLeft size={16} /> Back to Cart
         </Link>
         <h1 className="text-3xl font-black font-heading text-gray-900 tracking-tight">Checkout</h1>
       </div>

       <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
          
          <div className="w-full lg:flex-[1.5] space-y-8">
             
             {/* 1. Address Section */}
             <div className="bg-white rounded-[2rem] border border-gray-100 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-3">
                     <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold leading-none">1</span>
                     Delivery Address
                  </h2>
                  <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-sm font-bold text-gray-600 hover:text-black hidden sm:block">
                    {showAddressForm ? "Cancel" : "+ Add New"}
                  </button>
                </div>

                <AnimatePresence>
                  {showAddressForm && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
                       <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="col-span-1 sm:col-span-2">
                               <input placeholder="Street Address" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                            </div>
                            <div>
                               <input placeholder="City" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                            </div>
                            <div>
                               <input placeholder="State" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                               <input placeholder="Pincode" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} />
                            </div>
                         </div>
                         {addressError && <p className="text-red-500 text-xs font-bold mt-3 flex items-center gap-1"><AlertCircle size={14}/> {addressError}</p>}
                         <div className="mt-4 flex justify-end gap-3">
                            <button onClick={() => setShowAddressForm(false)} className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-black">Cancel</button>
                            <button onClick={handleAddAddress} disabled={addrLoading} className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-70">
                               {addrLoading && <LoaderCircle size={16} className="animate-spin" />} Save Address
                            </button>
                         </div>
                       </div>
                     </motion.div>
                  )}
                </AnimatePresence>

                {addresses.length === 0 && !showAddressForm ? (
                  <div className="text-center py-8">
                     <MapPin size={32} className="mx-auto text-gray-300 mb-3" />
                     <p className="text-gray-500 font-medium mb-4">No saved addresses found.</p>
                     <button onClick={() => setShowAddressForm(true)} className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold shadow-sm inline-flex items-center gap-2 hover:bg-gray-800 transition-all">
                        <Plus size={16} /> Add Address
                     </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {addresses.map((addr) => {
                       const isSelected = selectedAddress?._id === addr._id;
                       return (
                         <div 
                           key={addr._id} 
                           onClick={() => setSelectedAddress(addr)}
                           className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${isSelected ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                         >
                           {isSelected ? <CheckCircle2 size={20} className="text-black flex-shrink-0 mt-0.5" /> : <Circle size={20} className="text-gray-300 flex-shrink-0 mt-0.5" />}
                           <div>
                             <p className="text-sm font-bold text-gray-900 mb-1">{addr.street}</p>
                             <p className="text-xs text-gray-500 leading-relaxed">{addr.city}, {addr.state} <br/><span className="font-mono mt-1 inline-block text-gray-400">{addr.pincode}</span></p>
                           </div>
                         </div>
                       )
                     })}
                  </div>
                )}
             </div>

             {/* 2. Payment Method Section */}
             <div className="bg-white rounded-[2rem] border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-3 mb-6">
                   <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold leading-none">2</span>
                   Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div 
                     onClick={() => setPaymentMethod("razorpay")}
                     className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${paymentMethod === "razorpay" ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                   >
                      {paymentMethod === "razorpay" ? <CheckCircle2 size={20} className="text-black flex-shrink-0 mt-0.5" /> : <Circle size={20} className="text-gray-300 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-bold text-gray-900 mb-1 flex items-center gap-2"><Building2 size={16} className="text-gray-400"/> Pay Online</p>
                        <p className="text-xs text-gray-500">UPI, Cards, Net Banking, Wallets via Razorpay</p>
                      </div>
                   </div>

                   <div 
                     onClick={() => setPaymentMethod("cod")}
                     className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${paymentMethod === "cod" ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                   >
                      {paymentMethod === "cod" ? <CheckCircle2 size={20} className="text-black flex-shrink-0 mt-0.5" /> : <Circle size={20} className="text-gray-300 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-bold text-gray-900 mb-1 flex items-center gap-2"><HandCoins size={16} className="text-gray-400"/> Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when your order arrives at your doorstep</p>
                      </div>
                   </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start justify-center gap-3">
                   <ShieldCheck size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                   <p className="text-xs font-medium text-blue-800 leading-relaxed">
                     Your order is only placed after successful payment confirmation. <br className="hidden sm:block"/> No charge if you cancel during the payment process.
                   </p>
                </div>
             </div>

          </div>

          <div className="w-full lg:flex-1 lg:sticky lg:top-24 space-y-6">
             <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold font-heading text-gray-900 mb-6">Order Details</h2>

                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto no-scrollbar pb-2">
                   {items.map((item) => (
                      <div key={`${item.product._id}-${item.size}-${item.color}`} className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 relative border border-gray-100">
                           <img src={item.product.images?.[0] || "/placeholder.jpg"} alt={item.product.name} className="w-full h-full object-cover" />
                           <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">{item.qty}</span>
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="font-bold text-gray-900 text-sm truncate leading-tight">{item.product.name}</p>
                           <p className="text-xs text-gray-500 mt-0.5">{[item.size, item.color].filter(Boolean).join(" · ")}</p>
                         </div>
                         <p className="font-bold text-gray-900 text-sm">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                      </div>
                   ))}
                </div>

                <div className="space-y-4 py-6 border-t border-gray-100">
                   <div className="flex justify-between text-gray-600 text-sm">
                     <span>Subtotal</span>
                     <span className="font-bold text-gray-900">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                   </div>
                   {discountAmount > 0 && (
                     <div className="flex justify-between text-green-600 text-sm font-medium">
                       <span>Discount {coupon?.code && `(${coupon.code})`}</span>
                       <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                     </div>
                   )}
                   <div className="flex justify-between text-gray-600 text-sm">
                     <span>Delivery</span>
                     <span className={deliveryCharge === 0 ? "font-bold text-green-600" : "font-bold text-gray-900"}>
                       {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                     </span>
                   </div>
                </div>

                <div className="pt-6 border-t border-black/10 flex justify-between items-end mb-8">
                   <span className="font-bold text-gray-900">Total to Pay</span>
                   <span className="text-2xl font-black font-heading text-gray-900 tracking-tight leading-none">₹{orderTotal.toLocaleString("en-IN")}</span>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                     <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                     <p className="text-xs font-bold text-red-800">{error}</p>
                  </div>
                )}

                <button 
                  onClick={handlePlaceOrder} 
                  disabled={loading || addresses.length === 0}
                  className={`w-full py-4 flex items-center justify-center gap-2 bg-black text-white rounded-xl text-lg font-bold shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:shadow-black/20 transition-all ${loading || addresses.length === 0 ? 'opacity-70 pointer-events-none' : ''}`}
                >
                   {loading ? <LoaderCircle size={20} className="animate-spin" /> : paymentMethod === "cod" ? "Place Order (COD)" : "Pay Securely via Razorpay"}
                </button>
             </div>

             <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center px-4">
                <ShieldCheck size={14} className="mb-0.5 text-gray-300" />
                100% Secured by Razorpay & SSL
             </div>
          </div>
       </div>
    </div>
  );
}
