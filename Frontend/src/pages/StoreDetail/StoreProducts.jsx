import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import api from "../../utils/api";
import { mockProducts } from "./mockData"; // 🔁 Replace with API

const StoreProducts = ({ storeId }) => {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    // 🔁 Replace mock with: api.get(`/products?store=${storeId}&page=1&limit=12`)
    setLoading(false);
  }, [storeId]);

  const handleAddToCart = (product) => {
    addToCart(product, 1, product.sizes[0], product.colors[0]);
  };

  if (loading)
    return <div className="products-shimmer">@include m.shimmer</div>;

  return (
    <section className="store-products">
      <div className="header">
        <h2>{products.length} Products</h2>
        <select className="sort">
          <option>Newest</option>
          <option>Price Low-High</option>
        </select>
      </div>
      <div className="grid">
        {products.map((product, i) => (
          <div
            key={product._id}
            className="product-card"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <img src={product.images[0]} alt={product.name} loading="lazy" />
            <div className="info">
              <h3>{product.name}</h3>
              <div className="price">
                <span className="current">
                  ₹{product.discountPrice || product.price}
                </span>
                {product.discountPrice && (
                  <span className="original">₹{product.price}</span>
                )}
              </div>
              <div className="rating">★ {product.rating}</div>
              <button
                onClick={() => handleAddToCart(product)}
                className="add-cart"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoreProducts;
