import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, Store, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const BottomNav = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();

  const navLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/products", icon: ShoppingBag, label: "Shop" },
    { to: "/stores", icon: Store, label: "Stores" },
    { to: user ? "/profile" : "/login", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-40 md:hidden pb-safe">
      <nav className="flex justify-around items-center h-16">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? "text-black" : "text-gray-400 hover:text-gray-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    {link.label === "Shop" && cartCount > 0 && (
                      <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>
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
