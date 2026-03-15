<div align="center">

# 🧵 ClothMart

**A production-grade, multi-store e-commerce platform built with the MERN stack**
**that takes offline cloth stores in India online.**

<br />

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Now-FFD600?style=for-the-badge&labelColor=0D0D0D)](https://clothmart.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/ajinkya-saivar/clothmart?style=for-the-badge&color=FFD600&labelColor=0D0D0D)](https://github.com/ajinkya-saivar/clothmart/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/ajinkya-saivar/clothmart?style=for-the-badge&color=FFD600&labelColor=0D0D0D)](https://github.com/ajinkya-saivar/clothmart/network)
[![License MIT](https://img.shields.io/badge/License-MIT-FFD600?style=for-the-badge&labelColor=0D0D0D)](./LICENSE)

<br />

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=flat-square&logo=razorpay&logoColor=3395FF)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)

</div>

---

## 📌 Table of Contents

- [The Problem](#-the-problem)
- [What is ClothMart](#-what-is-clothmart)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Build Journey](#-build-journey)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [About the Developer](#-about-the-developer)

---

## 🔥 The Problem

Thousands of offline cloth stores across India — in cities like **Badlapur, Ulhasnagar, Thane, Nashik** and beyond — have zero online presence. They lose customers every single day because people now search and shop online before visiting any store. Without a digital storefront, these businesses are completely invisible to the next generation of buyers.

**ClothMart solves this.**

Any cloth store owner can register their shop, list products with size and colour variants, and start selling online in minutes — without needing any technical knowledge.

---

## 💡 What is ClothMart?

ClothMart is a **full-stack MERN multi-store e-commerce platform** — a complete marketplace where:

- 🏪 **Store owners** create their digital shop, manage products and inventory, fulfil orders, apply discount coupons, and track sales through an analytics dashboard
- 🛍️ **Customers** discover cloth stores near them, browse products with powerful filters, add to cart, pay securely via Razorpay or COD, and track every order

> Built in public from Day 1. Every step documented publicly. 112 days. One complete, real-world product.

---

## ✨ Features

### 🛍️ Customer Side

| Feature              | Description                                                                     |
| -------------------- | ------------------------------------------------------------------------------- |
| 🏪 Store Discovery   | Browse all registered stores — search by name, filter by category, view ratings |
| 👕 Product Filtering | Filter by size, colour, price range — sort by price or newest                   |
| 🛒 Smart Cart        | Add items with size and colour selection, update quantity, persistent cart      |
| 🎟️ Coupon Codes      | Apply discount codes at checkout — supports percent and flat discounts          |
| 💳 Secure Payments   | Pay via UPI, debit/credit cards, net banking (Razorpay) or Cash on Delivery     |
| 📦 Order Tracking    | Real-time status — Pending → Confirmed → Shipped → Delivered                    |
| ❤️ Wishlist          | Save products for later, move to cart anytime                                   |
| ⭐ Product Reviews   | Rate and review products after a confirmed purchase                             |
| 👤 My Profile        | Manage multiple delivery addresses, update info, change password                |

### 🏢 Store Owner — Admin Dashboard

| Feature               | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| 📊 Dashboard Home     | Today's orders, monthly revenue, top products, low-stock alerts at a glance  |
| 📦 Product Management | Add, edit, delete products — multi-image upload, size/colour variants, stock |
| 🗂️ Order Management   | View all orders, filter by status, update order stage, generate invoices     |
| 📋 Inventory Tracking | Stock levels per variant, low-stock filter, inline bulk quantity update      |
| 📈 Sales Analytics    | Monthly revenue chart, weekly orders chart, top 5 products table (Recharts)  |
| 🎟️ Coupon System      | Create and manage discount codes with expiry dates and minimum order amounts |
| ⚙️ Store Settings     | Edit store name, logo, banner, address, business hours, and payment config   |

---

## 🛠️ Tech Stack

| Layer                | Technology            | Why This Choice                                                |
| -------------------- | --------------------- | -------------------------------------------------------------- |
| **Frontend**         | React.js + Vite       | Fast builds, component-based UI, Vite is 10× faster than CRA   |
| **Styling**          | Tailwind CSS          | Utility-first — build UI fast without leaving JSX              |
| **State Management** | Context API           | Global auth and cart state — no Redux needed                   |
| **Routing**          | React Router v6       | Client-side routing with protected role-based routes           |
| **HTTP Client**      | Axios                 | API calls with automatic JWT token attachment via interceptors |
| **Charts**           | Recharts              | Revenue and orders data visualization for analytics            |
| **Backend**          | Node.js + Express.js  | JavaScript everywhere, fast REST API setup                     |
| **Database**         | MongoDB + Mongoose    | Flexible schema — perfect for products with variants           |
| **Authentication**   | JWT (JSON Web Tokens) | Stateless, scalable token-based auth — industry standard       |
| **Password Hashing** | bcryptjs              | Secure password hashing — never store plain text               |
| **Image Upload**     | Cloudinary + Multer   | Free 25GB cloud storage, auto-resize, CDN delivery             |
| **Payments**         | Razorpay              | Best Indian payment gateway — UPI, cards, net banking          |
| **Validation**       | express-validator     | Clean request body validation with detailed error messages     |
| **Security**         | Helmet + Rate Limit   | HTTP security headers + brute-force attack protection          |
| **Deploy Frontend**  | Vercel                | Instant deploys, free tier, auto-deploy on push                |
| **Deploy Backend**   | Render                | Free Node.js hosting, auto-deploy from GitHub                  |
| **Database Cloud**   | MongoDB Atlas         | Free 512MB cloud database, no local setup needed               |

---

## 📁 Project Structure

```
clothmart/
│
├── client/                          ← React + Vite Frontend
│   ├── public/
│   └── src/
│       ├── pages/                   ← Route-level page components
│       │   ├── Home.jsx             ← Homepage with featured stores + products
│       │   ├── Stores.jsx           ← All stores listing with search
│       │   ├── StoreProfile.jsx     ← Individual store page with products
│       │   ├── Products.jsx         ← Product listing with filters + pagination
│       │   ├── ProductDetail.jsx    ← Product detail with gallery + variants
│       │   ├── Search.jsx           ← Search results page
│       │   ├── Login.jsx            ← Login page
│       │   ├── Register.jsx         ← Register as customer or store owner
│       │   ├── Cart.jsx             ← Shopping cart with coupon input
│       │   ├── Checkout.jsx         ← Address + payment + order placement
│       │   ├── Orders.jsx           ← Customer order history + tracking
│       │   ├── Wishlist.jsx         ← Saved products
│       │   ├── Profile.jsx          ← Edit profile + manage addresses
│       │   └── admin/
│       │       ├── Dashboard.jsx    ← Stats cards + recent orders
│       │       ├── Products.jsx     ← Product CRUD management table
│       │       ├── AddProduct.jsx   ← Add new product form
│       │       ├── EditProduct.jsx  ← Edit existing product form
│       │       ├── Orders.jsx       ← Order management + status updates
│       │       ├── Inventory.jsx    ← Stock levels + bulk update
│       │       ├── Analytics.jsx    ← Revenue + orders charts
│       │       └── Settings.jsx     ← Store info + coupon management
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   ├── StoreCard.jsx
│       │   ├── ProtectedRoute.jsx   ← Blocks unauthenticated access
│       │   ├── AdminLayout.jsx      ← Sidebar layout for admin pages
│       │   └── ...
│       ├── context/
│       │   ├── AuthContext.jsx      ← Global user login state
│       │   └── CartContext.jsx      ← Global cart state (persists to localStorage)
│       ├── hooks/                   ← Custom React hooks
│       └── utils/
│           └── api.js               ← Axios instance with JWT interceptor
│
└── server/                          ← Node.js + Express Backend
    ├── index.js                     ← Entry point — Express app + MongoDB connect
    ├── models/
    │   ├── User.js                  ← Users schema
    │   ├── Store.js                 ← Stores schema
    │   ├── Product.js               ← Products with variants schema
    │   ├── Order.js                 ← Orders with items array
    │   ├── Review.js                ← Product reviews
    │   └── Coupon.js                ← Discount coupons
    ├── routes/
    │   ├── auth.js                  ← /api/auth/*
    │   ├── users.js                 ← /api/users/*
    │   ├── stores.js                ← /api/stores/*
    │   ├── products.js              ← /api/products/*
    │   ├── orders.js                ← /api/orders/*
    │   ├── reviews.js               ← /api/reviews/*
    │   ├── coupons.js               ← /api/coupons/*
    │   ├── upload.js                ← /api/upload
    │   ├── payment.js               ← /api/payment/*
    │   └── analytics.js             ← /api/analytics/*
    ├── controllers/                 ← Business logic (separated from routes)
    ├── middleware/
    │   ├── auth.js                  ← Verifies JWT token
    │   ├── isOwner.js               ← Checks role === store_owner
    │   └── errorHandler.js          ← Global error handler
    └── config/
        ├── db.js                    ← MongoDB Atlas connection
        └── cloudinary.js            ← Cloudinary SDK config
```

---

## 🗃️ Database Schema

```javascript
// 1. USERS
{
  name: String,
  email: String,           // unique
  password: String,        // bcrypt hashed — NEVER plain text
  role: "customer" | "store_owner",
  phone: String,
  addresses: [{ street, city, state, pincode }],
  profileImage: String,    // Cloudinary URL
  createdAt: Date
}

// 2. STORES
{
  owner: ObjectId,         // → Users
  name: String,
  description: String,
  logo: String,            // Cloudinary URL
  banner: String,          // Cloudinary URL
  address: { street, city, state, pincode },
  category: "saree" | "kids" | "mens" | "ethnic" | "western",
  rating: Number,          // average from reviews
  isActive: Boolean
}

// 3. PRODUCTS
{
  store: ObjectId,         // → Stores
  name: String,
  description: String,
  price: Number,
  discountPrice: Number,   // optional sale price
  images: [String],        // array of Cloudinary URLs
  category: String,
  sizes: ["S","M","L","XL","XXL"],
  colors: [String],
  stock: Number,
  isActive: Boolean
}

// 4. ORDERS
{
  customer: ObjectId,      // → Users
  store: ObjectId,         // → Stores
  items: [{ product: ObjectId, qty, size, color, price }],
  totalAmount: Number,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
  paymentMethod: "razorpay" | "cod",
  paymentStatus: "paid" | "unpaid",
  deliveryAddress: { street, city, state, pincode },
  createdAt: Date
}

// 5. REVIEWS
{
  product: ObjectId,       // → Products
  customer: ObjectId,      // → Users
  rating: Number,          // 1 to 5
  comment: String,
  createdAt: Date
}

// 6. COUPONS
{
  store: ObjectId,         // → Stores
  code: String,            // e.g. "SAVE20"
  discountType: "percent" | "flat",
  discountValue: Number,
  minOrderAmount: Number,
  expiresAt: Date,
  isActive: Boolean
}
```

---

## 📡 API Reference

### 🔐 Auth & Users

| Method | Endpoint                 | Auth | Description                         |
| ------ | ------------------------ | ---- | ----------------------------------- |
| POST   | `/api/auth/register`     | ❌   | Register as customer or store owner |
| POST   | `/api/auth/login`        | ❌   | Login and receive JWT token         |
| GET    | `/api/users/me`          | ✅   | Get logged-in user profile          |
| PUT    | `/api/users/me`          | ✅   | Update name, phone, profile photo   |
| PUT    | `/api/users/password`    | ✅   | Change password                     |
| POST   | `/api/users/address`     | ✅   | Add a delivery address              |
| DELETE | `/api/users/address/:id` | ✅   | Remove a saved address              |

### 🏪 Stores

| Method | Endpoint          | Auth     | Description                                      |
| ------ | ----------------- | -------- | ------------------------------------------------ |
| GET    | `/api/stores`     | ❌       | Get all stores — supports `?search`, `?category` |
| GET    | `/api/stores/:id` | ❌       | Get single store with product listing            |
| POST   | `/api/stores`     | ✅ Owner | Create a new store                               |
| PUT    | `/api/stores/:id` | ✅ Owner | Update store information                         |

### 👕 Products

| Method | Endpoint            | Auth     | Description                                                                                      |
| ------ | ------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| GET    | `/api/products`     | ❌       | Get all — `?search`, `?category`, `?minPrice`, `?maxPrice`, `?sort`, `?page`, `?limit`, `?store` |
| GET    | `/api/products/:id` | ❌       | Get single product detail                                                                        |
| POST   | `/api/products`     | ✅ Owner | Create a new product                                                                             |
| PUT    | `/api/products/:id` | ✅ Owner | Update product                                                                                   |
| DELETE | `/api/products/:id` | ✅ Owner | Soft delete (sets `isActive: false`)                                                             |

### 📦 Orders

| Method | Endpoint                 | Auth        | Description                 |
| ------ | ------------------------ | ----------- | --------------------------- |
| POST   | `/api/orders`            | ✅ Customer | Place a new order           |
| GET    | `/api/orders/my`         | ✅ Customer | Get my order history        |
| GET    | `/api/orders/store`      | ✅ Owner    | Get all orders for my store |
| GET    | `/api/orders/:id`        | ✅          | Get single order details    |
| PUT    | `/api/orders/:id/status` | ✅ Owner    | Update order status         |

### 💳 Payments

| Method | Endpoint              | Auth | Description                       |
| ------ | --------------------- | ---- | --------------------------------- |
| POST   | `/api/payment/create` | ✅   | Create Razorpay order with amount |
| POST   | `/api/payment/verify` | ✅   | Verify Razorpay payment signature |

### ⭐ Reviews, Coupons & Analytics

| Method | Endpoint                      | Auth        | Description                            |
| ------ | ----------------------------- | ----------- | -------------------------------------- |
| POST   | `/api/reviews`                | ✅ Customer | Submit a product review                |
| GET    | `/api/reviews?product=id`     | ❌          | Get reviews for a product              |
| POST   | `/api/upload`                 | ✅ Owner    | Upload image → Cloudinary URL          |
| POST   | `/api/coupons`                | ✅ Owner    | Create a coupon code                   |
| POST   | `/api/coupons/validate`       | ✅          | Validate and calculate coupon discount |
| GET    | `/api/analytics/summary`      | ✅ Owner    | Dashboard stats cards                  |
| GET    | `/api/analytics/revenue`      | ✅ Owner    | Monthly revenue data for chart         |
| GET    | `/api/analytics/top-products` | ✅ Owner    | Top 5 selling products                 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- [MongoDB Atlas](https://mongodb.com/atlas) account (free)
- [Cloudinary](https://cloudinary.com) account (free)
- [Razorpay](https://razorpay.com) test account (free)

### 1 — Clone the repository

```bash
git clone https://github.com/ajinkya-saivar/clothmart.git
cd clothmart
```

### 2 — Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside `/server` — see [Environment Variables](#-environment-variables) below.

```bash
npm run dev
# ✅ Server starts at http://localhost:5000
# ✅ You should see: MongoDB connected!
```

### 3 — Setup the Frontend

```bash
cd client
npm install
```

Create a `.env` file inside `/client` — see [Environment Variables](#-environment-variables) below.

```bash
npm run dev
# ✅ App starts at http://localhost:5173
```

### 4 — Open in browser

```
Customer App  →  http://localhost:5173
Admin Panel   →  http://localhost:5173/admin   (login as store_owner)
Backend API   →  http://localhost:5000/api
```

---

## 🔑 Environment Variables

### `/server/.env`

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/clothmart

# JWT Authentication
JWT_SECRET=your_super_secret_key_minimum_32_characters

# Cloudinary — Image Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay — use TEST keys for development
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### `/client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
```

> ⚠️ **IMPORTANT:** Never commit `.env` files. Both are already listed in `.gitignore`.

---

## 🌐 Deployment

### Backend → [Render.com](https://render.com)

```
1. Go to render.com → New Web Service
2. Connect GitHub repo → Set root directory: server/
3. Build command:  npm install
   Start command:  node index.js
4. Add all environment variables from /server/.env
5. Deploy → your API is live at https://clothmart-api.onrender.com
```

### Frontend → [Vercel.com](https://vercel.com)

```
1. Go to vercel.com → Import GitHub repo
2. Set root directory: client/   |   Framework: Vite
3. Add environment variable:
   VITE_API_URL = https://clothmart-api.onrender.com/api
4. Deploy → live at https://clothmart.vercel.app
```

### Database → [MongoDB Atlas](https://mongodb.com/atlas)

```
Free M0 tier — 512MB storage
Whitelist IP: 0.0.0.0/0 (allow all) for Render compatibility
```

---

## 📅 Build Journey — 112 Days in Public

This entire project was built from scratch over **16 weeks**, committed and documented every single day.

| Phase       | Weeks   | Days      | What Was Built                                                    |
| ----------- | ------- | --------- | ----------------------------------------------------------------- |
| 🔵 Planning | 1 – 2   | 1 – 14    | Schema design, GitHub setup, API docs, wireframes, Notion board   |
| 🟢 Backend  | 3 – 6   | 15 – 42   | All 14 APIs — auth, products, orders, payments, upload, analytics |
| 🟣 Frontend | 7 – 10  | 43 – 70   | Complete customer-facing React UI — all pages + mobile responsive |
| 🟠 Admin    | 11 – 13 | 71 – 91   | Store owner dashboard — products, orders, inventory, analytics    |
| 🔴 Deploy   | 14 – 15 | 92 – 105  | Deployment, testing, performance optimisation, custom domain      |
| 🟡 Launch   | 16      | 106 – 112 | LinkedIn launch, resume, freelance pitch to local stores          |

---

## 🗺️ Roadmap — Version 2.0

- [ ] Real-time order notifications via WebSockets
- [ ] WhatsApp order alerts via Twilio API
- [ ] Super Admin panel — manage all stores on the platform
- [ ] React Native mobile app (Android + iOS)
- [ ] Subscription billing for store owners (Razorpay recurring)
- [ ] Multi-language support — Hindi, Marathi
- [ ] AI-powered product recommendations

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch — `git checkout -b feature/your-feature-name`
3. Commit your changes — `git commit -m 'feat: add your feature'`
4. Push to the branch — `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License** — see [`LICENSE`](./LICENSE) for full details.

---

## 👨‍💻 About the Developer

**Ajinkya Saivar**
Full-Stack MERN Developer · Badlapur, Maharashtra, India

I'm building real-world projects and documenting every step publicly. ClothMart is my proof that I don't just follow tutorials — I identify real problems and build real solutions from scratch.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/ajinkya-saivar)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/ajinkya-saivar)

---

<div align="center">

**⭐ If this project helped or inspired you — please star the repo. It genuinely means a lot.**

`#BuildInPublic` · `#MERNStack` · `#100DaysOfCode` · `#ClothMart` · `#IndianDeveloper`

_Built with ❤️ in Badlapur, Maharashtra, India_

</div>
