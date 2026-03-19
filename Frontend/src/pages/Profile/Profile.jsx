import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "./Profile.scss";

// ─── Tab icons ────────────────────────────────────────────────────────────────
const tabs = [
  {
    key: "profile",
    label: "My Profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
    key: "password",
    label: "Password",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="11"
          width="18"
          height="11"
          rx="2"
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
    ),
  },
  {
    key: "addresses",
    label: "Addresses",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) return null;

  return (
    <div className="prof-page">
      <div className="prof-container">
        {/* Header */}
        <div className="prof-header">
          <div className="prof-header__avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} />
            ) : (
              <span>
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="prof-header__name">{user.name}</h1>
            <p className="prof-header__email">{user.email}</p>
            <span className="prof-header__role">
              {user.role === "store_owner" ? "🏪 Store Owner" : "🛍️ Customer"}
            </span>
          </div>
        </div>

        <div className="prof-layout">
          {/* Sidebar tabs */}
          <div className="prof-sidebar">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`prof-tab${activeTab === t.key ? " prof-tab--active" : ""}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="prof-content">
            {activeTab === "profile" && (
              <ProfileTab user={user} updateUser={updateUser} />
            )}
            {activeTab === "password" && <PasswordTab />}
            {activeTab === "addresses" && (
              <AddressesTab user={user} updateUser={updateUser} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
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
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("phone", phone.trim());
      if (profileImg) fd.append("profileImage", profileImg);

      const res = await api.put("/auth/me", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data.user);
      setSuccess(true);
      setProfileImg(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prof-panel">
      <h2 className="prof-panel__title">Edit Profile</h2>

      {/* Avatar upload */}
      <div className="prof-avatar-upload">
        <div
          className="prof-avatar-upload__img"
          onClick={() => imgRef.current.click()}
        >
          {preview ? (
            <img src={preview} alt="avatar" />
          ) : (
            <span>
              {user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          )}
          <div className="prof-avatar-upload__overlay">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polyline
                points="17 8 12 3 7 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="12"
                y1="3"
                x2="12"
                y2="15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div>
          <p className="prof-avatar-upload__label">Profile Photo</p>
          <p className="prof-avatar-upload__hint">
            Click to change · JPG, PNG · max 5MB
          </p>
        </div>
        <input
          ref={imgRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImgChange}
        />
      </div>

      {/* Fields */}
      <div className="prof-fields">
        <div className="prof-field">
          <label className="prof-field__label">Full Name</label>
          <input
            className="prof-field__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="prof-field">
          <label className="prof-field__label">
            Email <span className="prof-field__readonly">(read-only)</span>
          </label>
          <input
            className="prof-field__input prof-field__input--disabled"
            value={user.email}
            disabled
          />
        </div>

        <div className="prof-field">
          <label className="prof-field__label">
            Phone Number <span className="prof-field__opt">(optional)</span>
          </label>
          <input
            className="prof-field__input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            type="tel"
          />
        </div>
      </div>

      {error && <p className="prof-error">{error}</p>}
      {success && (
        <p className="prof-success">✓ Profile updated successfully!</p>
      )}

      <button
        className={`prof-save-btn${loading ? " prof-save-btn--loading" : ""}`}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="prof-spinner" />
            Saving…
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  );
}

// ─── Password Tab ─────────────────────────────────────────────────────────────
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
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.put("/auth/password", { oldPassword, newPassword });
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prof-panel">
      <h2 className="prof-panel__title">Change Password</h2>
      <p className="prof-panel__sub">
        Choose a strong password with at least 6 characters.
      </p>

      <div className="prof-fields">
        {[
          {
            label: "Current Password",
            val: oldPassword,
            set: setOldPassword,
            show: showOld,
            toggle: () => setShowOld((v) => !v),
          },
          {
            label: "New Password",
            val: newPassword,
            set: setNewPassword,
            show: showNew,
            toggle: () => setShowNew((v) => !v),
          },
          {
            label: "Confirm New Password",
            val: confirmPassword,
            set: setConfirmPassword,
            show: showNew,
            toggle: null,
          },
        ].map(({ label, val, set, show, toggle }) => (
          <div key={label} className="prof-field">
            <label className="prof-field__label">{label}</label>
            <div className="prof-field__pwd-wrap">
              <input
                className="prof-field__input"
                type={show ? "text" : "password"}
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder="••••••"
              />
              {toggle && (
                <button
                  type="button"
                  className="prof-field__eye"
                  onClick={toggle}
                >
                  {show ? "Hide" : "Show"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="prof-error">{error}</p>}
      {success && (
        <p className="prof-success">✓ Password changed successfully!</p>
      )}

      <button
        className={`prof-save-btn${loading ? " prof-save-btn--loading" : ""}`}
        onClick={handleChange}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="prof-spinner" />
            Updating…
          </>
        ) : (
          "Update Password"
        )}
      </button>
    </div>
  );
}

// ─── Addresses Tab ────────────────────────────────────────────────────────────
function AddressesTab({ user, updateUser }) {
  const [addresses, setAddresses] = useState(user.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleAdd = async () => {
    const { street, city, state, pincode } = form;
    if (!street || !city || !state || !pincode) {
      setError("All address fields are required");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setError("Enter a valid 6-digit pincode");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/address", form);
      setAddresses(res.data.addresses);
      updateUser({ ...user, addresses: res.data.addresses });
      setForm({ street: "", city: "", state: "", pincode: "" });
      setShowForm(false);
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
      setAddresses(res.data.addresses);
      updateUser({ ...user, addresses: res.data.addresses });
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="prof-panel">
      <div className="prof-panel__head">
        <div>
          <h2 className="prof-panel__title">Delivery Addresses</h2>
          <p className="prof-panel__sub">
            {addresses.length} saved address{addresses.length !== 1 ? "es" : ""}
          </p>
        </div>
        <button
          className="prof-add-addr-btn"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="prof-addr-form">
          <div className="prof-fields prof-fields--two">
            {[
              {
                key: "street",
                label: "Street Address",
                placeholder: "123, MG Road, Near Metro",
                full: true,
              },
              { key: "city", label: "City", placeholder: "Mumbai" },
              { key: "state", label: "State", placeholder: "Maharashtra" },
              { key: "pincode", label: "Pincode", placeholder: "400001" },
            ].map(({ key, label, placeholder, full }) => (
              <div
                key={key}
                className={`prof-field${full ? " prof-field--full" : ""}`}
              >
                <label className="prof-field__label">{label}</label>
                <input
                  className="prof-field__input"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
          {error && <p className="prof-error">{error}</p>}
          <button
            className={`prof-save-btn${loading ? " prof-save-btn--loading" : ""}`}
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="prof-spinner" />
                Saving…
              </>
            ) : (
              "Save Address"
            )}
          </button>
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 ? (
        <div className="prof-addr-empty">
          <p>No addresses saved yet.</p>
          <p>Add one to speed up checkout!</p>
        </div>
      ) : (
        <div className="prof-addr-list">
          {addresses.map((addr, i) => (
            <div
              key={addr._id}
              className="prof-addr-card"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="prof-addr-card__icon">📍</div>
              <div className="prof-addr-card__body">
                <p className="prof-addr-card__street">{addr.street}</p>
                <p className="prof-addr-card__rest">
                  {addr.city}, {addr.state} — {addr.pincode}
                </p>
              </div>
              <button
                className={`prof-addr-card__delete${deletingId === addr._id ? " prof-addr-card__delete--loading" : ""}`}
                onClick={() => handleDelete(addr._id)}
                disabled={deletingId === addr._id}
              >
                {deletingId === addr._id ? "…" : "🗑️"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
