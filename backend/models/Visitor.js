// const mongoose = require("mongoose");

// const visitorSchema = new mongoose.Schema(
//   {
//     date: {
//       type: String, // Store date in YYYY-MM-DD format
//       required: true, // Make sure this is provided
//       unique: true, // Ensure one entry per date
//     },
//     day: {
//       type: String, // Additional field for the day (e.g., Monday, Tuesday)
//       required: true,
//     },
//     visitorCount: {
//       type: Number,
//       default: 0,
//     },
//     loggedInUserCount: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// const Visitor = mongoose.model("Visitor", visitorSchema);

// module.exports = Visitor;


const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    unique: true,
  },
  day: {
    type: String, // e.g., "Monday"
    required: true,
  },
  visitorCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Visitor", visitorSchema);