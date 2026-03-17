import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, ownerOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090B",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid #1A1A1E",
            borderTopColor: "#FFCF40",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (ownerOnly && user.role !== "store_owner") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
