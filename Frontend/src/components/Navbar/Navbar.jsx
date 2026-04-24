import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBag, User, LogOut, Package, Store, Heart, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/stores", label: "Stores" },
  { to: "/products", label: "Shop" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled || mobileMenuOpen ? "bg-white/95 backdrop-blur-2xl" : "bg-transparent"
        }`}
      >
        {/* Tonal Divider (instead of border) */}
        {scrolled && <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-100/50" />}

        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex justify-between items-center h-[80px]">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center z-50 group">
              <span className="font-display text-2xl font-extrabold tracking-tighter text-primary transition-all duration-500 group-hover:tracking-normal group-hover:text-accent">
                CLOTHMART<span className="text-accent group-hover:text-primary transition-colors duration-500">.</span>
              </span>
            </Link>

            {/* Center: Desktop Nav */}
            <nav className="hidden md:flex space-x-12">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `relative text-[10px] uppercase font-bold tracking-[0.25em] transition-all duration-500 ${
                      isActive ? "text-primary" : "text-gray-400 hover:text-primary"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-2 left-0 right-0 h-[2px] bg-accent"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 35 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4 z-50">
              <Link to="/products" className="p-3 text-primary/80 hover:text-accent transition-all duration-300 hover:scale-110 active:scale-90">
                <Search size={18} strokeWidth={2} />
              </Link>
              
              <Link to="/wishlist" className="relative p-3 text-primary/80 hover:text-accent transition-all duration-300 hover:scale-110 active:scale-90">
                <Heart size={18} strokeWidth={2} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full" />
                )}
              </Link>

              <Link to="/cart" className="relative p-3 text-primary/80 hover:text-accent transition-all duration-300 hover:scale-110 active:scale-90">
                <ShoppingBag size={18} strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border-[1.5px] border-white group-hover:bg-accent transition-colors">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative hidden sm:block ml-2" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center p-0.5 rounded-full border border-transparent hover:border-accent/30 transition-all duration-500"
                  >
                    <div className="w-9 h-9 rounded-full bg-surface-low flex items-center justify-center overflow-hidden border-[1.5px] border-gray-100">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-primary">{initials}</span>
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 mt-4 w-64 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] py-3 rounded-sm border border-gray-100/50"
                      >
                        <div className="px-6 py-4 bg-surface-low/50">
                          <p className="text-[11px] font-bold text-primary tracking-[0.1em] uppercase truncate">{user.name}</p>
                          <p className="text-[10px] text-gray-400 truncate mt-1">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link to="/profile" className="flex items-center px-6 py-3 text-[11px] uppercase font-bold tracking-widest text-gray-500 hover:text-accent hover:bg-surface-low transition-all">
                            <User size={14} className="mr-4" /> Profile
                          </Link>
                          <Link to="/orders" className="flex items-center px-6 py-3 text-[11px] uppercase font-bold tracking-widest text-gray-500 hover:text-accent hover:bg-surface-low transition-all">
                            <Package size={14} className="mr-4" /> Orders
                          </Link>
                        </div>
                        <div className="border-t border-gray-50 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-6 py-3 text-[11px] uppercase font-bold tracking-widest text-red-500 hover:bg-red-50 transition-all"
                          >
                            <LogOut size={14} className="mr-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-6 ml-4">
                  <Link to="/login" className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors tracking-widest uppercase">
                    Login
                  </Link>
                  <Link to="/register" className="text-[10px] font-bold bg-primary text-white px-7 py-3.5 rounded-sm hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-500 tracking-widest uppercase">
                    Register
                  </Link>
                </div>
              )}

              {/* Hamburger Toggle */}
              <button
                className="md:hidden p-3 text-primary hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] bg-white z-50 flex flex-col md:hidden pt-32 px-10"
            >
              <nav className="flex flex-col space-y-8 mb-12">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `text-3xl font-display font-bold tracking-tighter transition-all ${
                        isActive ? "text-accent" : "text-primary"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="flex flex-col space-y-6 pt-12 border-t border-gray-100">
                {user ? (
                  <>
                    <Link to="/profile" className="text-sm font-bold uppercase tracking-widest text-gray-500">Account</Link>
                    <Link to="/orders" className="text-sm font-bold uppercase tracking-widest text-gray-500">Orders</Link>
                    <button onClick={handleLogout} className="text-sm font-bold uppercase tracking-widest text-red-500 text-left">Logout</button>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link to="/login" className="w-full text-center py-5 border border-primary text-[11px] font-bold uppercase tracking-[0.2em]">Login</Link>
                    <Link to="/register" className="w-full text-center py-5 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em]">Register</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
