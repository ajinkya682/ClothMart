import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.scss";

// ─── Icons ────────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="1"
        x2="23"
        y2="23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user was redirected here from a protected route, send them back there
  // after login — but only if their role matches. Otherwise use role default.
  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Validation ──────────────────────────────────────────────────────────────
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

  // ── Role-based redirect ─────────────────────────────────────────────────────
  // Priority: previous protected page (from) → role default
  const getRedirectPath = (role) => {
    if (from && from !== "/login" && from !== "/register") return from;
    return role === "store_owner" ? "/dashboard" : "/";
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
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
      // login() returns res.data which includes the user object with role
      const data = await login({ email: email.trim(), password });
      setSuccess(true);
      setTimeout(
        () => navigate(getRedirectPath(data.user.role), { replace: true }),
        900,
      );
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          (err?.response?.status === 401
            ? "Incorrect email or password. Please try again."
            : "Something went wrong. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field) => setErrors((e) => ({ ...e, [field]: "" }));

  return (
    <div className="login-page">
      {/* ── Left panel: branding ─────────────────────────────────────────── */}
      <div className="login-left">
        <div className="login-left__inner">
          <Link to="/" className="login-logo">
            <span className="login-logo__mark">CM</span>
            <span className="login-logo__name">ClothMart</span>
          </Link>

          {/* Big editorial quote */}
          <div className="login-left__copy">
            <h2 className="login-left__headline">
              Your wardrobe,
              <br />
              <span className="login-left__accent">reimagined.</span>
            </h2>
            <p className="login-left__sub">
              Sign in to access curated fashion from 500+ verified clothing
              brands across India.
            </p>
          </div>

          {/* Feature cards */}
          <div className="login-features">
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: "Saved Wishlist",
                desc: "All your favourite styles in one place",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="21" r="1" fill="currentColor" />
                    <circle cx="20" cy="21" r="1" fill="currentColor" />
                    <path
                      d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: "Order Tracking",
                desc: "Track every delivery in real time",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: "Exclusive Deals",
                desc: "Member-only discounts from top brands",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="login-feat"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <span className="login-feat__icon">{feat.icon}</span>
                <div>
                  <div className="login-feat__title">{feat.title}</div>
                  <div className="login-feat__desc">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative elements */}
          <div className="login-left__blob1" aria-hidden />
          <div className="login-left__blob2" aria-hidden />
          <div className="login-left__grid" aria-hidden />
        </div>
      </div>

      {/* ── Right panel: form ────────────────────────────────────────────── */}
      <div className="login-right">
        <div className="login-form-wrap">
          {/* Mobile logo */}
          <Link to="/" className="login-logo login-logo--mobile">
            <span className="login-logo__mark">CM</span>
            <span className="login-logo__name">ClothMart</span>
          </Link>

          {/* Header */}
          <div className="login-hd">
            <h1 className="login-hd__title">Welcome back</h1>
            <p className="login-hd__sub">
              Don't have an account?{" "}
              <Link to="/register" className="login-hd__link">
                Create one free
              </Link>
            </p>
          </div>

          {/* Success overlay */}
          {success && (
            <div className="login-success">
              <div className="login-success__circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span>Signing you in…</span>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* API error banner */}
              {apiError && (
                <div className="login-api-error" role="alert">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="12"
                      y1="16"
                      x2="12.01"
                      y2="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {apiError}
                </div>
              )}

              {/* Email field */}
              <div className="login-field">
                <label className="login-label" htmlFor="email">
                  Email Address
                </label>
                <div
                  className={`login-input-wrap${errors.email ? " login-input-wrap--error" : ""}${email && !errors.email ? " login-input-wrap--ok" : ""}`}
                >
                  <span className="login-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <polyline
                        points="22,6 12,13 2,6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError("email");
                      setApiError("");
                    }}
                    autoComplete="email"
                    autoFocus
                  />
                  {email && !errors.email && (
                    <span className="login-input-check">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                {errors.email && (
                  <span className="login-error">{errors.email}</span>
                )}
              </div>

              {/* Password field */}
              <div className="login-field">
                <div className="login-label-row">
                  <label className="login-label" htmlFor="password">
                    Password
                  </label>
                  <Link to="/forgot-password" className="login-forgot">
                    Forgot password?
                  </Link>
                </div>
                <div
                  className={`login-input-wrap login-input-wrap--pwd${errors.password ? " login-input-wrap--error" : ""}`}
                >
                  <span className="login-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M7 11V7a5 5 0 0 1 10 0v4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    className="login-input"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError("password");
                      setApiError("");
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowPwd((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPwd} />
                  </button>
                </div>
                {errors.password && (
                  <span className="login-error">{errors.password}</span>
                )}
              </div>

              {/* Remember me */}
              <div className="login-remember">
                <label className="login-check-label">
                  <input type="checkbox" className="login-checkbox" />
                  <span className="login-check-box" />
                  Keep me signed in
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`login-btn${loading ? " login-btn--loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="login-divider">
                <span>or continue as</span>
              </div>

              {/* Role quick-links */}
              <div className="login-roles">
                <Link to="/register?role=customer" className="login-role-card">
                  <span className="login-role-card__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="login-role-card__title">New Customer</div>
                    <div className="login-role-card__sub">
                      Shop from top brands
                    </div>
                  </div>
                  <svg
                    className="login-role-card__arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                <Link
                  to="/register?role=store_owner"
                  className="login-role-card"
                >
                  <span className="login-role-card__icon login-role-card__icon--store">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="9 22 9 12 15 12 15 22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="login-role-card__title">Open a Store</div>
                    <div className="login-role-card__sub">
                      Sell your clothing brand
                    </div>
                  </div>
                  <svg
                    className="login-role-card__arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </form>
          )}

          <p className="login-terms">
            By signing in you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
