import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cm_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cm_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1, size = "") => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && i.selectedSize === size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.selectedSize === size
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [...prev, { ...product, qty, selectedSize: size }];
    });
  };

  const removeFromCart = (productId, size) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === productId && i.selectedSize === size))
    );
  };

  const updateQty = (productId, size, qty) => {
    if (qty < 1) return removeFromCart(productId, size);
    setItems((prev) =>
      prev.map((i) =>
        i.id === productId && i.selectedSize === size ? { ...i, qty } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cm_cart");
  };

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

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
