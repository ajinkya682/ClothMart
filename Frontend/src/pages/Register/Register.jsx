import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.scss";

// ─── Constants ────────────────────────────────────────────────────────────────
const STORE_CATEGORIES = [
  "Saree & Silk",
  "Men's Fashion",
  "Women's Western",
  "Kids' Wear",
  "Ethnic & Traditional",
  "Activewear",
  "Winterwear",
  "Streetwear",
  "Bridal & Occasion",
  "Accessories",
];

const STEPS_CUSTOMER = ["Account", "Profile", "Done"];
const STEPS_STORE_OWNER = ["Account", "Store Info", "Media & Address", "Done"];

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

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="17 8 12 3 7 8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="3"
      x2="12"
      y2="15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

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
  const colors = ["", "#dc2626", "#d97706", "#16a34a", "#16a34a"];
  return (
    <div className="pwd-strength">
      <div className="pwd-strength__bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="pwd-strength__bar"
            style={{ background: i <= score ? colors[score] : undefined }}
          />
        ))}
      </div>
      <span className="pwd-strength__label" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
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
    <div className="img-upload">
      <label className="form-label">{label}</label>
      <div
        className={`img-upload__zone${round ? " img-upload__zone--round" : ""}${preview ? " img-upload__zone--has-img" : ""}`}
        onClick={() => ref.current.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className={`img-upload__preview${round ? " img-upload__preview--round" : ""}`}
          />
        ) : (
          <div className="img-upload__placeholder">
            <UploadIcon />
            <span className="img-upload__text">Click or drag to upload</span>
            {hint && <span className="img-upload__hint">{hint}</span>}
          </div>
        )}
        {preview && (
          <div className="img-upload__change">
            <span>Change</span>
          </div>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}

function FormField({ field, value, onChange, error, showPwd, togglePwd }) {
  if (field.type === "select") {
    return (
      <div className="form-field">
        <label className="form-label">
          {field.label}
          {field.required && <span className="form-label__req">*</span>}
        </label>
        <div
          className={`form-select-wrap${error ? " form-select-wrap--error" : ""}`}
        >
          <select
            className="form-select"
            value={value || ""}
            onChange={(e) => onChange(field.name, e.target.value)}
          >
            <option value="">{field.placeholder}</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <svg
            className="form-select-arrow"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="form-field">
        <label className="form-label">
          {field.label}
          {field.required && <span className="form-label__req">*</span>}
        </label>
        <textarea
          className={`form-textarea${error ? " form-textarea--error" : ""}`}
          placeholder={field.placeholder}
          value={value || ""}
          rows={3}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }

  const isPassword = field.type === "password";
  return (
    <div className="form-field">
      <label className="form-label">
        {field.label}
        {field.required && <span className="form-label__req">*</span>}
        {!field.required && <span className="form-label__opt">(optional)</span>}
      </label>
      <div
        className={`form-input-wrap${error ? " form-input-wrap--error" : ""}${isPassword ? " form-input-wrap--pwd" : ""}`}
      >
        {field.icon && <span className="form-input-icon">{field.icon}</span>}
        <input
          className={`form-input${field.icon ? " form-input--has-icon" : ""}`}
          type={isPassword ? (showPwd ? "text" : "password") : field.type}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          autoComplete={field.autoComplete}
        />
        {isPassword && (
          <button
            type="button"
            className="form-input-eye"
            onClick={togglePwd}
            tabIndex={-1}
          >
            <EyeIcon open={showPwd} />
          </button>
        )}
      </div>
      {field.name === "password" && <PasswordStrength password={value} />}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEP1_FIELDS = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Ajinkya Saivar",
    required: true,
    autoComplete: "name",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com",
    required: true,
    autoComplete: "email",
    icon: (
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
    ),
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Min. 6 characters",
    required: true,
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Repeat your password",
    required: true,
    autoComplete: "new-password",
  },
];

const STEP2_CUSTOMER_FIELDS = [
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "9876543210",
    required: false,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const STEP2_STORE_FIELDS = [
  {
    name: "storeName",
    label: "Store Name",
    type: "text",
    placeholder: "e.g. Velvet Noir",
    required: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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
    ),
  },
  {
    name: "storeCategory",
    label: "Store Category",
    type: "select",
    placeholder: "Choose a category",
    required: true,
    options: STORE_CATEGORIES,
  },
  {
    name: "storeDesc",
    label: "Store Description",
    type: "textarea",
    placeholder: "Tell customers what your store is about…",
    required: true,
  },
  {
    name: "storePhone",
    label: "Store Contact Number",
    type: "tel",
    placeholder: "9876543210",
    required: false,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "gst",
    label: "GST Number",
    type: "text",
    placeholder: "22AAAAA0000A1Z5 (optional)",
    required: false,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <rect
          x="2"
          y="7"
          width="20"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

const STEP3_STORE_ADDRESS_FIELDS = [
  {
    name: "street",
    label: "Street Address",
    type: "text",
    placeholder: "123, MG Road, Near Metro",
    required: true,
  },
  {
    name: "city",
    label: "City",
    type: "text",
    placeholder: "Mumbai",
    required: true,
  },
  {
    name: "state",
    label: "State",
    type: "text",
    placeholder: "Maharashtra",
    required: true,
  },
  {
    name: "pincode",
    label: "Pincode",
    type: "text",
    placeholder: "400001",
    required: true,
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("customer"); // "customer" | "store_owner"
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

  const set = (name, value) => {
    setData((d) => ({ ...d, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const setImg = (name, file) => {
    if (name === "profileImg") setProfileImg(file);
    if (name === "storeLogo") setStoreLogo(file);
    if (name === "storeBanner") setStoreBanner(file);
  };

  // Validate current step and advance
  const next = () => {
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
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setApiError("");
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v));
      fd.append("role", role);
      if (profileImg) fd.append("profileImage", profileImg);
      if (storeLogo) fd.append("storeLogo", storeLogo);
      if (storeBanner) fd.append("storeBanner", storeBanner);
      await register(fd);
      navigate("/");
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const progressPct = ((step - 1) / totalSteps) * 100;

  return (
    <div className="register-page">
      {/* Left panel — branding */}
      <div className="register-panel register-panel--left">
        <div className="register-panel__inner">
          <Link to="/" className="register-logo">
            <span className="register-logo__mark">CM</span>
            <span className="register-logo__name">ClothMart</span>
          </Link>

          <div className="register-pitch">
            <h2 className="register-pitch__title">
              {isStoreOwner
                ? "Launch your fashion brand."
                : "Shop the best fashion brands."}
            </h2>
            <p className="register-pitch__sub">
              {isStoreOwner
                ? "Join thousands of clothing stores on ClothMart. Reach millions of fashion-forward customers across India."
                : "Discover curated clothing from verified stores — ethnic wear, streetwear, activewear and more."}
            </p>
          </div>

          <ul className="register-perks">
            {(isStoreOwner
              ? [
                  "Free store setup in minutes",
                  "Reach millions of buyers",
                  "Powerful seller dashboard",
                  "Secure & fast payouts",
                ]
              : [
                  "Access to 500+ clothing brands",
                  "Free delivery from verified stores",
                  "Easy returns & exchanges",
                  "Exclusive member-only deals",
                ]
            ).map((perk, i) => (
              <li
                key={i}
                className="register-perks__item"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="register-perks__icon">
                  <CheckIcon />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          {/* Decorative shapes */}
          <div className="register-panel__deco1" aria-hidden />
          <div className="register-panel__deco2" aria-hidden />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="register-panel register-panel--right">
        <div className="register-form-wrap">
          {/* Top: logo mobile + sign in link */}
          <div className="register-top">
            <Link to="/" className="register-logo register-logo--mobile">
              <span className="register-logo__mark">CM</span>
              <span className="register-logo__name">ClothMart</span>
            </Link>
            <p className="register-signin">
              Already have an account?{" "}
              <Link to="/login" className="register-signin__link">
                Sign in
              </Link>
            </p>
          </div>

          {/* Progress */}
          <div className="register-progress">
            <div className="register-progress__bar">
              <div
                className="register-progress__fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="register-progress__steps">
              {steps.slice(0, -1).map((label, i) => {
                const idx = i + 1;
                const done = step > idx;
                const curr = step === idx;
                return (
                  <div
                    key={label}
                    className={`register-step${done ? " register-step--done" : ""}${curr ? " register-step--active" : ""}`}
                  >
                    <div className="register-step__circle">
                      {done ? <CheckIcon /> : <span>{idx}</span>}
                    </div>
                    <span className="register-step__label">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── STEP 1: Account ── */}
          {step === 1 && (
            <div className="register-form-step" key="step1">
              <div className="register-form-hd">
                <h1 className="register-form-hd__title">Create your account</h1>
                <p className="register-form-hd__sub">
                  Join ClothMart — it's free and takes under 2 minutes.
                </p>
              </div>

              {/* Role toggle */}
              <div className="role-toggle">
                <button
                  type="button"
                  className={`role-toggle__btn${role === "customer" ? " role-toggle__btn--active" : ""}`}
                  onClick={() => {
                    setRole("customer");
                    setErrors({});
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
                  I'm a Customer
                </button>
                <button
                  type="button"
                  className={`role-toggle__btn${role === "store_owner" ? " role-toggle__btn--active" : ""}`}
                  onClick={() => {
                    setRole("store_owner");
                    setErrors({});
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
                  I'm a Store Owner
                </button>
              </div>

              <div className="form-grid">
                {STEP1_FIELDS.map((f) => (
                  <FormField
                    key={f.name}
                    field={f}
                    value={data[f.name]}
                    onChange={set}
                    error={errors[f.name]}
                    showPwd={
                      f.name === "password"
                        ? showPwd
                        : f.name === "confirmPassword"
                          ? showCPwd
                          : false
                    }
                    togglePwd={
                      f.name === "password"
                        ? () => setShowPwd((v) => !v)
                        : () => setShowCPwd((v) => !v)
                    }
                  />
                ))}
              </div>

              <button className="register-btn" type="button" onClick={next}>
                Continue
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* ── STEP 2 (Customer): Profile ── */}
          {step === 2 && !isStoreOwner && (
            <div className="register-form-step" key="step2-customer">
              <div className="register-form-hd">
                <h1 className="register-form-hd__title">Your profile</h1>
                <p className="register-form-hd__sub">
                  Add a phone number and profile photo to complete your account.
                </p>
              </div>

              <ImageUpload
                label="Profile Photo"
                name="profileImg"
                value={profileImg}
                onChange={setImg}
                hint="JPG, PNG — max 5MB"
                round
              />

              <div className="form-grid">
                {STEP2_CUSTOMER_FIELDS.map((f) => (
                  <FormField
                    key={f.name}
                    field={f}
                    value={data[f.name]}
                    onChange={set}
                    error={errors[f.name]}
                  />
                ))}
              </div>

              {apiError && (
                <div className="register-api-error">
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

              <div className="register-btn-row">
                <button
                  className="register-btn register-btn--outline"
                  type="button"
                  onClick={back}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 12H5M12 19l-7-7 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </button>
                <button
                  className={`register-btn${loading ? " register-btn--loading" : ""}`}
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="register-spinner" /> Creating account…
                    </>
                  ) : (
                    <>
                      Create Account{" "}
                      <svg
                        width="16"
                        height="16"
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
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 (Store Owner): Store Info ── */}
          {step === 2 && isStoreOwner && (
            <div className="register-form-step" key="step2-store">
              <div className="register-form-hd">
                <h1 className="register-form-hd__title">
                  Tell us about your store
                </h1>
                <p className="register-form-hd__sub">
                  This info will appear on your public store profile.
                </p>
              </div>

              <div className="form-grid">
                {STEP2_STORE_FIELDS.map((f) => (
                  <FormField
                    key={f.name}
                    field={f}
                    value={data[f.name]}
                    onChange={set}
                    error={errors[f.name]}
                  />
                ))}
              </div>

              <div className="register-btn-row">
                <button
                  className="register-btn register-btn--outline"
                  type="button"
                  onClick={back}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 12H5M12 19l-7-7 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </button>
                <button className="register-btn" type="button" onClick={next}>
                  Next Step
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 (Store Owner): Media & Address ── */}
          {step === 3 && isStoreOwner && (
            <div className="register-form-step" key="step3-store">
              <div className="register-form-hd">
                <h1 className="register-form-hd__title">
                  Media & store address
                </h1>
                <p className="register-form-hd__sub">
                  Upload your branding and tell customers where you're based.
                </p>
              </div>

              <div className="form-grid form-grid--two">
                <ImageUpload
                  label="Store Logo"
                  name="storeLogo"
                  value={storeLogo}
                  onChange={setImg}
                  hint="Square, min 200×200px"
                  round
                />
                <ImageUpload
                  label="Store Banner (optional)"
                  name="storeBanner"
                  value={storeBanner}
                  onChange={setImg}
                  hint="1200×400px recommended"
                />
              </div>

              <div className="form-section-label">Store Address</div>
              <div className="form-grid form-grid--two">
                {STEP3_STORE_ADDRESS_FIELDS.map((f) => (
                  <FormField
                    key={f.name}
                    field={f}
                    value={data[f.name]}
                    onChange={set}
                    error={errors[f.name]}
                  />
                ))}
              </div>

              {apiError && (
                <div className="register-api-error">
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

              <div className="register-btn-row">
                <button
                  className="register-btn register-btn--outline"
                  type="button"
                  onClick={back}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 12H5M12 19l-7-7 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </button>
                <button
                  className={`register-btn${loading ? " register-btn--loading" : ""}`}
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="register-spinner" />
                      Creating store…
                    </>
                  ) : (
                    <>
                      Launch My Store
                      <svg
                        width="16"
                        height="16"
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
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {((isStoreOwner && step === 4) || (!isStoreOwner && step === 3)) && (
            <div className="register-success">
              <div className="register-success__icon">🎉</div>
              <h2 className="register-success__title">You're all set!</h2>
              <p className="register-success__sub">
                Welcome to ClothMart
                {data.fullName ? `, ${data.fullName.split(" ")[0]}` : ""}!
                {isStoreOwner
                  ? " Your store is under review."
                  : " Start shopping now."}
              </p>
              <Link
                to="/"
                className="register-btn"
                style={{ textDecoration: "none", display: "inline-flex" }}
              >
                Go to Homepage
              </Link>
            </div>
          )}

          <p className="register-terms">
            By registering you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
