import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ArrowLeft, MapPin, ShieldCheck, Truck, CreditCard, ChevronRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Checkout() {
  const { items, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderTotal: initialOrderTotal } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const orderTotal = initialOrderTotal || cartSubtotal + (cartSubtotal >= 1000 ? 0 : 50);

  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items, navigate]);

  const handlePlaceOrder = () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      toast.success("Order placed successfully", {
        style: { borderRadius: '2px', background: '#0E0E0E', color: '#fff' }
      });
      clearCart();
      navigate("/orders");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
         <div className="flex flex-col lg:flex-row gap-20 xl:gap-32">
            
            {/* Left: Checkout Flow */}
            <div className="w-full lg:w-3/5 space-y-20">
               <div className="mb-12">
                  <Link to="/cart" className="inline-flex items-center gap-3 text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] hover:text-primary transition-colors mb-10">
                    <ArrowLeft size={14} /> Back to Bag
                  </Link>
                  <h1 className="text-5xl md:text-7xl font-display font-bold text-primary tracking-tighter leading-none mb-4">Checkout.</h1>
                  <p className="text-[11px] font-bold text-accent uppercase tracking-[0.3em]">Secure Atelier Transaction</p>
               </div>

               {/* Section 1: Destination */}
               <div className="space-y-10">
                  <div className="flex items-center gap-6">
                    <span className="text-3xl font-display font-bold text-gray-100 italic">01</span>
                    <h2 className="text-2xl font-display font-bold text-primary tracking-tight">Shipping Destination</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                     <div className="p-10 bg-surface-low rounded-sm border border-accent/20 flex flex-col gap-6 relative">
                        <div className="absolute top-8 right-8">
                           <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary">
                              <Check size={16} />
                           </div>
                        </div>
                        <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Primary Atelier Address</span>
                        <div>
                          <p className="text-lg font-display font-bold text-primary mb-2">John Doe</p>
                          <p className="text-sm font-light text-gray-400 leading-relaxed">
                            742 Evergreen Terrace, <br />
                            Springfield, OR 97403 <br />
                            United States
                          </p>
                        </div>
                        <button className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] border-b border-primary w-fit pb-1">Edit Address</button>
                     </div>
                  </div>
               </div>

               {/* Section 2: Method */}
               <div className="space-y-10">
                  <div className="flex items-center gap-6">
                    <span className="text-3xl font-display font-bold text-gray-100 italic">02</span>
                    <h2 className="text-2xl font-display font-bold text-primary tracking-tight">Payment Method</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="p-8 bg-primary rounded-sm flex flex-col gap-8 shadow-2xl">
                        <CreditCard size={24} className="text-accent" />
                        <div>
                           <p className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-2">Secure Online Payment</p>
                           <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Cards, UPI, Net Banking</p>
                        </div>
                     </div>
                     <div className="p-8 bg-surface-low rounded-sm flex flex-col gap-8 border border-gray-50">
                        <div className="w-6 h-6 rounded-full border border-gray-200" />
                        <div>
                           <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Hand-to-Hand Exchange</p>
                           <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Cash on Delivery</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Section 3: Review */}
               <div className="pt-10 border-t border-gray-50">
                  <p className="text-[11px] font-light text-gray-400 leading-relaxed max-w-lg mb-10">
                    By confirming this transaction, you agree to our <span className="text-primary font-bold">Atelier Terms of Service</span> and <span className="text-primary font-bold">White-Glove Delivery Protocol</span>.
                  </p>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full sm:w-auto px-16 py-6 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-accent hover:text-primary transition-all duration-500 rounded-sm shadow-2xl flex items-center justify-center gap-6 group"
                  >
                    {loading ? "Authenticating Transaction..." : "Confirm Transaction"}
                    <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </button>
               </div>
            </div>

            {/* Right: Order Summary Sticky */}
            <div className="w-full lg:w-2/5">
               <div className="sticky top-32">
                  <div className="bg-surface-low rounded-sm p-10 lg:p-12 shadow-2xl">
                    <h2 className="text-2xl font-display font-bold text-primary mb-10 tracking-tight">Atelier Summary</h2>
                    
                    <div className="space-y-6 mb-10 max-h-80 overflow-y-auto pr-4 scrollbar-thin">
                       {items.map((item) => (
                          <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-6">
                             <div className="w-16 h-20 bg-white rounded-sm overflow-hidden flex-shrink-0 relative">
                               <img src={item.images?.[0] || "/placeholder.jpg"} alt={item.name} className="w-full h-full object-cover" />
                               <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white flex items-center justify-center text-[9px] font-bold rounded-full border-2 border-white">{item.qty}</span>
                             </div>
                             <div className="flex-1">
                               <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1 truncate">{item.name}</p>
                               <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.selectedSize}</p>
                             </div>
                             <p className="text-[11px] font-bold text-primary uppercase tracking-widest">${(item.price * item.qty).toFixed(2)}</p>
                          </div>
                       ))}
                    </div>

                    <div className="space-y-4 py-8 border-t border-white mb-10">
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                         <span>Atelier Total</span>
                         <span className="text-primary">${cartSubtotal.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                         <span>Logistics</span>
                         <span className="text-accent">Complimentary</span>
                       </div>
                    </div>

                    <div className="flex justify-between items-end">
                       <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary">Transaction Total</span>
                       <span className="text-4xl font-display font-bold text-primary tracking-tighter">${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-12">
                    <div className="flex items-center gap-6 p-6 border border-gray-50 rounded-sm">
                      <ShieldCheck size={24} strokeWidth={1} className="text-accent" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Secured with 256-bit encryption</p>
                    </div>
                    <div className="flex items-center gap-6 p-6 border border-gray-50 rounded-sm">
                      <Truck size={24} strokeWidth={1} className="text-accent" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Insured express logistics</p>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
