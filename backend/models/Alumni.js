// const mongoose = require('mongoose');

// const alumniSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   phone: {
//     type: String,
//   },
//   graduation_year: {
//     type: Number,
//     required: true,
//   },
//   major: {
//     type: String,
//     required: true,
//   },
//   current_company: {
//     type: String,
//   },
//   current_position: {
//     type: String,
//   },
//   linkedin_url: {
//     type: String,
//   },
//   bio: {
//     type: String,
//   },
//   status: {
//     type: String,
//     default: 'Active',
//   }
// }, { timestamps: true });

// const Alumni = mongoose.model('Alumni', alumniSchema);

// module.exports = Alumni;


const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    classYear: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    profession: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // Cloudinary URL
    },
    public_id: {
      type: String, // for Cloudinary deletion
    },
  },
  { timestamps: true }
);

// Indexes for search and filtering
alumniSchema.index({ name: "text", profession: "text", location: "text" });
alumniSchema.index({ classYear: 1 });

module.exports = mongoose.model("Alumni", alumniSchema);