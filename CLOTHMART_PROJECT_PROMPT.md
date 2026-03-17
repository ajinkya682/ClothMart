# 🛍️ CLOTHMART — COMPLETE PROJECT PROMPT

> Copy-paste this entire prompt into any AI tool to get full context about the project.
> Built by Ajinkya Saivar · MERN Stack · Chhatrapati Sambhajinagar, Maharashtra · March 2026

---

## 📌 PROJECT OVERVIEW

**ClothMart** is a full-stack MERN e-commerce platform exclusively for clothing brands.
It supports two types of users — **Customers** (who shop) and **Store Owners** (who sell).
The platform allows store owners to create their own clothing store, list products, manage orders and track analytics.
Customers can browse stores, add to cart, wishlist products, place orders and pay via Razorpay or COD.

- **Frontend:** React (Vite) + SCSS Modules
- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Auth:** JWT (stored in localStorage as `cm_token`, user as `cm_user`)
- **Image CDN:** ImageKit
- **Payments:** Razorpay
- **Deployed Backend:** `https://clothmart-hwua.onrender.com/api`
- **Local Backend:** `http://localhost:3000/api`

---

## 🎨 DESIGN SYSTEM & THEME

### Color Palette

```scss
$black: #09090b;
$dark: #121215;
$dark-card: #18181c;
$dark-border: #242429;
$white: #f4f3ef;
$white-pure: #ffffff;

$yellow: #ffcf40; // PRIMARY ACCENT
$yellow-hover: #f0bd20;
$yellow-soft: #fff8dc;
$yellow-border: rgba(255, 207, 64, 0.3);

$text-primary: #1c1c1e;
$text-secondary: #52525b;
$text-muted: #a1a1aa;
$text-light: #d4d4d8;

$bg-main: #fafaf9;
$bg-alt: #f3f2ee;
$bg-card: #ffffff;
$bg-dark: #09090b;

$success: #16a34a;
$error: #dc2626;
$warning: #d97706;
```

### Typography

```scss
$font-display: "Syne", sans-serif; // headings, bold display text
$font-body: "Cabinet Grotesk", sans-serif; // body text, UI elements
$font-mono: "Fira Code", monospace; // labels, prices, codes
```

### Spacing Scale

```scss
$sp-1: 4px;
$sp-2: 8px;
$sp-3: 12px;
$sp-4: 16px;
$sp-5: 20px;
$sp-6: 24px;
$sp-8: 32px;
$sp-10: 40px;
$sp-12: 48px;
$sp-16: 64px;
$sp-20: 80px;
$sp-24: 96px;
$sp-32: 128px;
```

### Border Radius

```scss
$r-xs: 3px;
$r-sm: 6px;
$r-md: 10px;
$r-lg: 16px;
$r-xl: 24px;
$r-full: 9999px;
```

### Shadows

```scss
$shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.07);
$shadow-md: 0 6px 24px rgba(0, 0, 0, 0.09);
$shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.13);
$shadow-xl: 0 24px 64px rgba(0, 0, 0, 0.18);
$shadow-yellow: 0 8px 30px rgba(255, 207, 64, 0.35);
```

### Transitions

```scss
$t-fast: all 0.15s ease;
$t-base: all 0.25s ease;
$t-slow: all 0.4s ease;
$t-spring: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Breakpoints

```scss
$bp-sm: 480px;
$bp-md: 768px;
$bp-lg: 1024px;
$bp-xl: 1280px;
$max-width: 1320px;
$gutter: 28px;
$gutter-mobile: 16px;
```

### Key Mixins Available

```scss
@include m.container // centered max-width wrapper
  @include m.section-padding // standard section block padding
  @include m.flex(dir, align, justify, gap) @include m.flex-center @include
  m.flex-between @include m.auto-grid(min, gap) @include m.fixed-grid(cols, gap)
  @include m.display(size) // font-display heading
  @include m.heading(size) @include m.label // uppercase mono label
  @include m.truncate @include m.clamp-text(lines) @include m.btn-primary
  @include m.btn-dark @include m.btn-outline @include m.btn-ghost @include
  m.card(pad) @include m.card-hover @include m.shimmer
  // skeleton loading animation
  @include m.section-header-label // yellow pill label
  @include m.below-sm / below-md / below-lg // responsive breakpoints
  @include m.sm / md / lg / xl; // min-width breakpoints
```

### Design Principles

- **Dark hero sections** (`$black` background) with yellow grid overlay and glow blobs
- **Light content sections** (`$bg-main` / `$bg-alt` / `$bg-card`)
- **Yellow (#ffcf40)** is the only accent — used for CTAs, active states, highlights
- Cards use `$bg-card` with subtle border and `$shadow-xs`, lift on hover
- All pages use `fadeUp` animation on load with staggered `animationDelay`
- Split-screen layout for auth pages (dark left panel + light right form)
- Sticky category bar below navbar using `$z-dropdown`

---

## 📁 FRONTEND FILE STRUCTURE

```
Frontend/
├── .env                          → VITE_API_URL=https://clothmart-hwua.onrender.com/api
├── .env.local                    → VITE_API_URL=http://localhost:3000/api
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles/
    │   └── base/
    │       ├── variables.scss    → all design tokens
    │       ├── mixins.scss       → all reusable mixins
    │       └── reset.scss        → global reset + keyframes
    ├── utils/
    │   └── api.js                → axios instance (see below)
    ├── context/
    │   ├── AuthContext.jsx       → user auth state (login/register/logout)
    │   └── CartContext.jsx       → cart state (add/remove/update/clear)
    ├── components/
    │   ├── Navbar/
    │   │   ├── Navbar.jsx
    │   │   └── Navbar.scss
    │   ├── Footer/
    │   │   ├── Footer.jsx
    │   │   └── Footer.scss
    │   ├── ProtectedRoute/
    │   │   ├── ProtectedRoute.jsx
    │   │   └── ProtectedRoute.scss
    │   └── ScrollToTop/
    │       ├── ScrollToTop.jsx
    │       └── ScrollToTop.scss
    └── pages/
        ├── Home/
        │   ├── Home.jsx
        │   ├── Home.scss
        │   └── features/
        │       ├── Categories/
        │       │   ├── Categories.jsx
        │       │   └── Categories.scss
        │       ├── FeaturedStores/
        │       ├── Hero/
        │       ├── Newsletter/
        │       ├── TrendingProducts/
        │       └── WhyChooseUs/
        ├── Stores/
        │   ├── Stores.jsx        → /stores page
        │   └── Stores.scss
        ├── Products/
        │   ├── Products.jsx      → /products page
        │   └── Products.scss
        ├── Register/
        │   ├── Register.jsx      → /register (multi-step)
        │   └── Register.scss
        ├── Login/
        │   ├── Login.jsx         → /login
        │   └── Login.scss
        └── NotFound/
            ├── NotFound.jsx
            └── NotFound.scss
```

---

## 🔌 API UTILITY (src/utils/api.js)

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  timeout: 15000,
});

// Auto-attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cm_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cm_token");
      localStorage.removeItem("cm_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
```

---

## 🔐 AUTH CONTEXT (src/context/AuthContext.jsx)

```js
// State: { user, loading, isAuthenticated, isStoreOwner, isCustomer }
// Methods: register(formData), login({email, password}), logout(), updateUser(updated)
// Storage: cm_token → JWT, cm_user → user object (both in localStorage)
// Role values: "customer" | "store_owner"
```

---

## 🛒 CART CONTEXT (src/context/CartContext.jsx)

```js
// State: { items, cartCount, cartSubtotal }
// Methods: addToCart(product, qty, size, color)
//          removeFromCart(productId, size, color)
//          updateQty(productId, size, color, qty)
//          clearCart()
// Storage: cm_cart → JSON array in localStorage
// Item shape: { product, qty, size, color, price }
```

---

## 🚦 APP.JSX ROUTES

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home/Home"));
const Stores = lazy(() => import("./pages/Stores/Stores"));
const Products = lazy(() => import("./pages/Products/Products"));
const Register = lazy(() => import("./pages/Register/Register"));
const Login = lazy(() => import("./pages/Login/Login"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

// All pages wrapped in: AuthProvider > CartProvider > Navbar > Suspense > Routes > Footer
// PageLoader = dark screen with yellow spinning ring

// Current routes:
// GET /          → Home
// GET /stores    → Stores
// GET /products  → Products
// GET /register  → Register (multi-step)
// GET /login     → Login
// GET *          → NotFound
```

---

## 🌐 COMPLETE API DOCUMENTATION

**Base URL:** `https://clothmart-hwua.onrender.com/api`
**Local URL:** `http://localhost:3000/api`
**Auth Header:** `Authorization: Bearer <jwt_token>`

---

### 1️⃣ AUTH API — `/api/auth`

#### POST `/auth/register` — Register new user

- **Body:** `form-data`
- **Fields:**
  | Field | Type | Required | Notes |
  |-------|------|----------|-------|
  | name | String | ✅ | Full name |
  | email | String | ✅ | Unique email |
  | password | String | ✅ | Min 6 chars |
  | role | String | ❌ | `customer` \| `store_owner` (default: customer) |
  | phone | String | ❌ | Mobile number |
  | profileImage | File | ❌ | jpg/png |
- **Response 201:**

```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGci...",
  "user": {
    "id": "...",
    "name": "Ajinkya",
    "email": "...",
    "role": "customer",
    "phone": "...",
    "profileImage": "https://ik.imagekit.io/..."
  }
}
```

- **Errors:** 400 email exists, 400 missing fields

---

#### POST `/auth/login` — Login

- **Body:** `raw JSON`
- **Fields:** `{ email, password }`
- **Response 200:** same shape as register `{ success, token, user }`
- **Errors:** 401 wrong password, 404 email not found

---

#### POST `/auth/logout` 🔒 — Logout

- **Body:** none | **Header:** Bearer token

---

#### GET `/auth/me` 🔒 — Get logged-in user profile

- **Response:** `{ success, user: { id, name, email, role, phone, profileImage, addresses[] } }`

---

#### PUT `/auth/me` 🔒 — Update profile

- **Body:** `form-data` → `name`, `phone`, `profileImage (File)`

---

#### PUT `/auth/password` 🔒 — Change password

- **Body:** `raw JSON` → `{ oldPassword, newPassword }`

---

#### POST `/auth/address` 🔒 — Add delivery address

- **Body:** `raw JSON` → `{ street, city, state, pincode }`

---

#### DELETE `/auth/address/:addressId` 🔒 — Remove address

---

### 2️⃣ STORE API — `/api/stores`

#### GET `/stores` — Get all stores

- **Query:** `?search=name`, `?category=saree`

#### GET `/stores/my` 🔒 — Get owner's own store

#### GET `/stores/:id` — Get single store

#### POST `/stores` 🔒 — Create store (store_owner only)

- **Body:** `form-data`
- **Fields:** `name`(req), `description`, `category` (saree|kids|mens|ethnic|western|other), `street`, `city`, `state`, `pincode`, `logo (File)`
- **Response 201:** `{ success, message, store: { _id, name, category, owner, logo, rating, isActive, address } }`
- **Errors:** 403 not store owner, 400 already has store, 400 missing name

#### PUT `/stores/:id` 🔒 — Update store (owner only)

- **Body:** `form-data` → any store fields

#### DELETE `/stores/:id` 🔒 — Soft delete store

---

### 3️⃣ PRODUCT API — `/api/products`

#### GET `/products` — Get all products (paginated)

- **Query:** `?search=`, `?category=`, `?store=STORE_ID`, `?minPrice=`, `?maxPrice=`, `?sort=price_asc|price_desc|newest`, `?page=1`, `?limit=12`
- **Response:** `{ success, total, page, pages, products: [...] }`

#### GET `/products/:id` — Get single product

#### POST `/products` 🔒 — Create product (store_owner only)

- **Body:** `form-data`
- **Fields:** `name`(req), `description`, `price`(req), `discountPrice`, `category`(req), `sizes` (JSON array string e.g. `["S","M","L"]`), `colors` (JSON array string), `stock`(req), `images (File[])`

#### PUT `/products/:id` 🔒 — Update product (owner only)

#### DELETE `/products/:id` 🔒 — Soft delete product

---

### 4️⃣ ORDER API — `/api/orders` 🔒

#### POST `/orders` — Place order (customer only)

- **Body:** `raw JSON`

```json
{
  "items": [
    { "product": "id", "qty": 1, "size": "M", "color": "Red", "price": 499 }
  ],
  "deliveryAddress": { "street": "", "city": "", "state": "", "pincode": "" },
  "paymentMethod": "razorpay | cod",
  "couponCode": "SAVE20"
}
```

#### GET `/orders/my` — Customer's order history

#### GET `/orders/store` — Store owner's orders

#### GET `/orders/:id` — Single order details

#### PUT `/orders/:id/status` — Update order status (store owner)

- **Body:** `{ "status": "confirmed|shipped|delivered|cancelled" }`
- **Status flow:** `pending → confirmed → shipped → delivered`

---

### 5️⃣ PAYMENT API — `/api/payment` 🔒

#### POST `/payment/create` — Create Razorpay order

- **Body:** `{ orderId, amount }` (amount in INR)
- **Response:** `{ success, razorpayOrderId, amount, currency, keyId }`

#### POST `/payment/verify` — Verify payment signature

- **Body:** `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }`
- **Response:** `{ success, message, order: { paymentStatus: "paid", status: "confirmed" } }`

---

### 6️⃣ REVIEWS API — `/api/reviews`

#### POST `/reviews` 🔒 — Submit review (customer only)

- **Body:** `{ product: ObjectId, rating: 1-5, comment }`

#### GET `/reviews?product=PRODUCT_ID` — Get product reviews

#### DELETE `/reviews/:reviewId` 🔒 — Delete own review

---

### 7️⃣ COUPONS API — `/api/coupons`

#### POST `/coupons` 🔒 — Create coupon (store owner)

- **Body:** `{ code, discountType: "percent|flat", discountValue, minOrderAmount, expiresAt }`

#### POST `/coupons/validate` — Validate coupon

- **Body:** `{ code, orderAmount, storeId }`

#### GET `/coupons` 🔒 — Get store's coupons

---

### 8️⃣ ANALYTICS API — `/api/analytics` 🔒 (store_owner only)

#### GET `/analytics/summary`

- **Response:** `{ todayOrders, todayRevenue, totalOrders, totalRevenue, lowStockProducts }`

#### GET `/analytics/revenue` — Monthly revenue chart data

#### GET `/analytics/top-products` — Top 5 selling products

---

### 9️⃣ UPLOAD API — `/api/upload` 🔒

#### POST `/upload` — Upload image to ImageKit CDN

- **Body:** `form-data` → `image (File)` — max 5MB, jpg/png/webp
- **Response:** `{ success, url: "https://ik.imagekit.io/...", fileId }`

---

## 📄 PAGES BUILT SO FAR

| Route                 | File                   | Status       | Description                                                                                                |
| --------------------- | ---------------------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `/`                   | `pages/Home/`          | ✅ Done      | Hero, Categories, Featured Stores, Trending Products, Newsletter, WhyChooseUs                              |
| `/stores`             | `pages/Stores/`        | ✅ Done      | Store grid, featured stores, category filter pills, search, sort, follow button                            |
| `/products`           | `pages/Products/`      | ✅ Done      | Product grid, filter sidebar (category/price/size/rating), sort, wishlist, add to cart                     |
| `/register`           | `pages/Register/`      | ✅ Done      | Multi-step: Step1 Account+Role, Step2 Store Info (owner) / Profile (customer), Step3 Media+Address (owner) |
| `/login`              | `pages/Login/`         | ✅ Done      | Split screen, email+password, remember me, success animation, role quick-links                             |
| `/stores/:slug`       | `pages/StoreDetail/`   | ❌ Not built | Single store page with products                                                                            |
| `/products/:slug`     | `pages/ProductDetail/` | ❌ Not built | Product detail, size selector, add to cart, reviews                                                        |
| `/cart`               | `pages/Cart/`          | ❌ Not built | Cart items, quantity, coupon, checkout                                                                     |
| `/checkout`           | `pages/Checkout/`      | ❌ Not built | Delivery address, payment (Razorpay/COD)                                                                   |
| `/orders`             | `pages/Orders/`        | ❌ Not built | Order history for customer                                                                                 |
| `/profile`            | `pages/Profile/`       | ❌ Not built | User profile, addresses, settings                                                                          |
| `/dashboard`          | `pages/Dashboard/`     | ❌ Not built | Store owner dashboard, analytics                                                                           |
| `/dashboard/products` | `pages/Dashboard/`     | ❌ Not built | Manage products (CRUD)                                                                                     |
| `/dashboard/orders`   | `pages/Dashboard/`     | ❌ Not built | Manage orders, update status                                                                               |

---

## 🧩 REGISTER PAGE — API INTEGRATION

```jsx
// Step 1: Account (name, email, password, role)
// Step 2 Customer: profile photo + phone → POST /auth/register (form-data)
// Step 2 Store Owner: store info (name, category, desc, phone, gst)
// Step 3 Store Owner: logo + banner + address →
//   1. POST /auth/register (form-data) with user fields + profileImage
//   2. POST /stores (form-data) with store fields + logo + address

// AuthContext.register() expects FormData:
const fd = new FormData();
fd.append("name", data.fullName);
fd.append("email", data.email);
fd.append("password", data.password);
fd.append("role", role);
fd.append("phone", data.phone || "");
if (profileImg) fd.append("profileImage", profileImg);
await register(fd); // → POST /auth/register

// If store_owner, after register → create store:
await api.post("/stores", storeFormData); // form-data with logo
```

---

## 🔑 LOGIN PAGE — API INTEGRATION

```jsx
// POST /auth/login with raw JSON
await login({ email, password });
// AuthContext.login() calls: api.post("/auth/login", { email, password })
// Saves token → localStorage.cm_token
// Saves user → localStorage.cm_user
// Redirects to location.state.from || "/"
```

---

## 🏪 STORE CATEGORIES

`"saree"` | `"kids"` | `"mens"` | `"ethnic"` | `"western"` | `"other"`
UI labels: `"Saree & Silk"` | `"Kids' Wear"` | `"Men's Fashion"` | `"Ethnic & Traditional"` | `"Women's Western"` | `"Streetwear"` | `"Winterwear"` | `"Activewear"` | `"Bridal & Occasion"` | `"Accessories"`

---

## 👤 USER OBJECT SHAPE

```js
{
  id: "mongodb_id",
  name: "Ajinkya Saivar",
  email: "ajinkya@gmail.com",
  role: "customer" | "store_owner",
  phone: "9876543210",
  profileImage: "https://ik.imagekit.io/...",
  isVerified: false,
  addresses: [{ _id, street, city, state, pincode }]
}
```

---

## 🏬 STORE OBJECT SHAPE

```js
{
  _id: "mongodb_id",
  name: "Velvet Noir",
  slug: "velvet-noir",
  description: "...",
  category: "western",
  logo: "https://ik.imagekit.io/...",
  banner: "https://ik.imagekit.io/...",
  rating: 4.8,
  isActive: true,
  isVerified: false,
  owner: { id, name, email },
  address: { street, city, state, pincode },
  phone: "9876543210",
  gst: "22AAAAA0000A1Z5"
}
```

---

## 📦 PRODUCT OBJECT SHAPE

```js
{
  _id: "mongodb_id",
  name: "Cotton Saree",
  slug: "cotton-saree",
  description: "...",
  price: 599,
  discountPrice: 499,
  category: "Saree",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Red", "Blue"],
  stock: 20,
  images: ["https://ik.imagekit.io/..."],
  store: { _id, name, slug },
  rating: 4.5,
  reviewCount: 120,
  isActive: true,
  createdAt: "2024-01-15T..."
}
```

---

## 🛒 CART ITEM SHAPE

```js
{
  product: { _id, name, images, price, discountPrice, store },
  qty: 2,
  size: "M",
  color: "Red",
  price: 499  // discountPrice || price at time of adding
}
```

---

## ⚙️ CODING CONVENTIONS

1. **All new pages** follow the pattern: `pages/PageName/PageName.jsx` + `PageName.scss`
2. **SCSS imports** at top of every `.scss` file:
   ```scss
   @use "../../styles/base/variables" as v;
   @use "../../styles/base/mixins" as m;
   ```
   _(adjust `../../` depth based on folder level)_
3. **API calls** always use `api` from `../../utils/api` — never raw `fetch` or `axios`
4. **Protected routes** wrap with `<ProtectedRoute>` component
5. **Lazy load** all pages in `App.jsx` using `React.lazy()`
6. **Mock data** pattern: always include mock data array at top of page for development, with a comment `// 🔁 Replace with: api.get("/endpoint")`
7. **Animation**: all cards use `animation: fadeUp 0.5s ease both` with `animationDelay` stagger
8. **Images**: all `<img>` tags use `loading="lazy"` and `object-fit: cover`
9. **Error handling**: all API calls wrapped in `try/catch`, errors shown via inline error state
10. **Form validation**: validate before API call, show inline field errors

---

## 🚀 HOW TO RUN

```bash
# Frontend
cd Frontend
npm install
npm run dev        # http://localhost:5173

# Backend (separate terminal)
cd backend
npm install
npm run dev        # http://localhost:3000
```

---

## 🔮 NEXT PAGES TO BUILD (in order)

1. `/stores/:slug` — Store detail page (store info + its products)
2. `/products/:slug` — Product detail (images, sizes, add to cart, reviews)
3. `/cart` — Cart page (items, quantity, coupon code, total)
4. `/checkout` — Checkout (address select, payment method, Razorpay)
5. `/orders` — Customer order history
6. `/profile` — User profile + address management
7. `/dashboard` — Store owner dashboard (analytics, orders, products CRUD)

---

_ClothMart · Built by Ajinkya Saivar · Badlapur, Maharashtra · March 2026_
_MERN Stack: MongoDB + Express + React (Vite) + Node.js_
_github.com/ajinkya-saivar/clothmart_
