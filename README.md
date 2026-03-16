# 🧵 ClothMart — Day 1 Progress Log

> **Building in Public** | Day 1 of 112 | March 2026
> Built by **Ajinkya Saivar** — Full-Stack MERN Developer from Badlapur, Maharashtra

---

## 🔥 What I Built Today — Day 1

Today was the **most important day** of this project. I set up the entire backend foundation from scratch — auth system, database, image upload, and cookie-based sessions. Everything is working and tested in Postman.

---

## ✅ Completed Today

### 🏗️ Project Structure Setup

- Created full MERN project folder structure
- Separated `server.js` (entry point) from `src/app.js` (Express app)
- Set up `src/config/database.config.js` for MongoDB Atlas connection
- Configured `.env` file with all environment variables
- Set up `nodemon` for auto-restart on file changes

### 🔐 Complete Auth System — 8 Routes

- `POST /api/auth/register` — Register as **Customer** or **Store Owner**
- `POST /api/auth/login` — Login and receive JWT token
- `POST /api/auth/logout` — Logout and clear cookie
- `GET  /api/auth/me` — Get logged-in user profile
- `PUT  /api/auth/me` — Update name, phone, profile image
- `PUT  /api/auth/password` — Change password with old password verification
- `POST /api/auth/address` — Add delivery address to profile
- `DELETE /api/auth/address/:id` — Remove a saved address

### 🖼️ Image Upload — ImageKit Integration

- Integrated `@imagekit/nodejs` for cloud image storage
- Profile image uploads on register and profile update
- Images stored in `ClothMart_users/` folder on ImageKit CDN
- Using `multer` with `memoryStorage` for file handling

### 🍪 JWT + Cookie Authentication

- JWT tokens generated on register and login
- Token saved in **httpOnly cookie** (secure, XSS-proof)
- Token also returned in response body for React localStorage
- `cookie-parser` middleware reads cookies on every request
- Auth middleware checks **cookie first**, then Authorization header

### 🛡️ Security Features

- Passwords hashed with `bcryptjs` — never stored as plain text
- JWT tokens expire in 7 days
- `httpOnly` cookies prevent JavaScript access
- Role-based access — `customer` vs `store_owner`

### 🗃️ MongoDB User Schema

```
Users {
  name         String    required
  email        String    unique, required
  password     String    bcrypt hashed
  role         String    customer | store_owner
  phone        String    optional
  addresses    Array     [{street, city, state, pincode}]
  profileImage String    ImageKit CDN URL
  createdAt    Date      auto
  updatedAt    Date      auto
}
```

### 📁 Files Created Today

```
ClothMart/
├── server.js
└── src/
    ├── app.js
    ├── config/
    │   └── database.config.js
    ├── controllers/
    │   └── auth.controller.js
    ├── middleware/
    │   ├── auth.middleware.js
    │   └── upload.middleware.js
    ├── models/
    │   └── auth.model.js
    └── routes/
        └── auth.route.js
```

---

## 🧪 All Tests Passed in Postman

| Route                   | Method | Status         |
| ----------------------- | ------ | -------------- |
| `/api/auth/register`    | POST   | ✅ 201 Created |
| `/api/auth/login`       | POST   | ✅ 200 OK      |
| `/api/auth/logout`      | POST   | ✅ 200 OK      |
| `/api/auth/me`          | GET    | ✅ 200 OK      |
| `/api/auth/me`          | PUT    | ✅ 200 OK      |
| `/api/auth/password`    | PUT    | ✅ 200 OK      |
| `/api/auth/address`     | POST   | ✅ 200 OK      |
| `/api/auth/address/:id` | DELETE | ✅ 200 OK      |

### Error cases also tested:

- ✅ Duplicate email → `400 Email already registered`
- ✅ Wrong password → `401 Incorrect password`
- ✅ No token → `403 Access denied`
- ✅ Invalid token → `401 Token expired`
- ✅ Missing fields → `400 Fields required`

---

## 🛠️ Tech Used Today

| Package            | Version | Purpose               |
| ------------------ | ------- | --------------------- |
| `express`          | latest  | Web server framework  |
| `mongoose`         | latest  | MongoDB ODM           |
| `bcryptjs`         | latest  | Password hashing      |
| `jsonwebtoken`     | latest  | JWT auth tokens       |
| `@imagekit/nodejs` | latest  | Cloud image upload    |
| `multer`           | latest  | File upload handler   |
| `cookie-parser`    | latest  | Read cookies          |
| `cors`             | latest  | Cross-origin requests |
| `dotenv`           | latest  | Environment variables |
| `nodemon`          | latest  | Dev auto-restart      |

---

## 🐛 Bugs I Fixed Today

1. **`app.listen is not a function`** — forgot to call `express()` to create app instance
2. **`req.body is undefined`** — `express.json()` was missing before routes
3. **`imageKit.uploadFile is not a function`** — wrong method name, fixed to `imageKit.files.upload()`
4. **`E11000 duplicate key — username_1`** — old index from previous schema, dropped it from MongoDB Atlas
5. **`Cannot destructure 'name' of req.body`** — multer was missing on register route, `req.body` was `undefined` for `form-data`

---

## 📊 Day 1 Numbers

```
Files created    →   7
Routes built     →   8
Bugs fixed       →   5
Tests passed     →   13
Hours coded      →   1 day
Commits made     →   ✅
```

---

## 🗺️ What's Next — Day 2

- [ ] Build `Store` model and schema
- [ ] `POST /api/stores` — store owner creates their shop
- [ ] `GET  /api/stores` — public store listing with search + filter
- [ ] `GET  /api/stores/:id` — single store detail
- [ ] `PUT  /api/stores/:id` — owner updates store info
- [ ] `GET  /api/stores/my` — owner sees their own store
- [ ] Test all store routes in Postman

---

## 💡 What I Learned Today

- Always validate inputs **before** uploading files — don't waste API calls
- `httpOnly` cookies are more secure than `localStorage` for tokens
- MongoDB indexes persist even after you remove the field from schema — must drop manually
- `multer` must be on the route **before** the controller for `req.file` to work
- Always use `process.exit(1)` if MongoDB fails to connect — fail loudly

---

## 📈 Progress Log

| Day      | What I built                                                                                |
| -------- | ------------------------------------------------------------------------------------------- |
| Day 1 ✅ | Project setup, complete Auth API (8 routes), ImageKit upload, JWT cookies, all tests passed |
| Day 2 ⏳ | Store API                                                                                   |

---

## 🔗 Links

- **GitHub:** [github.com/ajinkya-saivar/clothmart](https://github.com/ajinkya-saivar/clothmart)
- **LinkedIn:** [linkedin.com/in/ajinkya-saivar](https://linkedin.com/in/ajinkya-saivar)

---

< align="center">

`#BuildInPublic` · `#MERNStack` · `#100DaysOfCode` · `#ClothMart` · `#NodeJS` · `#IndianDeveloper`

_Day 1 of 112 — Badlapur, Maharashtra, India_
