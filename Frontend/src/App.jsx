import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import CartSyncBridge from "./components/CartSyncBridge/CartSyncBridge";
import { Toaster } from "react-hot-toast";

import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home/Home"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Stores = lazy(() => import("./pages/Stores/Stores"));
const Products = lazy(() => import("./pages/Products/Products"));
const Register = lazy(() => import("./pages/Register/Register"));
const Login = lazy(() => import("./pages/Login/Login"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const StoreDetail = lazy(() => import("./pages/StoreDetail/StoreDetail"));
const ProductDetail = lazy(() => import("./pages/ProductDetail/ProductDetail"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const Orders = lazy(() => import("./pages/Orders/Orders"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const TrackOrder = lazy(() => import("./pages/TrackOrder/TrackOrder"));
const Wishlist = lazy(() => import("./pages/Wishlist/Wishlist"));

const PageLoader = () => (
  <div className="flex w-full h-[60vh] items-center justify-center">
    <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 bg-black rounded-md animate-bounce flex items-center justify-center text-white font-bold font-heading">
        CM
      </div>
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CartSyncBridge />
          <ScrollToTop />
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 3000,
              style: {
                background: '#111',
                color: '#fff',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif'
              },
            }} 
          />
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/products" element={<Products />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/stores/:slug" element={<StoreDetail />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={<Wishlist />}
                />
                <Route
                  path="/track-order"
                  element={
                    <ProtectedRoute>
                      <TrackOrder />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </MainLayout>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
