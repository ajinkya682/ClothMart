const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateMe,
  changePassword,
  addAddress,
  deleteAddress,
} = require("../controllers/auth.controller");

router.post("/register", upload.single("profileImage"), registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", authMiddleware, getMe);

router.put("/me", authMiddleware, upload.single("profileImage"), updateMe);

router.put("/password", authMiddleware, changePassword);

router.post("/address", authMiddleware, addAddress);

router.delete("/address/:addressId", authMiddleware, deleteAddress);

module.exports = router;
