const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const storeModel = require("../models/store.model");

// ─── ImageKit ─────────────────────────────────
const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// ─────────────────────────────────────────────
// CREATE STORE
// POST /api/stores
// ─────────────────────────────────────────────
const createStore = async (req, res) => {
  try {
    const { name, description, category, street, city, state, pincode } =
      req.body;

    // 1. Only store_owner can create
    if (req.user.role !== "store_owner") {
      return res.status(403).json({
        success: false,
        message: "Only store owners can create a store",
      });
    }

    // 2. Name is required
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Store name is required",
      });
    }

    // 3. One store per owner
    const existingStore = await storeModel.findOne({ owner: req.user.id });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "You already have a store",
      });
    }

    // 4. Upload logo if file sent
    let logoUrl = "";
    if (req.file) {
      const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: `store_logo_${Date.now()}`,
        folder: "ClothMart_stores",
      });
      logoUrl = file.url;
    }

    // 5. Create store
    const store = await storeModel.create({
      owner: req.user.id,
      name,
      description: description || "",
      logo: logoUrl,
      category: category || "other",
      address: {
        street: street || "",
        city: city || "",
        state: state || "",
        pincode: pincode || "",
      },
    });

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    console.error("Create store error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────
// GET ALL STORES
// GET /api/stores
// ─────────────────────────────────────────────
const getAllStores = async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    const stores = await storeModel
      .find(filter)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stores.length,
      stores,
    });
  } catch (error) {
    console.error("Get stores error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// GET SINGLE STORE
// GET /api/stores/:id
// ─────────────────────────────────────────────
const getStoreById = async (req, res) => {
  try {
    const store = await storeModel
      .findById(req.params.id)
      .populate("owner", "name email phone");

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    console.error("Get store error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// GET MY STORE
// GET /api/stores/my
// ─────────────────────────────────────────────
const getMyStore = async (req, res) => {
  try {
    const store = await storeModel
      .findOne({ owner: req.user.id })
      .populate("owner", "name email phone");

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store yet",
      });
    }

    res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    console.error("Get my store error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// UPDATE STORE
// PUT /api/stores/:id
// ─────────────────────────────────────────────
const updateStore = async (req, res) => {
  try {
    const { name, description, category, street, city, state, pincode } =
      req.body;

    // 1. Find store
    const store = await storeModel.findById(req.params.id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // 2. Only owner can update
    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this store",
      });
    }

    // 3. Upload new logo if file sent
    let logoUrl;
    if (req.file) {
      const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: `store_logo_${Date.now()}`,
        folder: "ClothMart_stores",
      });
      logoUrl = file.url;
    }

    // 4. Build update — only sent fields
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (logoUrl) updateData.logo = logoUrl;

    if (street || city || state || pincode) {
      updateData.address = {
        street: street || store.address.street,
        city: city || store.address.city,
        state: state || store.address.state,
        pincode: pincode || store.address.pincode,
      };
    }

    // 5. Update
    const updatedStore = await storeModel
      .findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("owner", "name email");

    res.status(200).json({
      success: true,
      message: "Store updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Update store error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// DELETE STORE
// DELETE /api/stores/:id
// ─────────────────────────────────────────────
const deleteStore = async (req, res) => {
  try {
    const store = await storeModel.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Only owner can delete
    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this store",
      });
    }

    // Soft delete — just set isActive false
    await storeModel.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    console.error("Delete store error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─── EXPORT ──────────────────────────────────
module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  getMyStore,
  updateStore,
  deleteStore,
};
