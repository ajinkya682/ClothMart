<div align="center">

# 🧵 ClothMart

### A production-grade, multi-store e-commerce platform that takes offline cloth stores in India online

<br />

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-FFD600?style=for-the-badge&labelColor=0D0D0D)](https://clothmart.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/ajinkya-saivar/clothmart?style=for-the-badge&color=FFD600&labelColor=0D0D0D)](https://github.com/ajinkya-saivar/clothmart/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/ajinkya-saivar/clothmart?style=for-the-badge&color=FFD600&labelColor=0D0D0D)](https://github.com/ajinkya-saivar/clothmart/network)
[![License MIT](https://img.shields.io/badge/License-MIT-FFD600?style=for-the-badge&labelColor=0D0D0D)](./LICENSE)
[![Build](https://img.shields.io/badge/Backend-Complete-22c55e?style=for-the-badge&labelColor=0D0D0D)](https://github.com/ajinkya-saivar/clothmart)

<br />

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=flat-square&logo=razorpay&logoColor=3395FF)
![ImageKit](https://img.shields.io/badge/ImageKit-FF6C37?style=flat-square&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

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
- [16-Week Roadmap](#-16-week-roadmap)
- [Progress Log](#-progress-log)
- [What I Learned](#-what-i-learned)
- [Contributing](#-contributing)
- [License](#-license)
- [About the Developer](#-about-the-developer)

---

## 🔥 The Problem

Thousands of offline cloth stores across India — in cities like **Badlapur, Ulhasnagar, Thane, Nashik** and beyond — have **zero online presence**. They lose customers every single day because people now search and shop online before visiting any store. Without a digital storefront, these businesses are completely invisible to the next generation of buyers.

**ClothMart solves this.**

Any cloth store owner can register, list products, and start selling online in minutes — no technical knowledge needed.

---

## 💡 What is ClothMart?

ClothMart is a **full-stack MERN multi-store e-commerce platform** — a complete marketplace where:

- 🏪 **Store owners** register their shop, manage products, fulfil orders, track inventory, and watch analytics
- 🛍️ **Customers** discover stores, browse products, filter by size/colour/price, add to cart, pay, and track orders

> **Built in public from Day 1. Every step committed to GitHub. 112 days. One real product.**

---

## ✨ Features

### 🛍️ Customer Side

| Feature              | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| 🏪 Store Discovery   | Browse all cloth stores — search, filter by category, view ratings |
| 👕 Product Filtering | Filter by size, colour, price range — sort by price or newest      |
| 🛒 Smart Cart        | Add items with size and colour selection, update quantity          |
| 🎟️ Coupon Codes      | Apply discount codes — percent or flat discounts                   |
| 💳 Secure Payments   | Razorpay (UPI, cards, net banking) + Cash on Delivery              |
| 📦 Order Tracking    | Real-time status — Pending → Confirmed → Shipped → Delivered       |
| ❤️ Wishlist          | Save products, move to cart anytime                                |
| ⭐ Product Reviews   | Rate and review products after purchase                            |
| 👤 My Profile        | Manage addresses, change password, upload photo                    |

### 🏢 Store Owner — Admin Dashboard

| Feature               | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| 📊 Dashboard          | Today's orders, monthly revenue, low stock alerts          |
| 📦 Product Management | Add/edit/delete products with multiple images and variants |
| 🗂️ Order Management   | View all orders, filter by status, update order stage      |
| 📋 Inventory Tracking | Stock levels per variant, bulk update                      |
| 📈 Sales Analytics    | Revenue charts, top products, orders over time             |
| 🎟️ Coupon System      | Create percent or flat discount codes with expiry          |
| ⚙️ Store Settings     | Edit store name, logo, address, hours                      |

---

## 🛠️ Tech Stack

| Layer                | Technology           | Why This Choice                           |
| -------------------- | -------------------- | ----------------------------------------- |
| **Frontend**         | React.js + Vite      | Fast builds, component-based UI           |
| **Styling**          | Tailwind CSS         | Utility-first, rapid development          |
| **State Management** | Context API          | Global auth and cart state                |
| **Routing**          | React Router v6      | Client-side routing with protected routes |
| **HTTP Client**      | Axios                | API calls with JWT interceptor            |
| **Charts**           | Recharts             | Analytics data visualization              |
| **Backend**          | Node.js + Express.js | REST API server                           |
| **Database**         | MongoDB + Mongoose   | Flexible schema for product variants      |
| **Authentication**   | JWT + Cookies        | Stateless, secure token auth              |
| **Password Hashing** | bcryptjs             | Secure hashing — never plain text         |
| **Image Upload**     | ImageKit + Multer    | Cloud CDN image storage                   |
| **Payments**         | Razorpay             | Best Indian payment gateway               |
| **Deploy Frontend**  | Vercel               | Auto-deploy from GitHub                   |
| **Deploy Backend**   | Render               | Free Node.js hosting                      |
| **Database Cloud**   | MongoDB Atlas        | Free 512MB cloud database                 |

---

## 📁 Project Structure

```
ClothMart/
│
├── server.js                        ← Entry point
│
├── src/                             ← Backend source
│   ├── app.js                       ← Express app
│   ├── config/
│   │   └── database.config.js       ← MongoDB Atlas connection
│   ├── controllers/
│   │   ├── auth.controller.js       ← Register, login, profile
│   │   ├── store.controller.js      ← Store CRUD
│   │   ├── product.controller.js    ← Product CRUD + filters
│   │   ├── order.controller.js      ← Place order, status updates
│   │   ├── review.controller.js     ← Reviews + rating update
│   │   ├── coupon.controller.js     ← Coupon create + validate
│   │   └── payment.controller.js    ← Razorpay create + verify
│   ├── middleware/
│   │   ├── auth.middleware.js       ← JWT verification
│   │   └── upload.middleware.js     ← Multer file handler
│   ├── models/
│   │   ├── auth.model.js            ← Users schema
│   │   ├── store.model.js           ← Stores schema
│   │   ├── product.model.js         ← Products schema
│   │   ├── order.model.js           ← Orders schema
│   │   ├── review.model.js          ← Reviews schema
│   │   ├── coupon.model.js          ← Coupons schema
│   │   └── payment.model.js         ← Payments schema
│   └── routes/
│       ├── auth.route.js
│       ├── store.route.js
│       ├── product.route.js
│       ├── order.route.js
│       ├── review.route.js
│       ├── coupon.route.js
│       └── payment.route.js
│
└── client/                          ← React frontend (coming soon)
    └── src/
        ├── pages/
        ├── components/
        ├── context/
        └── utils/
            └── api.js
```

---

## 🗃️ Database Schema

### 01 — Users

```js
{
  name:         String,          // Full name
  email:        String,          // Unique — used for login
  password:     String,          // bcrypt hashed
  role:         String,          // customer | store_owner
  phone:        String,
  addresses:    [{ street, city, state, pincode }],
  profileImage: String,          // ImageKit URL
  createdAt:    Date,            // Auto timestamps
  updatedAt:    Date
}
```

### 02 — Stores

```js
{
  owner:       ObjectId → Users,
  name:        String,           // Store display name
  description: String,
  logo:        String,           // ImageKit URL
  banner:      String,           // ImageKit URL
  address:     { street, city, state, pincode },
  category:    String,           // saree | kids | mens | ethnic | western
  rating:      Number,           // Average from reviews
  isActive:    Boolean           // Can be disabled
}
```

### 03 — Products

```js
{
  store:         ObjectId → Stores,
  name:          String,
  description:   String,
  price:         Number,         // Original price in INR
  discountPrice: Number,         // Sale price (optional)
  images:        [String],       // ImageKit URLs
  category:      String,
  sizes:         [String],       // ['S','M','L','XL','XXL']
  colors:        [String],       // ['Red','Blue',...]
  stock:         Number,         // Available quantity
  rating:        Number,         // Auto-updated from reviews
  isActive:      Boolean
}
```

### 04 — Orders

```js
{
  customer:        ObjectId → Users,
  store:           ObjectId → Stores,
  items:           [{ product, qty, size, color, price }],
  totalAmount:     Number,       // Final amount in INR
  status:          String,       // pending|confirmed|shipped|delivered|cancelled
  paymentMethod:   String,       // razorpay | cod
  paymentStatus:   String,       // paid | unpaid
  deliveryAddress: { street, city, state, pincode },
  couponCode:      String,
  discount:        Number
}
```

### 05 — Reviews

```js
{
  product:   ObjectId → Products,
  customer:  ObjectId → Users,
  rating:    Number,             // 1 to 5 stars
  comment:   String,
  createdAt: Date                // Auto timestamps
}
```

### 06 — Coupons

```js
{
  store:          ObjectId → Stores,
  code:           String,        // e.g. "SAVE20"
  discountType:   String,        // percent | flat
  discountValue:  Number,        // 20 = 20% or ₹20
  minOrderAmount: Number,
  expiresAt:      Date,
  isActive:       Boolean
}
```

### 07 — Payments

```js
{
  order:              ObjectId → Orders,
  customer:           ObjectId → Users,
  razorpayOrderId:    String,
  razorpayPaymentId:  String,
  razorpaySignature:  String,
  amount:             Number,
  currency:           String,    // INR
  status:             String     // created | paid | failed
}
```

---

## 📡 API Reference

### 🔐 Auth Routes

| Method | Endpoint                | Auth | Description                          |
| ------ | ----------------------- | ---- | ------------------------------------ |
| POST   | `/api/auth/register`    | ❌   | Register as customer or store owner  |
| POST   | `/api/auth/login`       | ❌   | Login and receive JWT token + cookie |
| POST   | `/api/auth/logout`      | ✅   | Logout and clear cookie              |
| GET    | `/api/auth/me`          | ✅   | Get logged-in user profile           |
| PUT    | `/api/auth/me`          | ✅   | Update name, phone, profile image    |
| PUT    | `/api/auth/password`    | ✅   | Change password                      |
| POST   | `/api/auth/address`     | ✅   | Add delivery address                 |
| DELETE | `/api/auth/address/:id` | ✅   | Remove a saved address               |

### 🏪 Store Routes

| Method | Endpoint          | Auth     | Description                            |
| ------ | ----------------- | -------- | -------------------------------------- |
| GET    | `/api/stores`     | ❌       | Get all stores — `?search` `?category` |
| GET    | `/api/stores/my`  | ✅       | Get owner's own store                  |
| GET    | `/api/stores/:id` | ❌       | Get single store detail                |
| POST   | `/api/stores`     | ✅ Owner | Create a new store                     |
| PUT    | `/api/stores/:id` | ✅ Owner | Update store info                      |
| DELETE | `/api/stores/:id` | ✅ Owner | Soft delete store                      |

### 👕 Product Routes

| Method | Endpoint            | Auth     | Description                                                                               |
| ------ | ------------------- | -------- | ----------------------------------------------------------------------------------------- |
| GET    | `/api/products`     | ❌       | Get all — `?search` `?category` `?store` `?minPrice` `?maxPrice` `?sort` `?page` `?limit` |
| GET    | `/api/products/my`  | ✅ Owner | Get my store's products                                                                   |
| GET    | `/api/products/:id` | ❌       | Get single product                                                                        |
| POST   | `/api/products`     | ✅ Owner | Create product with images                                                                |
| PUT    | `/api/products/:id` | ✅ Owner | Update product                                                                            |
| DELETE | `/api/products/:id` | ✅ Owner | Soft delete product                                                                       |

### 📦 Order Routes

| Method | Endpoint                 | Auth        | Description                             |
| ------ | ------------------------ | ----------- | --------------------------------------- |
| POST   | `/api/orders`            | ✅ Customer | Place a new order                       |
| GET    | `/api/orders/my`         | ✅ Customer | Get my order history                    |
| GET    | `/api/orders/store`      | ✅ Owner    | Get all orders for my store — `?status` |
| GET    | `/api/orders/:id`        | ✅          | Get single order details                |
| PUT    | `/api/orders/:id/status` | ✅ Owner    | Update order status                     |
| PUT    | `/api/orders/:id/cancel` | ✅ Customer | Cancel pending order                    |

### ⭐ Review Routes

| Method | Endpoint           | Auth        | Description                         |
| ------ | ------------------ | ----------- | ----------------------------------- |
| GET    | `/api/reviews`     | ❌          | Get reviews — `?product=id`         |
| GET    | `/api/reviews/my`  | ✅          | Get my reviews                      |
| POST   | `/api/reviews`     | ✅ Customer | Submit review (must have purchased) |
| PUT    | `/api/reviews/:id` | ✅ Customer | Update own review                   |
| DELETE | `/api/reviews/:id` | ✅ Customer | Delete own review                   |

### 🎟️ Coupon Routes

| Method | Endpoint                  | Auth     | Description                   |
| ------ | ------------------------- | -------- | ----------------------------- |
| GET    | `/api/coupons`            | ✅ Owner | Get my store's coupons        |
| POST   | `/api/coupons`            | ✅ Owner | Create a coupon               |
| POST   | `/api/coupons/validate`   | ✅       | Validate + calculate discount |
| PUT    | `/api/coupons/:id`        | ✅ Owner | Update coupon                 |
| PUT    | `/api/coupons/:id/toggle` | ✅ Owner | Toggle active/inactive        |
| DELETE | `/api/coupons/:id`        | ✅ Owner | Delete coupon                 |

### 💳 Payment Routes

| Method | Endpoint                | Auth | Description              |
| ------ | ----------------------- | ---- | ------------------------ |
| POST   | `/api/payment/create`   | ✅   | Create Razorpay order    |
| POST   | `/api/payment/verify`   | ✅   | Verify payment signature |
| GET    | `/api/payment/:orderId` | ✅   | Get payment details      |

---

## 🚀 Getting Started

### Prerequisites

```
Node.js v18+
npm v9+
MongoDB Atlas account — atlas.mongodb.com (free)
ImageKit account    — imagekit.io (free)
Razorpay account    — razorpay.com (test mode, free)
```

### 1 — Clone the repository

```bash
git clone https://github.com/ajinkya-saivar/clothmart.git
cd clothmart
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Create `.env` file

```bash
cp .env.example .env
# Fill in all values — see Environment Variables below
```

### 4 — Run the server

```bash
npm run dev
```

You should see:

```
✅ MongoDB connected!
✅ Server running on port 5000
✅ Test URL → http://localhost:5000
```

### 5 — Test in Postman

```
Open Postman
POST http://localhost:5000/api/auth/register
Body → form-data with name, email, password, role
```

---

## 🔑 Environment Variables

Create a `.env` file in the root folder:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/ClothMart

# JWT Authentication
JWT_SECRET=clothmart_super_secret_jwt_key_2026

# ImageKit — Image Upload
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Razorpay — use TEST keys for development
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

> ⚠️ **NEVER commit `.env` to GitHub** — it is in `.gitignore`

---

## 🌐 Deployment

### Backend → Render.com

```
1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Root directory: ./  (or where server.js is)
4. Build command:  npm install
   Start command:  node server.js
5. Add all environment variables
6. Deploy → live at https://clothmart-api.onrender.com
```

### Frontend → Vercel.com

```
1. Go to vercel.com → Import GitHub repo
2. Root directory: client/
3. Framework: Vite
4. Add env variable:
   VITE_API_URL = https://clothmart-api.onrender.com/api
5. Deploy → live at https://clothmart.vercel.app
```

---

## 📅 16-Week Roadmap

| Phase                     | Weeks | Days    | What Was Built                                                          |
| ------------------------- | ----- | ------- | ----------------------------------------------------------------------- |
| 🔵 **Phase 1 — Planning** | 1–2   | 1–14    | Schema design, folder structure, GitHub setup, Notion board, wireframes |
| 🟢 **Phase 2 — Backend**  | 3–6   | 15–42   | Auth, Store, Product, Order, Review, Coupon, Payment APIs — all tested  |
| 🟣 **Phase 3 — Frontend** | 7–10  | 43–70   | React UI — Homepage, products, cart, checkout, orders, profile          |
| 🟠 **Phase 4 — Admin**    | 11–13 | 71–91   | Admin dashboard — products, orders, inventory, analytics                |
| 🔴 **Phase 5 — Deploy**   | 14–15 | 92–105  | Vercel + Render + MongoDB Atlas deployment + testing                    |
| 🟡 **Phase 6 — Launch**   | 16    | 106–112 | LinkedIn launch, resume update, freelance pitch                         |

---

## 📈 Progress Log

| Day       | What I built                                                                         |
| --------- | ------------------------------------------------------------------------------------ |
| Day 1 ✅  | Project scope defined, schema designed, GitHub repo created, folder structure set up |
| Day 2 ✅  | MongoDB Atlas connected, Express server running, User model created                  |
| Day 3 ✅  | Auth API complete — register, login, JWT cookies, ImageKit profile image upload      |
| Day 4 ✅  | Store API complete — CRUD with logo upload, search and category filter               |
| Day 5 ✅  | Product API complete — CRUD with multi-image upload, filters, search, pagination     |
| Day 6 ✅  | Order API complete — place order, stock management, status updates, cancel           |
| Day 7 ✅  | Review API complete — purchase verification, rating auto-update, CRUD                |
| Day 8 ✅  | Coupon API complete — percent/flat discount, validate, toggle, expiry check          |
| Day 9 ✅  | Payment API complete — Razorpay create + verify, signature validation                |
| Day 10 ⏳ | Analytics API                                                                        |

---

## 💡 What I Learned

- Always validate inputs **before** uploading files — never waste API calls
- `httpOnly` cookies are more secure than `localStorage` for storing JWT tokens
- MongoDB indexes persist even after removing the field from schema — must drop manually
- `multer` must be on the route **before** the controller for `req.file` to work
- Never save plain text passwords — always hash with `bcrypt` before storing
- Use `$inc` operator for stock management — atomic, prevents race conditions
- `populate()` in Mongoose is powerful but adds DB queries — use only when needed
- Always use `process.exit(1)` if MongoDB fails to connect — fail loudly and early
- Soft delete with `isActive: false` is better than hard delete — data is recoverable
- Test every route in Postman **before** building React — backend must be solid first

---

## 🐛 Bugs I Fixed

| Bug                                     | Root Cause                          | Fix                                       |
| --------------------------------------- | ----------------------------------- | ----------------------------------------- |
| `app.listen is not a function`          | Forgot to call `express()`          | Added `const app = express()`             |
| `req.body is undefined`                 | Missing `express.json()` middleware | Added before all routes                   |
| `imageKit.uploadFile is not a function` | Wrong method name                   | Changed to `imageKit.files.upload()`      |
| `E11000 duplicate key username_1`       | Old index stayed in MongoDB         | Dropped index from Atlas manually         |
| `Cannot destructure req.body`           | Multer missing on form-data route   | Added `upload.single()` to register route |
| Token not saving in cookie              | `cookie-parser` missing             | Added `app.use(cookieParser())`           |
| `No token — Access denied`              | Authorization header wrong format   | Added `Bearer ` prefix correctly          |

---

## 🗺️ Roadmap v2.0

- [ ] Real-time order notifications via WebSockets
- [ ] WhatsApp order alerts via Twilio
- [ ] Super Admin panel — manage all stores
- [ ] React Native mobile app (Android + iOS)
- [ ] Subscription billing for store owners
- [ ] Multi-language support — Hindi, Marathi
- [ ] AI-powered product recommendations

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create feature branch — `git checkout -b feature/amazing-feature`
3. Commit — `git commit -m 'feat: add amazing feature'`
4. Push — `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License** — see [`LICENSE`](./LICENSE) for details.

---

## 👨‍💻 About the Developer

**Ajinkya Saivar**
Full-Stack MERN Developer · Badlapur, Maharashtra, India

I am building real-world projects and documenting every step publicly. ClothMart is my proof that I do not just follow tutorials — I identify real problems and build complete solutions from scratch.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ajinkya-saivar)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ajinkya-saivar)

---

<div align="center">

**⭐ If this project helped or inspired you — please star the repo**

`#BuildInPublic` · `#MERNStack` · `#100DaysOfCode` · `#ClothMart` · `#IndianDeveloper`

_Built with ❤️ in Badlapur, Maharashtra, India — March 2026_

</div>
