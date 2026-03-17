import "./WhyChooseUs.scss";

const FEATURES = [
  {
    icon: "🏪",
    title: "Local Stores Online",
    text: "Real cloth shops from your city — now with digital storefronts, product listings, and online orders.",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    text: "Pay safely with Razorpay — UPI, cards, net banking, wallets. Or choose Cash on Delivery.",
  },
  {
    icon: "🚚",
    title: "Fast Delivery",
    text: "Orders processed and shipped same day. Track your package in real time from your orders page.",
  },
  {
    icon: "⭐",
    title: "Verified Reviews",
    text: "Only customers who actually purchased can leave reviews — so every rating is 100% genuine.",
  },
];

const WhyChooseUs = () => (
  <section className="why">
    <div className="why__inner">
      <div className="why__top">
        <span className="why__label">Why ClothMart</span>
        <h2 className="why__heading">Built for Indian Shoppers</h2>
        <p className="why__sub">
          Everything you need to shop cloth online — local stores, secure
          payments, and real verified reviews.
        </p>
      </div>

      <div className="why__grid">
        {FEATURES.map((f) => (
          <div className="why-card" key={f.title}>
            <span className="why-card__icon">{f.icon}</span>
            <h3 className="why-card__title">{f.title}</h3>
            <p className="why-card__text">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
