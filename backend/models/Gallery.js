const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "Untitled Media",
    },
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "all",            // Default / uncategorised
        "reunions",       // Class reunions, homecoming
        "networking",     // Professional meetups, mentoring
        "achievements",   // Awards, milestones, success stories
        "leadership",
      ],
      default: "all",
      lowercase: true,
    },
    uploadedBy: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

// Full-text search for title, plus index on category
gallerySchema.index({ title: "text", category: 1 });

module.exports = mongoose.model("Gallery", gallerySchema);