const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  profession: {
    type: String,
    trim: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('AlumniUser', userSchema);
