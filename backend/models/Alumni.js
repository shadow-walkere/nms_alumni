const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  graduation_year: {
    type: Number,
    required: true,
  },
  major: {
    type: String,
    required: true,
  },
  current_company: {
    type: String,
  },
  current_position: {
    type: String,
  },
  linkedin_url: {
    type: String,
  },
  bio: {
    type: String,
  },
  status: {
    type: String,
    default: 'Active',
  }
}, { timestamps: true });

const Alumni = mongoose.model('Alumni', alumniSchema);

module.exports = Alumni;
