import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBag, User, LogOut, Package, Store, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 z-50">
              <div className="w-8 h-8 bg-black text-white rounded-md flex items-center justify-center font-heading font-bold text-lg tracking-tighter">
                CM
              </div>
              <span className="font-heading font-semibold text-xl tracking-tight hidden sm:block">
                ClothMart
              </span>
            </Link>

            {/* Center: Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `relative font-medium text-sm transition-colors hover:text-black ${
                      isActive ? "text-black" : "text-gray-500"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 sm:gap-5 z-50">
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-black transition-colors">
                <ShoppingBag size={22} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-semibold text-gray-600">{initials}</span>
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-float py-2"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                            <User size={16} className="mr-3" /> Profile
                          </Link>
                          <Link to="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                            <Package size={16} className="mr-3" /> Orders
                          </Link>
                          {user.role === "store_owner" && (
                            <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black">
                              <Store size={16} className="mr-3" /> Dashboard
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-gray-100 pt-2 px-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut size={16} className="mr-3" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-4">
                  <Link to="/login" className="text-sm font-medium hover:text-gray-600 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Hamburger Toggle (Mobile/Tablet) */}
              <button
                className="md:hidden p-2 text-gray-700 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl z-40 flex flex-col md:hidden pt-20 pb-6 px-6"
            >
              <div className="flex flex-col flex-grow space-y-6">
                <nav className="flex flex-col space-y-4">
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `text-2xl font-heading font-medium transition-colors ${
                          isActive ? "text-black" : "text-gray-400"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>

                <hr className="border-gray-100" />

                <div className="flex flex-col space-y-4">
                  {user ? (
                    <>
                      <Link to="/profile" className="flex items-center text-lg text-gray-600">
                        <User size={20} className="mr-4" /> Profile
                      </Link>
                      <Link to="/orders" className="flex items-center text-lg text-gray-600">
                        <Package size={20} className="mr-4" /> Orders
                      </Link>
                      {user.role === "store_owner" && (
                        <Link to="/dashboard" className="flex items-center text-lg text-gray-600">
                          <Store size={20} className="mr-4" /> Dashboard
                        </Link>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 mt-4">
                      <Link
                        to="/register"
                        className="w-full text-center bg-black text-white py-3 rounded-xl font-medium"
                      >
                        Sign Up Free
                      </Link>
                      <Link
                        to="/login"
                        className="w-full text-center bg-gray-100 text-black py-3 rounded-xl font-medium"
                      >
                        Login to Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {user && (
                <div className="mt-auto pt-6">
                  <button
                    onClick={handleLogout}
                    className="flex text-lg items-center text-red-500 font-medium"
                  >
                    <LogOut size={20} className="mr-4" /> Log out
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

