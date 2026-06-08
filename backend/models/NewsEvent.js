const mongoose = require("mongoose");

const newsEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["news", "event"],
      required: true,
      default: "news",
    },
    date: {
      type: Date,
    },
    time: {
      type: String, // e.g., "10:00 AM - 4:00 PM"
    },
    location: {
      type: String,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
    },
    image: {
      type: String, // Cloudinary secure_url
    },
    public_id: {
      type: String, // Cloudinary public_id for deletion
    },
  },
  { timestamps: true }
);

// Text index for search
newsEventSchema.index({ title: "text", excerpt: "text", content: "text" });

// Optional: compound index for filtering by type & date
newsEventSchema.index({ type: 1, date: -1 });

module.exports = mongoose.model("NewsEvent", newsEventSchema);