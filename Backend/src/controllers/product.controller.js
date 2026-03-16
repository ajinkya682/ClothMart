const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const productModel = require("../models/product.model");
const storeModel = require("../models/store.model");

// ─── ImageKit ─────────────────────────────────
const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// ─────────────────────────────────────────────
// CREATE PRODUCT
// POST /api/products
// ─────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      sizes,
      colors,
      stock,
    } = req.body;

    // 1. Only store_owner can create products
    if (req.user.role !== "store_owner") {
      return res.status(403).json({
        success: false,
        message: "Only store owners can add products",
      });
    }

    // 2. Validate required fields
    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, price and stock are required",
      });
    }

    // 3. Find owner's store
    const store = await storeModel.findOne({ owner: req.user.id });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store. Create a store first.",
      });
    }

    // 4. Upload multiple images if files sent
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await imageKit.files.upload({
          file: await toFile(Buffer.from(file.buffer), file.originalname),
          fileName: `product_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          folder: "ClothMart_products",
        });
        imageUrls.push(uploaded.url);
      }
    }

    // 5. Parse sizes and colors — sent as JSON string from form-data
    let parsedSizes = [];
    let parsedColors = [];

    if (sizes) {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    }
    if (colors) {
      parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors;
    }

    // 6. Create product
    const product = await productModel.create({
      store: store._id,
      name,
      description: description || "",
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      images: imageUrls,
      category: category || "",
      sizes: parsedSizes,
      colors: parsedColors,
      stock: Number(stock),
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────
// GET ALL PRODUCTS
// GET /api/products
// ─────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      store,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter
    const filter = { isActive: true };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (store) {
      filter.store = store;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const total = await productModel.countDocuments(filter);

    const products = await productModel
      .find(filter)
      .populate("store", "name logo address category")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// GET SINGLE PRODUCT
// GET /api/products/:id
// ─────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .populate("store", "name logo address category rating");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// GET MY STORE PRODUCTS
// GET /api/products/my
// ─────────────────────────────────────────────
const getMyProducts = async (req, res) => {
  try {
    // Find owner's store first
    const store = await storeModel.findOne({ owner: req.user.id });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "You do not have a store",
      });
    }

    const products = await productModel
      .find({ store: store._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get my products error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// UPDATE PRODUCT
// PUT /api/products/:id
// ─────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      sizes,
      colors,
      stock,
    } = req.body;

    // 1. Find product
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. Check owner — find owner's store
    const store = await storeModel.findOne({ owner: req.user.id });
    if (!store || store._id.toString() !== product.store.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }

    // 3. Upload new images if files sent
    let imageUrls = product.images; // keep existing images by default
    if (req.files && req.files.length > 0) {
      imageUrls = [];
      for (const file of req.files) {
        const uploaded = await imageKit.files.upload({
          file: await toFile(Buffer.from(file.buffer), file.originalname),
          fileName: `product_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          folder: "ClothMart_products",
        });
        imageUrls.push(uploaded.url);
      }
    }

    // 4. Parse sizes and colors
    let parsedSizes = product.sizes;
    let parsedColors = product.colors;

    if (sizes) {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    }
    if (colors) {
      parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors;
    }

    // 5. Build update — only sent fields
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (discountPrice !== undefined)
      updateData.discountPrice = Number(discountPrice);
    if (category) updateData.category = category;
    if (stock !== undefined) updateData.stock = Number(stock);
    updateData.images = imageUrls;
    updateData.sizes = parsedSizes;
    updateData.colors = parsedColors;

    const updatedProduct = await productModel
      .findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("store", "name logo");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// DELETE PRODUCT
// DELETE /api/products/:id
// ─────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check owner
    const store = await storeModel.findOne({ owner: req.user.id });
    if (!store || store._id.toString() !== product.store.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this product",
      });
    }

    // Soft delete
    await productModel.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─── EXPORT ──────────────────────────────────
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
};
