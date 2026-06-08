const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ============================================
// MULTER CONFIGURATION
// ============================================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "alumni-gallery",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "webm"],
  },
});
const upload = multer({ storage });

// ============================================
// ALLOWED ALUMNI CATEGORIES
// ============================================
const ALLOWED_CATEGORIES = ["all", "reunions", "networking", "achievements"];

// ============================================
// POST /upload – Upload new media
// ============================================
router.post("/upload", upload.single("media"), async (req, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");

    const category = (req.body.category || "all").toLowerCase();
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(", ")}`,
      });
    }

    const fileUrl = req.file.path || req.file.secure_url;
    const filePublicId = req.file.filename || req.file.public_id;
    const mediaType = req.file.resource_type || (req.file.mimetype?.startsWith("video/") ? "video" : "image");

    const newMedia = new Gallery({
      title: req.body.title || "Untitled Media",
      type: mediaType,
      url: fileUrl,
      public_id: filePublicId,
      category,
      uploadedBy: req.body.uploadedBy || "admin",
    });

    await newMedia.save();

    return res.status(201).json({
      success: true,
      message: "Media uploaded successfully",
      data: newMedia,
    });
  } catch (error) {
    console.error("Gallery Upload Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET /categories – Allowed category list
// ============================================
router.get("/categories", (req, res) => {
  return res.status(200).json({
    success: true,
    data: ALLOWED_CATEGORIES.filter((c) => c !== "all"),
  });
});

// ============================================
// GET / – Fetch media with filters
// ============================================
router.get("/", async (req, res) => {
  try {
    const { type, category, search, limit = 100, skip = 0 } = req.query;
    const filter = {};

    if (type && ["image", "video"].includes(type)) filter.type = type;
    if (category && category !== "all") filter.category = category.toLowerCase();
    if (search && search.trim()) filter.title = { $regex: search, $options: "i" };

    const media = await Gallery.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    const total = await Gallery.countDocuments(filter);

    return res.status(200).json({ success: true, data: media, total, count: media.length });
  } catch (error) {
    console.error("Fetch Gallery Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET /latest – Latest N items
// ============================================
router.get("/latest", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const media = await Gallery.find().sort({ createdAt: -1 }).limit(limit);
    return res.status(200).json({ success: true, data: media });
  } catch (error) {
    console.error("Fetch Latest Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET /category/:category – Media by category
// ============================================
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }
    const filter = category === "all" ? {} : { category };
    const media = await Gallery.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: media });
  } catch (error) {
    console.error("Fetch by Category Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET /:id – Single media
// ============================================
router.get("/:id", async (req, res) => {
  try {
    const media = await Gallery.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: "Media not found" });
    return res.status(200).json({ success: true, data: media });
  } catch (error) {
    console.error("Fetch Single Media Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// PUT /:id – Update media info
// ============================================
router.put("/:id", async (req, res) => {
  try {
    const { title, category } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (category) {
      const cat = category.toLowerCase();
      if (!ALLOWED_CATEGORIES.includes(cat)) {
        return res.status(400).json({ success: false, message: "Invalid category" });
      }
      updates.category = cat;
    }
    updates.updatedAt = Date.now();

    const media = await Gallery.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!media) return res.status(404).json({ success: false, message: "Media not found" });
    return res.status(200).json({ success: true, data: media });
  } catch (error) {
    console.error("Update Media Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DELETE /:id – Remove media
// ============================================
router.delete("/:id", async (req, res) => {
  try {
    const media = await Gallery.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: "Media not found" });

    if (media.public_id) {
      await cloudinary.uploader.destroy(media.public_id, {
        resource_type: media.type === "video" ? "video" : "image",
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Media deleted successfully" });
  } catch (error) {
    console.error("Delete Media Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;