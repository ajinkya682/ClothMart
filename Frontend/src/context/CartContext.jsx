import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../utils/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // ── Check if user is logged in ────────────────────────────────────────────
  const isLoggedIn = () => !!localStorage.getItem("cm_token");

  // ── Load cart on mount ────────────────────────────────────────────────────
  // If logged in → fetch from DB
  // If not → load from localStorage
  useEffect(() => {
    const init = async () => {
      if (isLoggedIn()) {
        await fetchCartFromDB();
      } else {
        const saved = localStorage.getItem("cm_cart");
        if (saved) {
          try {
            setItems(JSON.parse(saved));
          } catch {}
        }
      }
    };
    init();
  }, []);

  // ── Persist to localStorage whenever items change (offline backup) ────────
  useEffect(() => {
    localStorage.setItem("cm_cart", JSON.stringify(items));
  }, [items]);

  // ── Fetch full cart from DB ───────────────────────────────────────────────
  const fetchCartFromDB = async () => {
    try {
      const res = await api.get("/cart");
      if (res.data.success) setItems(res.data.items);
    } catch (err) {
      // Fall back to localStorage if DB fetch fails
      const saved = localStorage.getItem("cm_cart");
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {}
      }
    }
  };

  // ── Called by AuthContext after login — merges local cart into DB ─────────
  const syncAfterLogin = useCallback(async () => {
    const saved = localStorage.getItem("cm_cart");
    const localItems = saved ? JSON.parse(saved) : [];

    if (localItems.length > 0) {
      // Merge local items into DB cart
      setSyncing(true);
      try {
        const res = await api.post("/cart/sync", { items: localItems });
        if (res.data.success) {
          setItems(res.data.items);
          localStorage.removeItem("cm_cart");
        }
      } catch {
        // If sync fails, just fetch DB cart
        await fetchCartFromDB();
      } finally {
        setSyncing(false);
      }
    } else {
      // No local items — just fetch from DB
      await fetchCartFromDB();
    }
  }, []);

  // ── Called by AuthContext on logout — wipe cart state ────────────────────
  const clearCartOnLogout = useCallback(() => {
    setItems([]);
    localStorage.removeItem("cm_cart");
  }, []);

  // ── ADD TO CART ───────────────────────────────────────────────────────────
  const addToCart = async (product, qty = 1, size = "", color = "") => {
    const price = product.discountPrice || product.price;

    // Optimistic update
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
      return [...prev, { product, qty, size, color, price }];
    });

    // Sync to DB if logged in
    if (isLoggedIn()) {
      try {
        const res = await api.post("/cart/add", {
          productId: product._id,
          qty,
          size,
          color,
          price,
        });
        if (res.data.success) setItems(res.data.items);
      } catch {
        // Keep optimistic state — will re-sync on next login
      }
    }
  };

  // ── REMOVE FROM CART ──────────────────────────────────────────────────────
  const removeFromCart = async (productId, size, color) => {
    // Optimistic update
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

    if (isLoggedIn()) {
      try {
        const res = await api.delete("/cart/remove", {
          data: { productId, size, color },
        });
        if (res.data.success) setItems(res.data.items);
      } catch {}
    }
  };

  // ── UPDATE QTY ────────────────────────────────────────────────────────────
  const updateQty = async (productId, size, color, qty) => {
    if (qty < 1) return removeFromCart(productId, size, color);

    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.product._id === productId && i.size === size && i.color === color
          ? { ...i, qty }
          : i,
      ),
    );

    if (isLoggedIn()) {
      try {
        const res = await api.put("/cart/update", {
          productId,
          size,
          color,
          qty,
        });
        if (res.data.success) setItems(res.data.items);
      } catch {}
    }
  };

  // ── CLEAR CART ────────────────────────────────────────────────────────────
  const clearCart = async () => {
    setItems([]);
    localStorage.removeItem("cm_cart");

    if (isLoggedIn()) {
      try {
        await api.delete("/cart/clear");
      } catch {}
    }
  };

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const cartSubtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartSubtotal,
        syncing,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        syncAfterLogin,
        clearCartOnLogout,
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
