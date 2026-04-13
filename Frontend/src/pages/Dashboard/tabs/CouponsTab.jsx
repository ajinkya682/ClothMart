import { useState, useEffect } from "react";
import api from "../../../../utils/api";
import toast from "react-hot-toast";
import { Plus, Tag, Trash2, CalendarDays, LoaderCircle } from "lucide-react";

export default function CouponsTab() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minOrderAmount: "",
    expiresAt: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/coupons");
      setCoupons(res.data.coupons || []);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.code || !form.discountValue) {
      toast.error("Code and discount value are required");
      return;
    }
    setFormLoading(true);
    try {
      await api.post("/coupons", {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        expiresAt: form.expiresAt || null,
      });
      setForm({
        code: "", discountType: "percent", discountValue: "", minOrderAmount: "", expiresAt: "",
      });
      setShowForm(false);
      fetchCoupons();
      toast.success("Coupon created successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create coupon");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      toast.success("Coupon deleted");
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading text-gray-900 tracking-tight">Coupons</h2>
          <p className="text-sm text-gray-500 mt-1">{coupons.length} active coupons</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            showForm ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-black text-white hover:-translate-y-0.5 hover:shadow-lg'
          }`}
        >
          {showForm ? "Cancel" : <><Plus size={18} /> New Coupon</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm animate-fade-in">
          <h3 className="text-lg font-bold mb-6 text-gray-900">Create New Coupon</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Coupon Code *</label>
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none font-mono uppercase"
                placeholder="PROMO20"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              />
            </div>
            
             <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Type *</label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
              >
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Value {form.discountType === "percent" ? "(%)" : "(₹)"} *
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                placeholder={form.discountType === "percent" ? "20" : "500"}
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Min Order (₹)</label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                placeholder="1000"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Expiry Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleCreate}
              disabled={formLoading}
              className={`flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors ${formLoading ? 'opacity-70' : ''}`}
            >
              {formLoading ? <LoaderCircle size={18} className="animate-spin" /> : <Tag size={18} />}
              Save Coupon
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50">
          <Tag size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No coupons created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => {
            const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
            return (
              <div key={coupon._id} className={`p-6 rounded-2xl border ${isExpired ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200 hover:border-black hover:shadow-md'} transition-all relative overflow-hidden group`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 bg-black text-white rounded-lg font-mono font-bold text-sm tracking-widest inline-block">
                    {coupon.code}
                  </div>
                   <button onClick={() => handleDelete(coupon._id)} className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <p className="text-2xl font-black text-gray-900 mb-2">
                  {coupon.discountType === "percent" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                </p>
                <div className="space-y-1">
                  {coupon.minOrderAmount > 0 && (
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Min Purchase: ₹{coupon.minOrderAmount}
                    </p>
                  )}
                  {coupon.expiresAt && (
                     <p className={`text-sm flex items-center gap-2 ${isExpired ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                      <CalendarDays size={14} /> 
                      {isExpired ? "Expired" : `Valid till ${new Date(coupon.expiresAt).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
