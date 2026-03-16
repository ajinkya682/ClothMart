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

// ─── Public routes ────────────────────────────
router.get("/", getAllStores);
router.get("/:id", getStoreById);

// ─── Protected routes ─────────────────────────
router.get("/my", authMiddleware, getMyStore);

router.post("/", authMiddleware, upload.single("logo"), createStore);

router.put("/:id", authMiddleware, upload.single("logo"), updateStore);

router.delete("/:id", authMiddleware, deleteStore);

module.exports = router;
