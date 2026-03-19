// src/components/CartSyncBridge/CartSyncBridge.jsx
//
// This tiny component sits inside both AuthProvider and CartProvider.
// It registers CartContext's sync functions into AuthContext so that
// login/logout automatically syncs the cart — without circular imports.

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function CartSyncBridge() {
  const { registerCartSync } = useAuth();
  const { syncAfterLogin, clearCartOnLogout } = useCart();

  useEffect(() => {
    registerCartSync(syncAfterLogin, clearCartOnLogout);
  }, [registerCartSync, syncAfterLogin, clearCartOnLogout]);

  return null; // renders nothing
}
