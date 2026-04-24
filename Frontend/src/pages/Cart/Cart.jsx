import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Trash2, ShieldCheck, RotateCcw, Truck, ArrowRight, Minus, Plus, Tag, Check, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function CartItem({ item, onRemove, onQtyChange }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-10 border-b border-gray-50 flex gap-8 group relative"
    >
      <div className="w-28 h-36 flex-shrink-0 bg-surface-low rounded-sm overflow-hidden">
        <img
          src={item.images?.[0] || "/placeholder.jpg"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-110"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] block mb-2">{item.store}</span>
            <Link to={`/products/${item.id}`}>
              <h3 className="text-lg font-display font-bold text-primary tracking-tight group-hover:text-accent transition-colors">{item.name}</h3>
            </Link>
            {item.selectedSize && (
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mt-2">Size: {item.selectedSize}</span>
            )}
          </div>
          <button 
            onClick={() => onRemove(item.id, item.selectedSize)}
            className="text-gray-200 hover:text-red-500 transition-colors p-2"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between">
           <div className="flex items-center bg-surface-low rounded-sm p-0.5">
              <button 
                onClick={() => onQtyChange(item.id, item.selectedSize, item.qty - 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
              ><Minus size={12} /></button>
              <span className="w-8 text-center text-[11px] font-bold">{item.qty}</span>
              <button 
                onClick={() => onQtyChange(item.id, item.selectedSize, item.qty + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
              ><Plus size={12} /></button>
           </div>
           <span className="text-lg font-display font-bold text-primary">${(item.price * item.qty).toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Cart() {
  const { items, cartSubtotal, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const DELIVERY_CHARGE = cartSubtotal >= 1000 ? 0 : 50;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-32 h-32 bg-surface-low rounded-full flex items-center justify-center mb-10">
          <ShoppingBag size={48} strokeWidth={1} className="text-gray-300" />
        </div>
        <h2 className="text-4xl font-display font-bold text-primary mb-6 tracking-tight">Your Atelier Bag is Empty</h2>
        <p className="text-gray-400 max-w-sm mb-12 font-light leading-relaxed">Discover our latest collections and find something to define your style.</p>
        <Link to="/products" className="bg-primary text-white px-12 py-5 rounded-sm text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-accent hover:text-primary transition-all">
          Explore Collections
        </Link>
      </div>
    );
  }

  const orderTotal = cartSubtotal + DELIVERY_CHARGE;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 sm:px-10 pt-40 pb-40"
    >
      <div className="flex flex-col lg:flex-row gap-20 xl:gap-32">
        {/* Left: Cart Items */}
        <div className="w-full lg:w-3/5">
          <div className="mb-12">
            <h1 className="text-5xl font-display font-bold text-primary tracking-tighter mb-4">Bag.</h1>
            <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.3em]">Items curated for your wardrobe</p>
          </div>
          
          <div className="flex flex-col border-t border-gray-50">
            <AnimatePresence>
              {items.map((item) => (
                <CartItem 
                  key={`${item.id}-${item.selectedSize}`} 
                  item={item} 
                  onRemove={removeFromCart} 
                  onQtyChange={updateQty} 
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-12">
            <button 
              onClick={() => clearCart()}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 hover:text-red-500 transition-colors"
            >
              Clear Atelier Bag —
            </button>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="w-full lg:w-2/5">
          <div className="sticky top-32">
            <div className="bg-surface-low rounded-sm p-10 lg:p-12 shadow-2xl">
              <h2 className="text-2xl font-display font-bold text-primary mb-10 tracking-tight">Summary</h2>
              
              <div className="space-y-6 mb-10 pb-10 border-b border-white">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-primary">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  <span>Shipping</span>
                  <span className={DELIVERY_CHARGE === 0 ? "text-accent" : "text-primary"}>
                    {DELIVERY_CHARGE === 0 ? "Complimentary" : `$${DELIVERY_CHARGE.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-10">
                <div className="flex bg-white rounded-sm overflow-hidden p-1 shadow-sm">
                  <input 
                    type="text" 
                    placeholder="PROMO CODE" 
                    className="flex-1 bg-transparent px-4 py-3 text-[10px] font-bold tracking-widest outline-none uppercase placeholder:text-gray-200" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="bg-primary text-white px-6 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                    Apply
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-end mb-12">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary">Total</span>
                <span className="text-4xl font-display font-bold text-primary tracking-tighter">${orderTotal.toFixed(2)}</span>
              </div>

              <button 
                onClick={() => navigate("/checkout")}
                className="w-full py-5 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-accent hover:text-primary transition-all duration-500 rounded-sm shadow-2xl flex items-center justify-center gap-4 group"
              >
                Proceed to Checkout <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-12">
              <div className="flex items-center gap-6 p-6 border border-gray-50 rounded-sm">
                <ShieldCheck size={24} strokeWidth={1} className="text-accent" />
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Secure encrypted checkout</p>
              </div>
              <div className="flex items-center gap-6 p-6 border border-gray-50 rounded-sm">
                <Truck size={24} strokeWidth={1} className="text-accent" />
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Global White-Glove delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
