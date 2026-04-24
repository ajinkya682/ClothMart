import { Link } from "react-router-dom";

const COLS = [
  {
    title: "Atelier",
    links: [
      { to: "/products", label: "Collections" },
      { to: "/products?category=men", label: "Men" },
      { to: "/products?category=women", label: "Women" },
      { to: "/products?category=accessories", label: "Accessories" },
    ],
  },
  {
    title: "Explore",
    links: [
      { to: "/stores", label: "Flagships" },
      { to: "/wishlist", label: "Archive" },
      { to: "/cart", label: "Bag" },
    ],
  },
  {
    title: "Insight",
    links: [
      { to: "/profile", label: "Profile" },
      { to: "/orders", label: "History" },
      { to: "/track-order", label: "Logistics" },
    ],
  },
];

const Footer = () => (
  <footer className="bg-primary text-white pt-32 pb-12 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 sm:px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-20 lg:gap-12 mb-32">
        <div className="lg:col-span-2 flex flex-col items-start">
          <Link to="/" className="group mb-10">
            <span className="font-display text-4xl font-extrabold tracking-tighter text-white transition-all duration-500 group-hover:tracking-normal group-hover:text-accent">
              CLOTHMART<span className="text-accent group-hover:text-white transition-colors duration-500">.</span>
            </span>
          </Link>
          <p className="text-white/40 text-[13px] font-light leading-relaxed max-w-sm mb-12 italic">
            "Elevating the digital atelier experience through curated craft, timeless design, and white-glove service."
          </p>
          <div className="flex gap-8">
            {["Instagram", "X (Twitter)", "Vogue"].map(social => (
              <a key={social} href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-accent transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <p className="text-[10px] font-bold text-accent mb-10 uppercase tracking-[0.3em]">
              {col.title}
            </p>
            <nav className="flex flex-col gap-6">
              {col.links.map((l) => (
                <Link
                  to={l.to}
                  key={l.label}
                  className="text-white/50 text-[11px] font-bold uppercase tracking-widest hover:text-white hover:translate-x-2 transition-all duration-500"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.2em] text-center md:text-left">
          © {new Date().getFullYear()} ClothMart Digital Atelier. Crafted for Distinction.
        </p>
        <div className="flex items-center gap-12">
          {["Privacy", "Terms", "Shipping"].map(item => (
            <a key={item} href="#" className="text-white/20 text-[9px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
