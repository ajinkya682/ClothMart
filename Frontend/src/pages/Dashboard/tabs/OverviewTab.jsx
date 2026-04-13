import { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { ShoppingBag, IndianRupee, PackageCheck, Banknote, AlertTriangle } from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, highlight }) {
  return (
    <div className={`p-6 rounded-[2rem] border ${highlight ? 'bg-black text-white border-black shadow-xl ring-4 ring-gray-100' : 'bg-white border-gray-100 shadow-sm'} transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-bold ${highlight ? 'text-gray-300' : 'text-gray-500'}`}>{label}</h3>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${highlight ? 'bg-white/20 text-white' : 'bg-gray-50 text-black'}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-3xl font-black font-heading tracking-tight mb-1">{value}</p>
      {sub && <p className={`text-xs ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>{sub}</p>}
    </div>
  );
}

export default function OverviewTab({ store }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/analytics/summary");
        setAnalytics(res.data.summary);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-gray-100 rounded-[2rem] animate-pulse"></div>)}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-heading text-gray-900 tracking-tight">Store Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingBag}
          label="Today's Orders"
          value={analytics?.todayOrders ?? 0}
          sub="New orders today"
          highlight
        />
        <StatCard
          icon={IndianRupee}
          label="Today's Revenue"
          value={`₹${(analytics?.todayRevenue ?? 0).toLocaleString("en-IN")}`}
          sub="Earned today"
        />
        <StatCard
          icon={PackageCheck}
          label="Total Orders"
          value={analytics?.totalOrders ?? 0}
          sub="All time"
        />
        <StatCard
          icon={Banknote}
          label="Total Revenue"
          value={`₹${(analytics?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
          sub="All time"
        />
      </div>

      {analytics?.lowStockProducts?.length > 0 && (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-[2rem] flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-amber-800 font-bold mb-1">Low Stock Warning</h3>
            <p className="text-amber-700 text-sm">
              {analytics.lowStockProducts.map((p) => p.name).join(", ")} — restock soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
