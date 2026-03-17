import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cm_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cm_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1, size = "", color = "") => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.product._id === product._id && i.size === size && i.color === color,
      );
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id && i.size === size && i.color === color
            ? { ...i, qty: i.qty + qty }
            : i,
        );
      }
      return [
        ...prev,
        {
          product,
          qty,
          size,
          color,
          price: product.discountPrice || product.price,
        },
      ];
    });
  };

  const removeFromCart = (productId, size, color) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(
            i.product._id === productId &&
            i.size === size &&
            i.color === color
          ),
      ),
    );
  };

  const updateQty = (productId, size, color, qty) => {
    if (qty < 1) return removeFromCart(productId, size, color);
    setItems((prev) =>
      prev.map((i) =>
        i.product._id === productId && i.size === size && i.color === color
          ? { ...i, qty }
          : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const cartSubtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ THIS IS THE MISSING EXPORT
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
