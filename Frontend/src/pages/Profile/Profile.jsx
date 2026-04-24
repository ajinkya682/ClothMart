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
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-5 py-8 lg:py-16 animate-fade-in">
        
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Sidebar */}
          <div className="w-full md:w-72 lg:w-80 shrink-0 space-y-6">
             <div className="bg-surface border border-gray-50 rounded-2xl p-6 lg:p-10 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-28 bg-primary" />
               <div className="w-24 h-24 rounded-full border-4 border-surface bg-surface-low overflow-hidden relative z-10 shadow-sm">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-heading text-3xl text-primary bg-surface">
                      {user.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                  )}
               </div>
               <div className="mt-5 relative z-10">
                 <h1 className="text-2xl font-heading text-primary">{user.name}</h1>
                 <p className="text-[13px] text-gray-400 mt-1">{user.email}</p>
                 <span className="inline-block mt-4 px-4 py-1.5 bg-surface-low text-primary text-[10px] font-semibold uppercase tracking-widest rounded-full">
                   {user.role === "store_owner" ? "Store Owner" : "Customer"}
                 </span>
               </div>
             </div>

             <div className="bg-surface border border-gray-50 rounded-2xl p-4 shadow-sm flex flex-row md:flex-col overflow-x-auto hide-scrollbar gap-2">
               {TABS.map(t => (
                 <button
                   key={t.key}
                   onClick={() => setActiveTab(t.key)}
                   className={`flex items-center gap-4 px-5 py-4 rounded-xl text-[13px] font-semibold tracking-wide uppercase transition-all whitespace-nowrap md:whitespace-normal text-left ${activeTab === t.key ? 'bg-primary text-surface shadow-float' : 'text-gray-400 hover:bg-surface-low hover:text-primary'}`}
                 >
                   <t.icon size={18} strokeWidth={1.5} className={activeTab === t.key ? 'text-surface' : 'text-gray-400'} /> {t.label}
                 </button>
               ))}
             </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 w-full bg-surface border border-gray-50 rounded-2xl p-6 lg:p-12 shadow-sm relative min-h-[500px]">
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
      <h2 className="text-3xl font-heading text-primary mb-10">Personal Information</h2>

      <div className="flex items-center gap-8 mb-12">
         <div className="relative group cursor-pointer" onClick={() => imgRef.current.click()}>
           <div className="w-24 h-24 rounded-full bg-surface-low overflow-hidden border border-gray-100 group-hover:border-primary transition-colors shadow-sm">
             {preview ? <img src={preview} alt="avatar" className="w-full h-full object-cover" /> : 
                <span className="w-full h-full flex items-center justify-center font-heading text-3xl text-gray-300 bg-surface">
                  {user.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </span>
             }
           </div>
           <div className="absolute inset-0 bg-primary/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} strokeWidth={1.5} className="text-surface" />
           </div>
         </div>
         <div>
            <p className="font-semibold text-[13px] tracking-wide uppercase text-primary mb-1.5">Profile Photo</p>
            <p className="text-[13px] text-gray-400 leading-relaxed">Click on the image to upload a new one.<br/>JPG or PNG, max 5MB.</p>
         </div>
         <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImgChange} />
      </div>

      <div className="space-y-6">
         <div>
           <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
           <input className="w-full px-5 py-4 bg-surface border border-gray-100 rounded-xl text-[14px] focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
         </div>
         <div>
           <label className="flex justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Email Address <span className="font-medium text-gray-300 normal-case tracking-normal">Read-only</span></label>
           <input className="w-full px-5 py-4 bg-surface-low text-gray-500 border border-gray-50 rounded-xl text-[14px] outline-none cursor-not-allowed" value={user.email} disabled />
         </div>
         <div>
           <label className="flex justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Phone Number <span className="font-medium text-gray-300 normal-case tracking-normal">Optional</span></label>
           <input className="w-full px-5 py-4 bg-surface border border-gray-100 rounded-xl text-[14px] focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 9876543210" type="tel" />
         </div>
      </div>

      {error && <p className="mt-8 text-[13px] font-medium text-red-500 flex items-center gap-1.5"><AlertCircle size={14} strokeWidth={1.5}/> {error}</p>}
      {success && <p className="mt-8 text-[13px] font-medium text-green-600 flex items-center gap-1.5"><CheckCircle2 size={14} strokeWidth={1.5}/> Profile updated successfully!</p>}

      <button onClick={handleSave} disabled={loading} className="mt-10 px-8 py-3.5 bg-primary text-surface rounded-full text-[13px] font-semibold tracking-wide uppercase shadow-float hover:bg-black/90 transition-all flex items-center gap-2 active:scale-[0.98]">
         {loading ? <LoaderCircle size={18} className="animate-spin" /> : <Edit3 size={18} strokeWidth={1.5} />} {loading ? "Saving..." : "Save Changes"}
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
      <h2 className="text-3xl font-heading text-primary mb-3">Change Password</h2>
      <p className="text-[14px] text-gray-400 mb-10 leading-relaxed">Secure your account with a strong password of at least 6 characters.</p>

      <div className="space-y-6">
        {[
          { label: "Current Password", val: oldPassword, set: setOldPassword, show: showOld, toggle: () => setShowOld(!showOld) },
          { label: "New Password", val: newPassword, set: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew) },
          { label: "Confirm New Password", val: confirmPassword, set: setConfirmPassword, show: showNew, toggle: null },
        ].map((f, i) => (
          <div key={i}>
             <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">{f.label}</label>
             <div className="relative">
                <input 
                  type={f.show ? "text" : "password"} 
                  value={f.val} onChange={(e) => f.set(e.target.value)} 
                  className="w-full px-5 py-4 bg-surface border border-gray-100 rounded-xl text-[14px] focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300 pr-14" 
                  placeholder="••••••" 
                />
                {f.toggle && (
                  <button onClick={f.toggle} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                     {f.show ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                  </button>
                )}
             </div>
          </div>
        ))}
      </div>

      {error && <p className="mt-8 text-[13px] font-medium text-red-500 flex items-center gap-1.5"><AlertCircle size={14} strokeWidth={1.5}/> {error}</p>}
      {success && <p className="mt-8 text-[13px] font-medium text-green-600 flex items-center gap-1.5"><CheckCircle2 size={14} strokeWidth={1.5}/> Password updated successfully!</p>}

      <button onClick={handleChange} disabled={loading} className="mt-10 px-8 py-3.5 bg-primary text-surface rounded-full text-[13px] font-semibold tracking-wide uppercase shadow-float hover:bg-black/90 transition-all flex items-center gap-2 active:scale-[0.98]">
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
           <h2 className="text-3xl font-heading text-primary">Delivery Addresses</h2>
           <p className="text-[14px] text-gray-400 mt-2">{addresses.length} saved address{addresses.length !== 1 ? "es" : ""}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`px-6 py-3 rounded-full text-[12px] font-semibold tracking-wide uppercase transition-all border ${showForm ? 'bg-surface-low border-gray-50 text-gray-500 hover:text-primary' : 'bg-primary text-surface border-primary shadow-float hover:bg-black/90'}`}>
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-10">
             <div className="bg-surface-low border border-gray-50 p-6 sm:p-8 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div className="sm:col-span-2">
                 <input className="w-full px-5 py-4 bg-surface border border-gray-100 rounded-xl text-[14px] focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300" placeholder="Street Address (e.g. 123 MG Road, Flat 401)" value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
               </div>
               <div><input className="w-full px-5 py-4 bg-surface border border-gray-100 rounded-xl text-[14px] focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
               <div><input className="w-full px-5 py-4 bg-surface border border-gray-100 rounded-xl text-[14px] focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300" placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} /></div>
               <div className="sm:col-span-2"><input className="w-full px-5 py-4 bg-surface border border-gray-100 rounded-xl text-[14px] focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300" placeholder="Pincode (e.g. 400001)" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} /></div>
               
               {error && <div className="sm:col-span-2 text-[13px] font-medium text-red-500 flex items-center gap-1.5 mt-2"><AlertCircle size={14} strokeWidth={1.5}/> {error}</div>}
               
               <div className="sm:col-span-2 mt-4">
                  <button onClick={handleAdd} disabled={loading} className="px-8 py-3.5 bg-primary text-surface rounded-full text-[13px] font-semibold tracking-wide uppercase shadow-float hover:bg-black/90 transition-all flex items-center gap-2">
                     {loading && <LoaderCircle size={16} className="animate-spin" />} Save Address
                  </button>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length === 0 ? (
         <div className="text-center py-16 border border-dashed border-gray-100 rounded-2xl bg-surface-low flex flex-col items-center">
            <MapPin size={40} strokeWidth={1} className="text-gray-300 mb-4" />
            <p className="font-heading text-xl text-primary mb-2">No addresses saved yet</p>
            <p className="text-[14px] text-gray-500 leading-relaxed">Add one right now to speed up checkout later.</p>
         </div>
      ) : (
         <div className="space-y-4">
            {addresses.map((addr) => (
               <div key={addr._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 bg-surface border border-gray-50 rounded-2xl shadow-sm hover:border-gray-200 transition-colors">
                  <div className="flex items-start gap-5">
                     <div className="w-12 h-12 rounded-full bg-surface-low flex items-center justify-center shrink-0 border border-gray-50">
                       <MapPin size={18} strokeWidth={1.5} className="text-gray-400" />
                     </div>
                     <div>
                        <p className="font-medium text-[15px] text-primary mb-1.5">{addr.street}</p>
                        <p className="text-[13px] text-gray-500">{addr.city}, {addr.state} <span className="font-medium text-gray-400 tracking-widest uppercase ml-1">{addr.pincode}</span></p>
                     </div>
                  </div>
                  <button onClick={() => handleDelete(addr._id)} disabled={deletingId === addr._id} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-50 shrink-0 self-end sm:self-auto border border-transparent hover:border-red-100">
                     {deletingId === addr._id ? <LoaderCircle size={18} className="animate-spin" /> : <Trash2 size={18} strokeWidth={1.5} />}
                  </button>
               </div>
            ))}
         </div>
      )}
    </div>
  );
}
