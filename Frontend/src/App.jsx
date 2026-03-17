import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home/Home"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Stores = lazy(() => import("./pages/Stores/Stores"));
const Products = lazy(() => import("./pages/Products/Products"));
const Register = lazy(() => import("./pages/Register/Register"));
const Login = lazy(() => import("./pages/Login/Login"));
const StoreDetail = lazy(() => import("./pages/StoreDetail/StoreDetail"));

const PageLoader = () => (
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

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/products" element={<Products />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/stores/:slug" element={<StoreDetail />} />
          </Routes>
        </Suspense>
        <Footer />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
