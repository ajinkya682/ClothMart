import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { User, Lock, MapPin, Camera, LoaderCircle, CheckCircle2, AlertCircle, Trash2, Edit3, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { key: "profile", label: "My Profile", icon: User },
  { key: "password", label: "Password", icon: Lock },
  { key: "addresses", label: "Addresses", icon: MapPin },
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 animate-fade-in min-h-screen">
      
      <div className="flex flex-col md:flex-row gap-6 lg:gap-12 items-start">
        
        {/* Sidebar */}
        <div className="w-full md:w-72 lg:w-80 shrink-0 space-y-6">
           <div className="bg-white border border-gray-100 rounded-[2rem] p-6 lg:p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-gray-900 to-gray-800" />
             <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden relative z-10 shadow-md">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black font-heading text-3xl text-gray-400 bg-white">
                    {user.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                )}
             </div>
             <div className="mt-4 relative z-10">
               <h1 className="text-xl font-black font-heading text-gray-900">{user.name}</h1>
               <p className="text-sm text-gray-500 font-medium">{user.email}</p>
               <span className="inline-block mt-3 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-widest rounded-lg">
                 {user.role === "store_owner" ? "🏪 Store Owner" : "🛍️ Customer"}
               </span>
             </div>
           </div>

           <div className="bg-white border border-gray-100 rounded-[2rem] p-3 shadow-sm flex flex-row md:flex-col overflow-x-auto no-scrollbar gap-1">
             {TABS.map(t => (
               <button
                 key={t.key}
                 onClick={() => setActiveTab(t.key)}
                 className={`flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap md:whitespace-normal text-left ${activeTab === t.key ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
               >
                 <t.icon size={18} className={activeTab === t.key ? 'text-white' : 'text-gray-400'} /> {t.label}
               </button>
             ))}
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white border border-gray-100 rounded-[2rem] p-6 lg:p-10 shadow-sm relative min-h-[400px]">
           <AnimatePresence mode="wait">
             <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {activeTab === "profile" && <ProfileTab user={user} updateUser={updateUser} />}
                {activeTab === "password" && <PasswordTab />}
                {activeTab === "addresses" && <AddressesTab user={user} updateUser={updateUser} />}
             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

function ProfileTab({ user, updateUser }) {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [profileImg, setProfileImg] = useState(null);
  const [preview, setPreview] = useState(user.profileImage || null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const imgRef = useRef();

  const handleImgChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImg(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true); setError(""); setSuccess(false);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("phone", phone.trim());
      if (profileImg) fd.append("profileImage", profileImg);

      const res = await api.put("/auth/me", fd, { headers: { "Content-Type": "multipart/form-data" } });
      updateUser(res.data.user);
      setSuccess(true); setProfileImg(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-black font-heading text-gray-900 mb-8">Personal Information</h2>

      <div className="flex items-center gap-6 mb-10">
         <div className="relative group cursor-pointer" onClick={() => imgRef.current.click()}>
           <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 group-hover:border-black transition-colors shadow-sm">
             {preview ? <img src={preview} alt="avatar" className="w-full h-full object-cover" /> : 
                <span className="w-full h-full flex items-center justify-center font-black font-heading text-3xl text-gray-400 bg-white">
                  {user.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </span>
             }
           </div>
           <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
           </div>
         </div>
         <div>
            <p className="font-bold text-gray-900 mb-1">Profile Photo</p>
            <p className="text-xs text-gray-500 font-medium">Click on the image to upload a new one.<br/>JPG or PNG, max 5MB.</p>
         </div>
         <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImgChange} />
      </div>

      <div className="space-y-5">
         <div>
           <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
           <input className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
         </div>
         <div>
           <label className="flex justify-between text-sm font-bold text-gray-900 mb-2">Email Address <span className="text-gray-400 font-normal">Read-only</span></label>
           <input className="w-full px-4 py-3 bg-gray-50 text-gray-500 border border-gray-200 rounded-xl text-sm outline-none shadow-sm cursor-not-allowed" value={user.email} disabled />
         </div>
         <div>
           <label className="flex justify-between text-sm font-bold text-gray-900 mb-2">Phone Number <span className="text-gray-400 font-normal">Optional</span></label>
           <input className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 9876543210" type="tel" />
         </div>
      </div>

      {error && <p className="mt-6 text-sm font-bold text-red-600 flex items-center gap-1"><AlertCircle size={14}/> {error}</p>}
      {success && <p className="mt-6 text-sm font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={14}/> Profile updated successfully!</p>}

      <button onClick={handleSave} disabled={loading} className="mt-8 px-8 py-3.5 bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:shadow-black/20 transition-all flex items-center gap-2">
         {loading ? <LoaderCircle size={18} className="animate-spin" /> : <Edit3 size={18} />} {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

function PasswordTab() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChange = async () => {
    setError("");
    if (!oldPassword || !newPassword || !confirmPassword) { setError("All fields are required"); return; }
    if (newPassword.length < 6) { setError("New password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    
    setLoading(true);
    try {
      await api.put("/auth/password", { oldPassword, newPassword });
      setSuccess(true); setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-black font-heading text-gray-900 mb-2">Change Password</h2>
      <p className="text-sm text-gray-500 font-medium mb-8">Secure your account with a strong password of at least 6 characters.</p>

      <div className="space-y-5">
        {[
          { label: "Current Password", val: oldPassword, set: setOldPassword, show: showOld, toggle: () => setShowOld(!showOld) },
          { label: "New Password", val: newPassword, set: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew) },
          { label: "Confirm New Password", val: confirmPassword, set: setConfirmPassword, show: showNew, toggle: null },
        ].map((f, i) => (
          <div key={i}>
             <label className="block text-sm font-bold text-gray-900 mb-2">{f.label}</label>
             <div className="relative">
                <input 
                  type={f.show ? "text" : "password"} 
                  value={f.val} onChange={(e) => f.set(e.target.value)} 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] pr-12" 
                  placeholder="••••••" 
                />
                {f.toggle && (
                  <button onClick={f.toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                     {f.show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
             </div>
          </div>
        ))}
      </div>

      {error && <p className="mt-6 text-sm font-bold text-red-600 flex items-center gap-1"><AlertCircle size={14}/> {error}</p>}
      {success && <p className="mt-6 text-sm font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={14}/> Password updated successfully!</p>}

      <button onClick={handleChange} disabled={loading} className="mt-8 px-8 py-3.5 bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:shadow-black/20 transition-all flex items-center gap-2">
         {loading && <LoaderCircle size={18} className="animate-spin" />} {loading ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
}

function AddressesTab({ user, updateUser }) {
  const [addresses, setAddresses] = useState(user.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ street: "", city: "", state: "", pincode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleAdd = async () => {
    const { street, city, state, pincode } = form;
    if (!street || !city || !state || !pincode) { setError("All address fields are required"); return; }
    if (!/^\d{6}$/.test(pincode)) { setError("Enter a valid 6-digit pincode"); return; }
    
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/address", form);
      setAddresses(res.data.addresses); updateUser({ ...user, addresses: res.data.addresses });
      setForm({ street: "", city: "", state: "", pincode: "" }); setShowForm(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await api.delete(`/auth/address/${id}`);
      setAddresses(res.data.addresses); updateUser({ ...user, addresses: res.data.addresses });
    } catch {} finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
           <h2 className="text-2xl font-black font-heading text-gray-900">Delivery Addresses</h2>
           <p className="text-sm text-gray-500 font-medium mt-1">{addresses.length} saved address{addresses.length !== 1 ? "es" : ""}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${showForm ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-black text-white hover:-translate-y-0.5'}`}>
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
             <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div className="sm:col-span-2">
                 <input className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" placeholder="Street Address (e.g. 123 MG Road, Flat 401)" value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
               </div>
               <div><input className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
               <div><input className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} /></div>
               <div className="sm:col-span-2"><input className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" placeholder="Pincode (e.g. 400001)" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} /></div>
               
               {error && <div className="sm:col-span-2 text-sm font-bold text-red-600 flex items-center gap-1"><AlertCircle size={14}/> {error}</div>}
               
               <div className="sm:col-span-2">
                  <button onClick={handleAdd} disabled={loading} className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-all flex items-center gap-2">
                     {loading && <LoaderCircle size={16} className="animate-spin" />} Save Address
                  </button>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length === 0 ? (
         <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50 flex flex-col items-center">
            <MapPin size={40} className="text-gray-300 mb-3" />
            <p className="font-bold text-gray-900 mb-1">No addresses saved yet</p>
            <p className="text-sm text-gray-500 font-medium">Add one right now to speed up checkout later.</p>
         </div>
      ) : (
         <div className="space-y-4">
            {addresses.map((addr) => (
               <div key={addr._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-gray-300 transition-colors">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                       <MapPin size={18} className="text-gray-400" />
                     </div>
                     <div>
                        <p className="font-bold text-gray-900 mb-1">{addr.street}</p>
                        <p className="text-sm text-gray-500 font-medium">{addr.city}, {addr.state} <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded ml-1 text-gray-600">{addr.pincode}</span></p>
                     </div>
                  </div>
                  <button onClick={() => handleDelete(addr._id)} disabled={deletingId === addr._id} className="p-2 sm:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 shrink-0 self-end sm:self-auto">
                     {deletingId === addr._id ? <LoaderCircle size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
               </div>
            ))}
         </div>
      )}
    </div>
  );
}
