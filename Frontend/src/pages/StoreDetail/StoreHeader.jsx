import React from "react";

const categoryLabels = {
  saree: "Saree & Silk",
  kids: "Kids' Wear",
  mens: "Men's Fashion",
  ethnic: "Ethnic & Traditional",
  western: "Women's Western",
  other: "Streetwear",
};

const StoreHeader = ({ store }) => {
  // ❌ Remove = mockStore
  if (!store)
    return (
      <div
        className="shimmer"
        style={{ height: "300px", borderRadius: "24px" }}
      />
    );

  return (
    <section className="store-header">
      <div
        className="banner"
        style={{
          backgroundImage: `url(${store.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop"})`,
        }}
      >
        <div className="overlay">
          <img
            src={
              store.logo ||
              "https://images.unsplash.com/photo-1574259514741-757d1fc48f22?w=200&h=200&fit=crop"
            }
            alt={store.name}
            className="logo"
            loading="lazy"
          />
          <div className="info">
            <h1 className="name">{store.name}</h1>
            <div className="meta">
              <span className="category">
                {categoryLabels[store.category] || store.category}
              </span>
              <div className="rating">★ {store.rating || 4.5}</div>
              <button className="follow-btn">Follow Store</button>
            </div>
          </div>
        </div>
      </div>
      <div className="details">
        <p className="desc">{store.description}</p>
        <div className="stats">
          <span>
            Location: {store.address?.city || "Mumbai"},{" "}
            {store.address?.state || "Maharashtra"}
          </span>
          <span>Phone: {store.phone || "N/A"}</span>
        </div>
      </div>
    </section>
  );
};

export default StoreHeader;
