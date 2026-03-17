import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("cm_user");
    const token = localStorage.getItem("cm_token");
    if (saved && token) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const { token, user: u } = res.data;
    localStorage.setItem("cm_token", token);
    localStorage.setItem("cm_user", JSON.stringify(u));
    setUser(u);
    return res.data;
  };

  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user: u } = res.data;
    localStorage.setItem("cm_token", token);
    localStorage.setItem("cm_user", JSON.stringify(u));
    setUser(u);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("cm_token");
    localStorage.removeItem("cm_user");
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("cm_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isStoreOwner: user?.role === "store_owner",
        isCustomer: user?.role === "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ THIS IS THE MISSING EXPORT
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
