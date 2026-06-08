const express = require("express");
const router = express.Router();
const NewsEvent = require("../models/NewsEvent");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ============================================
// MULTER CONFIGURATION (Images only)
// ============================================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "alumni-news-events",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage });

// ============================================
// VALID TYPES
// ============================================
const VALID_TYPES = ["news", "event"];

// ============================================
// POST / - Create news or event
// ============================================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, type, date, time, location, excerpt, content } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required." });
    }
    if (!type || !VALID_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: "Type must be 'news' or 'event'." });
    }
    if (type === "event") {
      if (!date) return res.status(400).json({ success: false, message: "Event requires a date." });
      if (!location || !location.trim()) return res.status(400).json({ success: false, message: "Event requires a location." });
    }

    const fileUrl = req.file ? (req.file.path || req.file.secure_url) : undefined;
    const filePublicId = req.file ? (req.file.filename || req.file.public_id) : undefined;

    const newItem = new NewsEvent({
      title: title.trim(),
      type,
      date: date ? new Date(date) : undefined,
      time,
      location: location?.trim(),
      excerpt: excerpt?.trim(),
      content: content?.trim(),
      image: fileUrl,
      public_id: filePublicId,
    });

    await newItem.save();

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: newItem,
    });
  } catch (error) {
    console.error("Create NewsEvent Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
});

// ============================================
// GET / - Fetch items with filters
// ============================================
router.get("/", async (req, res) => {
  try {
    const { type, search, limit = 100, skip = 0 } = req.query;

    const filter = {};

    // Filter by type
    if (type && VALID_TYPES.includes(type)) {
      filter.type = type;
    }

    // Search by title, excerpt, or content (case-insensitive)
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: regex },
        { excerpt: regex },
        { content: regex },
      ];
    }

    const items = await NewsEvent.find(filter)
      .sort({ date: -1, createdAt: -1 }) // newest first
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await NewsEvent.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: items,
      total,
      count: items.length,
    });
  } catch (error) {
    console.error("Fetch NewsEvents Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
});

// ============================================
// GET /:id - Single item
// ============================================
router.get("/:id", async (req, res) => {
  try {
    const item = await NewsEvent.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Fetch Single NewsEvent Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// PUT /:id - Update item (optional new image)
// ============================================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const item = await NewsEvent.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    const { title, type, date, time, location, excerpt, content } = req.body;

    if (title !== undefined) item.title = title.trim();
    if (type) {
      if (!VALID_TYPES.includes(type)) return res.status(400).json({ success: false, message: "Type must be 'news' or 'event'." });
      item.type = type;
    }
    if (date !== undefined) item.date = date ? new Date(date) : undefined;
    if (time !== undefined) item.time = time;
    if (location !== undefined) item.location = location.trim();
    if (excerpt !== undefined) item.excerpt = excerpt.trim();
    if (content !== undefined) item.content = content.trim();

    // If a new image is uploaded, delete the old one from Cloudinary
    if (req.file) {
      if (item.public_id) {
        await cloudinary.uploader.destroy(item.public_id);
      }
      item.image = req.file.path || req.file.secure_url;
      item.public_id = req.file.filename || req.file.public_id;
    }

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Item updated",
      data: item,
    });
  } catch (error) {
    console.error("Update NewsEvent Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
});

// ============================================
// DELETE /:id - Remove item and image
// ============================================
router.delete("/:id", async (req, res) => {
  try {
    const item = await NewsEvent.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    // Delete image from Cloudinary if exists
    if (item.public_id) {
      await cloudinary.uploader.destroy(item.public_id);
    }

    await NewsEvent.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete NewsEvent Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
});

module.exports = router;