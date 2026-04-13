import { Link } from "react-router-dom";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

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
    ],
  },
];

const Footer = () => (
  <footer className="bg-black text-white border-t border-gray-900 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-heading font-black text-xl tracking-tighter">C</div>
            <span className="font-bold font-heading text-2xl tracking-tight">ClothMart</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            India's cloth stores — now online. Discover local stores, browse thousands of premium products, and shop with absolute confidence.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <FaLinkedin size={18} />
            </a>
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <p className="font-bold text-white mb-6 uppercase tracking-widest text-sm">{col.title}</p>
            <nav className="flex flex-col gap-4">
              {col.links.map((l) => (
                <Link to={l.to} key={l.label} className="text-gray-400 text-sm hover:text-white hover:translate-x-1 transition-all">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </div>

    <div className="border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-xs text-center md:text-left">
          © {new Date().getFullYear()} <span className="font-bold text-white tracking-wide">ClothMart</span>. Built by Ajinkya Saivar · Sambhajinagar, Maharashtra.
        </p>
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
