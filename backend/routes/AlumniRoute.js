const express = require("express");
const router = express.Router();
const Alumni = require("../models/Alumni");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Multer / Cloudinary config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "alumni-directory",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage });

// POST / – add alumni
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, classYear, email, phone, location, profession } = req.body;
    if (!name || !classYear) {
      return res.status(400).json({ success: false, message: "Name and class year are required." });
    }

    const newAlumni = new Alumni({
      name: name.trim(),
      classYear: parseInt(classYear),
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
      location: location?.trim() || undefined,
      profession: profession?.trim() || undefined,
      image: req.file ? (req.file.path || req.file.secure_url) : undefined,
      public_id: req.file ? (req.file.filename || req.file.public_id) : undefined,
    });

    await newAlumni.save();
    res.status(201).json({ success: true, data: newAlumni });
  } catch (error) {
    console.error("Alumni create error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET / – search & filter by classYear
router.get("/", async (req, res) => {
  try {
    const { classYear, search, limit = 200, skip = 0 } = req.query;
    const filter = {};

    if (classYear) filter.classYear = parseInt(classYear);

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: regex },
        { profession: regex },
        { location: regex },
        { email: regex },
      ];
    }

    const alumni = await Alumni.find(filter)
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Alumni.countDocuments(filter);
    res.status(200).json({ success: true, data: alumni, total, count: alumni.length });
  } catch (error) {
    console.error("Fetch alumni error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /classes – list distinct class years
router.get("/classes", async (req, res) => {
  try {
    const classes = await Alumni.distinct("classYear");
    classes.sort((a, b) => a - b);
    res.status(200).json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /:id – single alumni
router.get("/:id", async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /:id – update
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ success: false, message: "Not found" });

    const { name, classYear, email, phone, location, profession } = req.body;
    if (name !== undefined) alumni.name = name.trim();
    if (classYear) alumni.classYear = parseInt(classYear);
    if (email !== undefined) alumni.email = email.trim() || undefined;
    if (phone !== undefined) alumni.phone = phone.trim() || undefined;
    if (location !== undefined) alumni.location = location.trim() || undefined;
    if (profession !== undefined) alumni.profession = profession.trim() || undefined;

    // Replace image if new one uploaded
    if (req.file) {
      if (alumni.public_id) {
        await cloudinary.uploader.destroy(alumni.public_id);
      }
      alumni.image = req.file.path || req.file.secure_url;
      alumni.public_id = req.file.filename || req.file.public_id;
    }

    await alumni.save();
    res.status(200).json({ success: true, data: alumni });
  } catch (error) {
    console.error("Alumni update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /:id
router.delete("/:id", async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ success: false, message: "Not found" });

    if (alumni.public_id) {
      await cloudinary.uploader.destroy(alumni.public_id);
    }
    await Alumni.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;