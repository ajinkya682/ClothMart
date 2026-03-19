import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Navbar.scss";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/stores", label: "Stores" },
  { to: "/products", label: "Products" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  // scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close dropdown on outside click
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

  const isLightPage = location.pathname !== "/";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <>
      <nav
        className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${isLightPage ? "navbar--light" : ""}`}
      >
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <div className="navbar__logo-mark">C</div>
            <span className="navbar__logo-text">ClothMart</span>
          </Link>

          {/* Desktop links */}
          <div className="navbar__links">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "navbar__link--active" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="navbar__actions">
            {/* ── Cart icon — only shown when logged in ── */}
            {user && (
              <Link to="/cart" className="navbar__cart" aria-label="Cart">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M1 1h3l1.6 8h9.8l1.6-5.5H5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="8" cy="17" r="1.2" fill="currentColor" />
                  <circle cx="15" cy="17" r="1.2" fill="currentColor" />
                </svg>
                {cartCount > 0 && (
                  <span className="navbar__cart-badge">{cartCount}</span>
                )}
              </Link>
            )}

            {/* User or Auth */}
            {user ? (
              <div className="navbar__user-wrap" ref={dropdownRef}>
                <button
                  className="navbar__user-btn"
                  onClick={() => setDropdownOpen((o) => !o)}
                >
                  <div className="navbar__avatar">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="" />
                    ) : (
                      initials
                    )}
                  </div>
                  <span className="navbar__user-name">
                    {user.name.split(" ")[0]}
                  </span>
                  <span
                    className={`navbar__chevron ${dropdownOpen ? "navbar__chevron--open" : ""}`}
                  >
                    ▾
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="navbar__dropdown">
                    <div className="navbar__dropdown-header">
                      <p className="navbar__dropdown-name">{user.name}</p>
                      <p className="navbar__dropdown-email">{user.email}</p>
                    </div>
                    <div className="navbar__dropdown-items">
                      <Link to="/profile" className="navbar__dropdown-item">
                        👤 My Profile
                      </Link>
                      <Link to="/orders" className="navbar__dropdown-item">
                        📦 My Orders
                      </Link>
                      <Link to="/track-order" className="navbar__dropdown-item">
                        🔍 Track Order
                      </Link>
                      {user.role === "store_owner" && (
                        <>
                          <div className="navbar__dropdown-divider" />
                          <Link
                            to="/dashboard"
                            className="navbar__dropdown-item"
                          >
                            🏪 My Store
                          </Link>
                        </>
                      )}
                      <div className="navbar__dropdown-divider" />
                      <button
                        onClick={handleLogout}
                        className="navbar__dropdown-item navbar__dropdown-item--danger"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar__auth">
                <Link to="/login" className="navbar__login">
                  Login
                </Link>
                <Link to="/register" className="navbar__register">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              className={`navbar__hamburger ${mobileOpen ? "navbar__hamburger--open" : ""}`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu__links">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `mobile-menu__link ${isActive ? "mobile-menu__link--active" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="mobile-menu__footer">
            {user ? (
              <>
                {/* Cart link in mobile menu when logged in */}
                <Link to="/cart" className="mobile-menu__link">
                  🛒 My Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                <Link to="/profile" className="mobile-menu__link">
                  👤 My Profile
                </Link>
                <Link to="/orders" className="mobile-menu__link">
                  📦 My Orders
                </Link>
                <Link to="/wishlist" className="mobile-menu__link">
                  ❤️ Wishlist
                </Link>
                <button
                  onClick={handleLogout}
                  className="mobile-menu__link mobile-menu__link--danger"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-menu__link">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mobile-menu__link mobile-menu__link--cta"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
