import { useState } from "react";
import api from "../../../../utils/api";
import toast from "react-hot-toast";
import { LoaderCircle, ImagePlus, CheckCircle2 } from "lucide-react";

export default function StoreTab({ store, setStore }) {
  const [form, setForm] = useState({
    name: store.name || "",
    description: store.description || "",
    phone: store.phone || "",
    gst: store.gst || "",
    street: store.address?.street || "",
    city: store.address?.city || "",
    state: store.address?.state || "",
    pincode: store.address?.pincode || "",
  });
  
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logo) fd.append("logo", logo);
      if (banner) fd.append("banner", banner);

      const res = await api.put(`/stores/${store._id}`, fd);
      setStore(res.data.store);
      toast.success("Store updated successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update store");
    } finally {
      setLoading(false);
    }
  };

  const previewLogo = logo ? URL.createObjectURL(logo) : store.logo;
  const previewBanner = banner ? URL.createObjectURL(banner) : store.banner;

  return (
    <div className="max-w-4xl animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-heading text-gray-900 tracking-tight">Store Settings</h2>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${loading ? 'opacity-70 cursor-wait' : ''}`}
        >
          {loading ? <LoaderCircle className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Basic Details</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Store Name *</label>
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Phone</label>
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">GST Number</label>
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                value={form.gst}
                onChange={(e) => setForm({ ...form, gst: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Store Description</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Branding</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Store Logo(1:1)</label>
              <label className="relative block w-32 h-32 rounded-full border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-black transition-colors group">
                {previewLogo ? (
                  <img src={previewLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                    <ImagePlus className="text-gray-400" size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Change</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0])} />
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Store Banner (3:1)</label>
              <label className="relative block w-full h-32 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-black transition-colors group">
                {previewBanner ? (
                  <img src={previewBanner} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                    <ImagePlus className="text-gray-400" size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Change Banner</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setBanner(e.target.files?.[0])} />
              </label>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input placeholder="Street Address" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all" value={form.street} onChange={(e) => setForm({...form, street: e.target.value})} />
                </div>
                <div>
                  <input placeholder="City" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} />
                </div>
                 <div>
                  <input placeholder="Pincode" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all" value={form.pincode} onChange={(e) => setForm({...form, pincode: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <input placeholder="State" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
