import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, LoaderCircle, Store, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const getRedirectPath = (role) => {
    if (from && from !== "/login" && from !== "/register") return from;
    return role === "store_owner" ? "/dashboard" : "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const data = await login({ email: email.trim(), password });
      setSuccess(true);
      setTimeout(() => navigate(getRedirectPath(data.user.role), { replace: true }), 900);
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          (err?.response?.status === 401
            ? "Incorrect email or password. Please try again."
            : "Something went wrong. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field) => setErrors((e) => ({ ...e, [field]: "" }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl p-8 sm:p-10 border border-gray-100 relative overflow-hidden">
        
        {/* Top Decor */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-black" />

        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-heading font-black text-xl tracking-tighter">CM</span>
          </Link>
          <h1 className="text-2xl font-bold font-heading text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-2">
            Don't have an account? <Link to="/register" className="text-black font-semibold hover:underline">Create one free</Link>
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Login Successful</h3>
            <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            
            {apiError && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-start gap-3 border border-red-100 animate-slide-up">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <p>{apiError}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all ${errors.email ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-200 text-gray-900 focus:bg-white'}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); setApiError(""); }}
                autoComplete="email"
                autoFocus
              />
              {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-900" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-sm pr-12 focus:ring-2 focus:ring-black focus:border-transparent transition-all ${errors.password ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-200 text-gray-900 focus:bg-white'}`}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError("password"); setApiError(""); }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-xs text-red-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold tracking-wide uppercase text-white bg-black hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {loading ? <LoaderCircle className="animate-spin" size={20} /> : "Sign In"}
            </button>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-xs text-gray-500 font-medium uppercase tracking-wider mb-6">Or continue as</p>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/register?role=customer" className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-black transition-colors group">
                   <User size={20} className="text-gray-400 group-hover:text-black mb-2 transition-colors" />
                   <span className="text-xs font-semibold text-gray-700 group-hover:text-black">Customer</span>
                </Link>
                <Link to="/register?role=store_owner" className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-black transition-colors group">
                   <Store size={20} className="text-gray-400 group-hover:text-black mb-2 transition-colors" />
                   <span className="text-xs font-semibold text-gray-700 group-hover:text-black">Store Owner</span>
                </Link>
              </div>
            </div>

          </form>
        )}
      </div>

      {/* Decorative text bottom */}
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
        <p className="text-xs text-gray-400 font-medium">By signing in, you agree to our Terms & Privacy Policy.</p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}
