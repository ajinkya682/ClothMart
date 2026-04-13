import Hero from "./features/Hero/Hero";
import Categories from "./features/Categories/Categories";
import FeaturedStores from "./features/FeaturedStores/FeaturedStores";
import TrendingProducts from "./features/TrendingProducts/TrendingProducts";
import WhyChooseUs from "./features/WhyChooseUs/WhyChooseUs";
import Newsletter from "./features/Newsletter/Newsletter";
import { Link } from "react-router-dom";
import "./Home.scss";

export default function Home() {
  return (
    <main className="home">
      <Hero />
      <Categories />
      <FeaturedStores />
      <TrendingProducts />
      <WhyChooseUs />
      <Newsletter />
      <section className="home-cta">
        <div className="home-cta__inner container">
          <div className="home-cta__content">
            <span className="home-cta__label">Built Like A Real Startup</span>
            <h2 className="home-cta__title">
              Launch your next fashion storefront with a premium ClothMart UI
              system.
            </h2>
            <p className="home-cta__text">
              Explore the customer journey, seller dashboard, order flow, and
              polished multi-store commerce experience in one portfolio-ready
              product.
            </p>
          </div>
          <div className="home-cta__actions">
            <Link to="/products" className="home-cta__primary">
              Explore Products
            </Link>
            <Link to="/dashboard" className="home-cta__secondary">
              View Seller Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
