import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { Eye, EyeOff, CheckCircle2, ChevronRight, ChevronLeft, User, Store, LoaderCircle, AlertCircle, Upload, Check } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const STORE_CATEGORIES = [
  { label: "Saree & Silk", value: "saree" },
  { label: "Men's Fashion", value: "mens" },
  { label: "Women's Western", value: "western" },
  { label: "Kids' Wear", value: "kids" },
  { label: "Ethnic & Traditional", value: "ethnic" },
  { label: "Activewear", value: "other" },
  { label: "Winterwear", value: "other" },
  { label: "Streetwear", value: "other" },
  { label: "Bridal & Occasion", value: "other" },
  { label: "Accessories", value: "other" },
];

const STEPS_CUSTOMER = ["Account", "Profile", "Done"];
const STEPS_STORE_OWNER = ["Account", "Store Info", "Media & Address", "Done"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function validate(fields, data) {
  const errs = {};
  fields.forEach((f) => {
    const v = (data[f.name] || "").trim();
    if (f.required && !v && f.type !== "file")
      errs[f.name] = `${f.label} is required`;
    else if (f.name === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      errs[f.name] = "Enter a valid email address";
    else if (f.name === "password" && v && v.length < 6)
      errs[f.name] = "Password must be at least 6 characters";
    else if (f.name === "confirmPassword" && v !== data.password)
      errs[f.name] = "Passwords do not match";
    else if (f.name === "phone" && v && !/^[6-9]\d{9}$/.test(v))
      errs[f.name] = "Enter a valid 10-digit Indian mobile number";
    else if (f.name === "storePhone" && v && !/^[6-9]\d{9}$/.test(v))
      errs[f.name] = "Enter a valid 10-digit Indian mobile number";
    else if (f.name === "pincode" && v && !/^\d{6}$/.test(v))
      errs[f.name] = "Enter a valid 6-digit pincode";
    else if (
      f.name === "gst" &&
      v &&
      !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(v)
    )
      errs[f.name] = "Enter a valid GST number";
  });
  return errs;
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-500", "bg-amber-500", "bg-green-500", "bg-green-600"];
  const textColors = ["", "text-red-500", "text-amber-500", "text-green-500", "text-green-600"];
  
  return (
    <div className="mt-2 flex items-center justify-between">
      <div className="flex gap-1 flex-1 mr-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= score ? colors[score] : 'bg-gray-200'}`} />
        ))}
      </div>
      <span className={`text-xs font-medium ${textColors[score]}`}>{labels[score]}</span>
    </div>
  );
}

function ImageUpload({ label, name, value, onChange, hint, round = false }) {
  const ref = useRef();
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onChange(name, file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onChange(name, file);
  };
  const preview = value instanceof File ? URL.createObjectURL(value) : null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>
      <div
        className={`relative border-2 border-dashed ${preview ? 'border-black' : 'border-gray-200 hover:border-gray-400'} bg-gray-50 flex flex-col items-center justify-center p-6 cursor-pointer transition-colors ${round ? 'w-32 h-32 rounded-full mx-auto' : 'w-full h-32 rounded-2xl'}`}
        onClick={() => ref.current.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" className={`w-full h-full object-cover ${round ? 'rounded-full' : 'rounded-xl'}`} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full md:rounded-xl">
              <span className="text-white text-xs font-bold">Change</span>
            </div>
          </>
        ) : (
          <div className="text-center flex flex-col items-center">
            <Upload className="text-gray-400 mb-2" size={24} />
            <span className="text-xs text-gray-500 font-medium">Click or drag</span>
            {hint && <span className="text-[10px] text-gray-400 mt-1">{hint}</span>}
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

function FormField({ field, value, onChange, error, showPwd, togglePwd }) {
  if (field.type === "select") {
    return (
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm appearance-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${error ? 'border-red-300' : 'border-gray-200'}`}
            value={value || ""}
            onChange={(e) => onChange(field.name, e.target.value)}
          >
            <option value="" disabled>{field.placeholder}</option>
            {field.options.map((opt) => (
              <option key={opt.label ?? opt} value={opt.label ?? opt}>{opt.label ?? opt}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <ChevronRight className="text-gray-400 rotate-90" size={16} />
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none ${error ? 'border-red-300' : 'border-gray-200'}`}
          placeholder={field.placeholder}
          value={value || ""}
          rows={3}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  const isPassword = field.type === "password";
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {field.label} {field.required && <span className="text-red-500">*</span>}
        {!field.required && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
      </label>
      <div className="relative">
        <input
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all pr-12 ${error ? 'border-red-300 text-red-900' : 'border-gray-200 focus:bg-white text-gray-900'}`}
          type={isPassword ? (showPwd ? "text" : "password") : field.type}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          autoComplete={field.autoComplete}
        />
        {isPassword && (
          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={togglePwd} tabIndex={-1}>
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {field.name === "password" && <PasswordStrength password={value} />}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ─── Step field definitions ───────────────────────────────────────────────────
const STEP1_FIELDS = [
  { name: "fullName", label: "Full Name", type: "text", placeholder: "Ajinkya Saivar", required: true, autoComplete: "name" },
  { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com", required: true, autoComplete: "email" },
  { name: "password", label: "Password", type: "password", placeholder: "Min. 6 characters", required: true, autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat your password", required: true, autoComplete: "new-password" },
];
const STEP2_CUSTOMER_FIELDS = [
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "9876543210", required: false },
];
const STEP2_STORE_FIELDS = [
  { name: "storeName", label: "Store Name", type: "text", placeholder: "e.g. Velvet Noir", required: true },
  { name: "storeCategory", label: "Store Category", type: "select", placeholder: "Choose a category", required: true, options: STORE_CATEGORIES },
  { name: "storeDesc", label: "Store Description", type: "textarea", placeholder: "Tell customers what your store is about…", required: true },
  { name: "storePhone", label: "Store Contact Number", type: "tel", placeholder: "9876543210", required: false },
  { name: "gst", label: "GST Number", type: "text", placeholder: "22AAAAA0000A1Z5 (optional)", required: false },
];
const STEP3_STORE_ADDRESS_FIELDS = [
  { name: "street", label: "Street Address", type: "text", placeholder: "123, MG Road, Near Metro", required: true },
  { name: "city", label: "City", type: "text", placeholder: "Mumbai", required: true },
  { name: "state", label: "State", type: "text", placeholder: "Maharashtra", required: true },
  { name: "pincode", label: "Pincode", type: "text", placeholder: "400001", required: true },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("customer");
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  
  const [profileImg, setProfileImg] = useState(null);
  const [storeLogo, setStoreLogo] = useState(null);
  const [storeBanner, setStoreBanner] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const isStoreOwner = role === "store_owner";
  const totalSteps = isStoreOwner ? 3 : 2;
  const steps = isStoreOwner ? STEPS_STORE_OWNER : STEPS_CUSTOMER;
  const successStep = totalSteps + 1;
  const isSuccess = step === successStep;

  const set = (name, value) => {
    setData((d) => ({ ...d, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const setImg = (name, file) => {
    if (name === "profileImg") setProfileImg(file);
    if (name === "storeLogo") setStoreLogo(file);
    if (name === "storeBanner") setStoreBanner(file);
  };

  const next = () => {
    // Scroll top organically
    window.scrollTo({ top: 0, behavior: "smooth" });
    let fields = [];
    if (step === 1) fields = STEP1_FIELDS;
    if (step === 2 && isStoreOwner) fields = STEP2_STORE_FIELDS;
    if (step === 2 && !isStoreOwner) fields = STEP2_CUSTOMER_FIELDS;
    if (step === 3 && isStoreOwner) fields = STEP3_STORE_ADDRESS_FIELDS;

    const errs = validate(fields, data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const back = () => {
    setErrors({});
    setApiError("");
    setStep((s) => s - 1);
  };

  const resolveCategoryValue = (label) => {
    const match = STORE_CATEGORIES.find((c) => c.label === label);
    return match?.value ?? "other";
  };

  const handleSubmit = async () => {
    setLoading(true);
    setApiError("");

    try {
      const userFd = new FormData();
      userFd.append("name", data.fullName.trim());
      userFd.append("email", data.email.trim());
      userFd.append("password", data.password);
      userFd.append("role", role);
      userFd.append("phone", (isStoreOwner ? data.storePhone : data.phone) || "");
      if (profileImg) userFd.append("profileImage", profileImg);

      await register(userFd);

      if (isStoreOwner) {
        const storeFd = new FormData();
        storeFd.append("name", data.storeName.trim());
        storeFd.append("description", (data.storeDesc || "").trim());
        storeFd.append("category", resolveCategoryValue(data.storeCategory));
        storeFd.append("phone", (data.storePhone || "").trim());
        storeFd.append("gst", (data.gst || "").trim());
        storeFd.append("street", data.street.trim());
        storeFd.append("city", data.city.trim());
        storeFd.append("state", data.state.trim());
        storeFd.append("pincode", data.pincode.trim());
        if (storeLogo) storeFd.append("logo", storeLogo);
        if (storeBanner) storeFd.append("banner", storeBanner);

        await api.post("/stores", storeFd);
      }

      setStep(successStep);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl p-8 sm:p-10 border border-gray-100 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-black" />

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-heading font-black text-xl tracking-tighter">CM</span>
          </Link>
          {!isSuccess && (
            <p className="text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-black font-semibold hover:underline">Sign in</Link>
            </p>
          )}
        </div>

        {!isSuccess && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              {steps.slice(0, -1).map((lbl, i) => (
                <div key={lbl} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors ${step > i + 1 ? 'bg-black text-white' : step === i + 1 ? 'bg-black text-white ring-4 ring-gray-100' : 'bg-gray-100 text-gray-400'}`}>
                    {step > i + 1 ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${step >= i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{lbl}</span>
                </div>
              ))}
            </div>
            <div className="relative h-1 bg-gray-100 rounded-full mt-4 mx-8 overflow-hidden">
               <div className="absolute top-0 left-0 h-full bg-black transition-all duration-300" style={{ width: `${((step - 1) / totalSteps) * 100}%` }} />
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-heading text-gray-900">Create account</h2>
              <p className="text-sm text-gray-500 mt-1">Join ClothMart — it's free and takes under 2 minutes.</p>
            </div>

            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => { setRole("customer"); setErrors({}); }} 
                className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${role === "customer" ? 'border-black bg-gray-50 text-black shadow-sm ring-1 ring-black' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
              >
                <User size={18} /> Customer
              </button>
              <button 
                onClick={() => { setRole("store_owner"); setErrors({}); }} 
                className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${role === "store_owner" ? 'border-black bg-gray-50 text-black shadow-sm ring-1 ring-black' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
              >
                <Store size={18} /> Store Owner
              </button>
            </div>

            <div className="space-y-4">
              {STEP1_FIELDS.map(f => (
                <FormField key={f.name} field={f} value={data[f.name]} onChange={set} error={errors[f.name]} showPwd={f.name === "password" ? showPwd : showCPwd} togglePwd={f.name === "password" ? () => setShowPwd(!showPwd) : () => setShowCPwd(!showCPwd)} />
              ))}
            </div>

            <button onClick={next} className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold tracking-wide uppercase text-white bg-black hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all mt-8">
              Continue <ChevronRight size={18} className="ml-2" />
            </button>
          </div>
        )}

        {/* STEP 2 - Customer */}
        {step === 2 && !isStoreOwner && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-heading text-gray-900">Your profile</h2>
              <p className="text-sm text-gray-500 mt-1">Add a photo and number to complete your setup.</p>
            </div>

            <ImageUpload label="Profile Photo" name="profileImg" value={profileImg} onChange={setImg} round />

            <div className="space-y-4">
              {STEP2_CUSTOMER_FIELDS.map(f => <FormField key={f.name} field={f} value={data[f.name]} onChange={set} error={errors[f.name]} />)}
            </div>

            {apiError && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-start gap-3 border border-red-100">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" /> <p>{apiError}</p>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button onClick={back} className="w-14 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className={`flex-1 flex items-center justify-center py-4 border border-transparent rounded-xl shadow-sm text-sm font-bold tracking-wide uppercase text-white bg-black hover:bg-gray-800 transition-all ${loading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loading ? <LoaderCircle className="animate-spin" size={20} /> : "Create Account"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 - Store Owner */}
        {step === 2 && isStoreOwner && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-heading text-gray-900">Store info</h2>
              <p className="text-sm text-gray-500 mt-1">Tell us what you sell.</p>
            </div>

            <div className="space-y-2">
              {STEP2_STORE_FIELDS.map(f => <FormField key={f.name} field={f} value={data[f.name]} onChange={set} error={errors[f.name]} />)}
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={back} className="w-14 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={next} className="flex-1 flex items-center justify-center py-4 border border-transparent rounded-xl shadow-sm text-sm font-bold tracking-wide uppercase text-white bg-black hover:bg-gray-800 transition-all">
                Continue <ChevronRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 - Store Owner Media & Address */}
        {step === 3 && isStoreOwner && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-heading text-gray-900">Media & Address</h2>
              <p className="text-sm text-gray-500 mt-1">Upload branding and your location.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ImageUpload label="Store Logo" name="storeLogo" value={storeLogo} onChange={setImg} round />
              <ImageUpload label="Cover Banner" name="storeBanner" value={storeBanner} onChange={setImg} />
            </div>

            <h3 className="text-sm font-bold text-gray-900 mb-4 mt-2">Store Address</h3>
            <div className="space-y-4">
              {STEP3_STORE_ADDRESS_FIELDS.map(f => <FormField key={f.name} field={f} value={data[f.name]} onChange={set} error={errors[f.name]} />)}
            </div>

            {apiError && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-start gap-3 border border-red-100">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" /> <p>{apiError}</p>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button onClick={back} className="w-14 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className={`flex-1 flex items-center justify-center py-4 border border-transparent rounded-xl shadow-sm text-sm font-bold tracking-wide uppercase text-white bg-black hover:bg-gray-800 transition-all ${loading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loading ? <LoaderCircle className="animate-spin" size={20} /> : "Launch Store"}
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {isSuccess && (
          <div className="animate-slide-up text-center py-8">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-500" size={40} />
            </div>
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-2">You're all set!</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Welcome to ClothMart{data.fullName ? `, ${data.fullName.split(" ")[0]}` : ""}! 
              {isStoreOwner ? " Your store setup is complete." : " Start shopping now."}
            </p>
            <Link to={isStoreOwner ? "/dashboard" : "/"} className="inline-flex items-center justify-center py-4 px-10 border border-transparent rounded-xl shadow-md text-sm font-bold tracking-wider uppercase text-white bg-black hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all">
               {isStoreOwner ? "Go to Dashboard" : "Start Shopping"} <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        )}

        {!isSuccess && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-medium">By registering, you agree to our Terms & Privacy Policy.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
