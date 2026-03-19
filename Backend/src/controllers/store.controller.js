const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const storeModel = require("../models/store.model");

// ─── ImageKit ─────────────────────────────────
const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// ─── Upload helper ────────────────────────────
const uploadToImageKit = async (fileBuffer, fileName) => {
  const file = await imageKit.files.upload({
    file: await toFile(Buffer.from(fileBuffer), "file"),
    fileName,
    folder: "ClothMart_stores",
  });
  return file.url;
};

// ─────────────────────────────────────────────
// CREATE STORE
// POST /api/stores
// ─────────────────────────────────────────────
const createStore = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      street,
      city,
      state,
      pincode,
      phone,
      gst,
    } = req.body;

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

    // 4. Upload logo + banner (using upload.fields)
    // req.files = { logo: [file], banner: [file] }
    let logoUrl = "";
    let bannerUrl = "";

    if (req.files?.logo?.[0]) {
      logoUrl = await uploadToImageKit(
        req.files.logo[0].buffer,
        `store_logo_${Date.now()}`,
      );
    }

    if (req.files?.banner?.[0]) {
      bannerUrl = await uploadToImageKit(
        req.files.banner[0].buffer,
        `store_banner_${Date.now()}`,
      );
    }

    // 5. Create store
    const store = await storeModel.create({
      owner: req.user.id,
      name,
      description: description || "",
      logo: logoUrl,
      banner: bannerUrl,
      category: category || "other",
      phone: phone || "",
      gst: gst || "",
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
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;

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
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// GET SINGLE STORE
// GET /api/stores/:id
// ─────────────────────────────────────────────
const getStoreById = async (req, res) => {
  try {
    // Support both _id and slug
    const store = await storeModel
      .findOne({
        $or: [
          { _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null },
          { slug: req.params.id },
        ],
      })
      .populate("owner", "name email phone");

    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }

    res.status(200).json({ success: true, store });
  } catch (error) {
    console.error("Get store error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
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

    res.status(200).json({ success: true, store });
  } catch (error) {
    console.error("Get my store error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// UPDATE STORE
// PUT /api/stores/:id
// ─────────────────────────────────────────────
const updateStore = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      street,
      city,
      state,
      pincode,
      phone,
      gst,
    } = req.body;

    const store = await storeModel.findById(req.params.id);
    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }

    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this store",
      });
    }

    // Upload new logo/banner if sent
    let logoUrl;
    let bannerUrl;

    if (req.files?.logo?.[0]) {
      logoUrl = await uploadToImageKit(
        req.files.logo[0].buffer,
        `store_logo_${Date.now()}`,
      );
    }

    if (req.files?.banner?.[0]) {
      bannerUrl = await uploadToImageKit(
        req.files.banner[0].buffer,
        `store_banner_${Date.now()}`,
      );
    }

    // Build update with only provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (phone) updateData.phone = phone;
    if (gst) updateData.gst = gst;
    if (logoUrl) updateData.logo = logoUrl;
    if (bannerUrl) updateData.banner = bannerUrl;

    if (street || city || state || pincode) {
      updateData.address = {
        street: street || store.address.street,
        city: city || store.address.city,
        state: state || store.address.state,
        pincode: pincode || store.address.pincode,
      };
    }

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
    res.status(500).json({ success: false, message: "Server error" });
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
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }

    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this store",
      });
    }

    await storeModel.findByIdAndUpdate(req.params.id, { isActive: false });

    res
      .status(200)
      .json({ success: true, message: "Store deleted successfully" });
  } catch (error) {
    console.error("Delete store error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
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
