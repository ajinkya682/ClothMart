import { Link } from "react-router-dom";
import "./Footer.scss";

const COLS = [
  {
    title: "Shop",
    links: [
      { to: "/products", label: "All Products" },
      { to: "/products?category=saree", label: "Sarees" },
      { to: "/products?category=kurti", label: "Kurtis" },
      { to: "/products?category=mens", label: "Mens Wear" },
      { to: "/products?category=kids", label: "Kids Wear" },
    ],
  },
  {
    title: "Stores",
    links: [
      { to: "/stores", label: "All Stores" },
      { to: "/register", label: "List My Store" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Login" },
      { to: "/register", label: "Register" },
      { to: "/profile", label: "My Profile" },
      { to: "/orders", label: "My Orders" },
      { to: "/wishlist", label: "Wishlist" },
    ],
  },
];

const Footer = () => (
  <footer className="footer">
    <div className="footer__top">
      <div className="footer__brand">
        <Link to="/" className="footer__logo">
          <div className="footer__logo-mark">C</div>
          <span className="footer__logo-text">ClothMart</span>
        </Link>
        <p className="footer__tagline">
          India's cloth stores — now online. Discover local stores, browse
          thousands of products, and shop with confidence.
        </p>
        <div className="footer__socials">
          <a href="#" className="footer__social">
            𝕏
          </a>
          <a href="#" className="footer__social">
            📸
          </a>
          <a href="#" className="footer__social">
            in
          </a>
        </div>
      </div>

      {COLS.map((col) => (
        <div className="footer__col" key={col.title}>
          <p className="footer__col-title">{col.title}</p>
          <nav className="footer__col-links">
            {col.links.map((l) => (
              <Link to={l.to} key={l.label} className="footer__col-link">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      ))}
    </div>

    <div className="footer__bottom">
      <div className="footer__bottom-inner">
        <p className="footer__copy">
          © 2026 <span className="footer__copy-accent">ClothMart</span>. Built
          by Ajinkya Saivar · Sambhajinagar, Maharashtra.
        </p>
        <div className="footer__legal">
          <a href="#" className="footer__legal-link">
            Privacy
          </a>
          <a href="#" className="footer__legal-link">
            Terms
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
