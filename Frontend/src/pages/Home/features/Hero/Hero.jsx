import { Link } from "react-router-dom";
import "./Hero.scss";

const STATS = [
  { val: "500K+", key: "Products" },
  { val: "180+", key: "Stores" },
  { val: "100K+", key: "Customers" },
  { val: "4.9", key: "Rating" },
];

const Hero = () => (
  <section className="hero">
    <div className="hero__dots" aria-hidden="true" />
    <div className="hero__glow-a" aria-hidden="true" />
    <div className="hero__glow-b" aria-hidden="true" />
    <span className="hero__ghost" aria-hidden="true">
      CLOTH
    </span>

    <div className="hero__inner">
      <div className="hero__badge">
        <span className="hero__badge-dot" />
        <span className="hero__badge-text">
          India's cloth stores — now online
        </span>
      </div>

      <h1 className="hero__title">
        CLOTH<span className="hero__title--yellow">MART</span>
        <br />
        <span className="hero__title--outline">IS HERE.</span>
      </h1>

      <p className="hero__desc">
        Discover <strong>premium cloth stores</strong> from across India.
        Sarees, kurtis, suits, lehengas — browse thousands of products and order
        with <strong>secure payment</strong> to your door.
      </p>

      <div className="hero__cta">
        <Link to="/products" className="hero__btn-primary">
          Shop Now
        </Link>
        <Link to="/stores" className="hero__btn-ghost">
          Explore Stores
        </Link>
      </div>

      <div className="hero__stats">
        {STATS.map(({ val, key }) => (
          <div className="hero__stat" key={key}>
            <span className="hero__stat-val">{val}</span>
            <span className="hero__stat-key">{key}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="hero__scroll" aria-hidden="true">
      <span className="hero__scroll-label">scroll</span>
      <div className="hero__scroll-line" />
    </div>
  </section>
);

export default Hero;
