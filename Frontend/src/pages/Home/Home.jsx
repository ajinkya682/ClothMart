import Hero from "./features/Hero/Hero";
import Categories from "./features/Categories/Categories";
import FeaturedStores from "./features/FeaturedStores/FeaturedStores";
import TrendingProducts from "./features/TrendingProducts/TrendingProducts";
import WhyChooseUs from "./features/WhyChooseUs/WhyChooseUs";
import Newsletter from "./features/Newsletter/Newsletter";
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
    </main>
  );
}
