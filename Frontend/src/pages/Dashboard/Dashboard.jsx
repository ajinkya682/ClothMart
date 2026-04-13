import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { LayoutDashboard, ShoppingBag, Tags, PackageSearch, Store, LogOut, Menu, X, ChevronRight } from "lucide-react";

import OverviewTab from "./tabs/OverviewTab";
import ProductsTab from "./tabs/ProductsTab";
import OrdersTab from "./tabs/OrdersTab";
import CouponsTab from "./tabs/CouponsTab";
import StoreTab from "./tabs/StoreTab";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "orders", label: "Orders", icon: PackageSearch },
  { id: "coupons", label: "Coupons", icon: Tags },
  { id: "store", label: "Store Settings", icon: Store },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user?.role !== "store_owner") {
      navigate("/");
      return;
    }

    const fetchStore = async () => {
      try {
        const res = await api.get("/stores/my");
        setStore(res.data.store);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="w-12 h-12 bg-gray-200 rounded-full" />
           <p className="text-gray-400 font-medium">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-8 text-center animate-fade-in border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-gray-900 mb-2">No Store Found</h2>
          <p className="text-gray-500 mb-8">You need to set up your store details to access the dashboard.</p>
          <Link to="/register" className="inline-flex items-center justify-center w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
            Setup Store Now
          </Link>
          <button onClick={handleLogout} className="mt-4 text-sm font-semibold text-gray-400 hover:text-black transition-colors">
            Log out instead
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab store={store} />;
      case "products": return <ProductsTab store={store} />;
      case "orders": return <OrdersTab store={store} />;
      case "coupons": return <CouponsTab store={store} />;
      case "store": return <StoreTab store={store} setStore={setStore} />;
      default: return <OverviewTab store={store} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-heading font-black text-sm tracking-tighter">CM</div>
           <span className="font-bold text-gray-900 font-heading truncate max-w-[150px]">{store.name}</span>
         </div>
         <button onClick={() => setSidebarOpen(true)} className="p-2 -mr-2 text-gray-500 hover:text-black">
           <Menu size={24} />
         </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-6 md:p-8 flex items-center justify-between">
           <Link to="/" className="flex items-center gap-3 group">
             <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-heading font-black text-xl tracking-tighter group-hover:scale-105 transition-transform">CM</div>
             <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Seller</p>
               <h1 className="font-bold text-gray-900 font-heading">Dashboard</h1>
             </div>
           </Link>
           <button className="md:hidden p-2 text-gray-400 hover:text-black" onClick={closeSidebar}>
             <X size={20} />
           </button>
        </div>

        <div className="px-6 pb-6">
          <div className="p-4 rounded-2xl bg-gray-50 flex items-center gap-4 border border-gray-100">
             <img src={store.logo || "/placeholder.jpg"} alt="logo" className="w-12 h-12 rounded-xl object-cover bg-white" />
             <div className="min-w-0">
               <p className="font-bold text-gray-900 truncate">{store.name}</p>
               <p className="text-xs text-green-600 font-bold tracking-wide uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {store.isVerified ? 'Verified' : 'Pending'}
               </p>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); closeSidebar(); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                  {tab.label}
                </div>
                {isActive && <ChevronRight size={16} className="opacity-50" />}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10 pb-24">
          <div className="max-w-6xl mx-auto">
             {renderContent()}
          </div>
        </div>
      </main>
      
    </div>
  );
}
