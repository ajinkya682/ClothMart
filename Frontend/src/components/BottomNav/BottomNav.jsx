import { NavLink } from "react-router-dom";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const BottomNav = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();

  const navLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/products", icon: Search, label: "Search" },
    { to: "/wishlist", icon: Heart, label: "Wishlist" },
    { to: "/cart", icon: ShoppingBag, label: "Cart", isCart: true },
    { to: user ? "/profile" : "/login", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-40 md:hidden pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <nav className="flex justify-between items-center h-[68px] px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300 active:scale-[0.92] ${
                  isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={22} strokeWidth={isActive ? 2 : 1.5} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`} />
                    {link.isCart && cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] tracking-wide transition-all ${isActive ? "font-medium opacity-100 translate-y-0" : "font-normal opacity-80"}`}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
