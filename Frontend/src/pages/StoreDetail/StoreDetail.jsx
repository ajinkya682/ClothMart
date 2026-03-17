import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import StoreHeader from "./StoreHeader";
import StoreProducts from "./StoreProducts";

const StoreDetail = () => {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        console.log("Fetching store for slug:", slug); // DEBUG
        const { data } = await api.get(`/stores/${slug}`);

        // 🔧 API returns { success: true, store: {...} }
        console.log("API Response:", data); // DEBUG
        setStore(data.store || data); // Handle both {store} and direct store
        setError("");
      } catch (err) {
        console.error("Store fetch error:", err.response?.data || err.message);
        setError("Store not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchStore();
  }, [slug]);

  if (loading)
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <div
          className="shimmer"
          style={{
            height: "300px",
            margin: "0 auto 2rem",
            width: "100%",
            maxWidth: "1200px",
            borderRadius: "24px",
          }}
        />
        Loading store...
      </div>
    );

  if (error)
    return (
      <div
        style={{ padding: "4rem 2rem", textAlign: "center", color: "#dc2626" }}
      >
        ❌ {error}
        <br />
        <small>Try: /stores/velvet-noir</small>
      </div>
    );

  return (
    <>
      {store ? <StoreHeader store={store} /> : "No store data"}
      {store && <StoreProducts storeId={store._id} />}
    </>
  );
};

export default StoreDetail;
