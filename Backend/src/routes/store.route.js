const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {
  createStore,
  getAllStores,
  getStoreById,
  getMyStore,
  updateStore,
  deleteStore,
} = require("../controllers/store.controller");

// ── Public routes ──────────────────────────────────────────────────────────
router.get("/", getAllStores);

// ── Protected routes ───────────────────────────────────────────────────────
// IMPORTANT: /my must come BEFORE /:id or Express will treat "my" as an id
router.get("/my", authMiddleware, getMyStore);
router.get("/:id", getStoreById);

// upload.fields accepts both logo and banner files
const storeUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

router.post("/", authMiddleware, storeUpload, createStore);
router.put("/:id", authMiddleware, storeUpload, updateStore);
router.delete("/:id", authMiddleware, deleteStore);

module.exports = router;
