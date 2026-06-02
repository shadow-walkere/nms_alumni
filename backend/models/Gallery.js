const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "All",
        "Weddings",
        "Food & Drinks",
        "Accommodation",
        "Team Building",
        "Picnics",
        "Adventure playground",
      ],
      default: "All",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", galleryImageSchema);
