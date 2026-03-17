import { Link } from "react-router-dom";
import "./Categories.scss";

const CATS = [
  { icon: "🥻", name: "Sarees", count: "120+", slug: "saree" },
  { icon: "👘", name: "Kurtis", count: "85+", slug: "kurti" },
  { icon: "👔", name: "Mens", count: "60+", slug: "mens" },
  { icon: "👗", name: "Western", count: "74+", slug: "western" },
  { icon: "🎀", name: "Kids", count: "50+", slug: "kids" },
  { icon: "✨", name: "Ethnic", count: "92+", slug: "ethnic" },
];

const Categories = () => (
  <section className="categories">
    <div className="categories__inner">
      <div className="categories__top">
        <div>
          <span className="categories__label">Explore</span>
          <h2 className="categories__heading">Shop by Category</h2>
        </div>
        <Link to="/products" className="categories__viewall">
          All products
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      <div className="categories__grid">
        {CATS.map((c) => (
          <Link
            to={`/products?category=${c.slug}`}
            key={c.slug}
            className="cat-card"
          >
            <span className="cat-card__icon">{c.icon}</span>
            <p className="cat-card__name">{c.name}</p>
            <span className="cat-card__count">{c.count} items</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Categories;
