// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// // ⚠️ CRITICAL: When using ES6 imports in Node.js for your own files, 
// // you MUST include the .js extension at the end!
// import User from '../models/User.js'; 

// const router = express.Router();

// // ==========================================
// // 1. TEMPORARY ROUTE: Create the first admin
// // ==========================================
// router.post('/register-admin', async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
    
//     if (!username || !password) {
//       return res.status(400).json({ error: 'Username and password are required.' });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     // Hash the password (CRITICAL for login to work later)
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
    
//     // Save the new admin to MongoDB
//     const newAdmin = new User({
//       username: username,
//       password: hashedPassword,
//       role: 'admin' // Ensure your User model supports this, or remove it if not
//     });

//     await newAdmin.save();
//     res.status(201).json({ message: "Admin created successfully! You can now log in." });
    
//   } catch (err) {
//     console.error("Registration Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


// // ==========================================
// // 2. POST /api/admin/login
// // Admin Login route
// // ==========================================
// router.post('/login', async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
    
//     if (!username || !password) {
//       return res.status(400).json({ error: 'Username and password are required.' });
//     }

//     const user = await User.findOne({ 
//       username: { $regex: new RegExp(`^${username}$`, "i") } 
//     });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials.' });
//     }

//     // Sign the JWT payload
//     const token = jwt.sign(
//       { id: user._id, username: user.username, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' } // Token expires in 1 day
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role
//       }
//     });

//   } catch (err) {
//     next(err);
//   }
// });

// export default router;


const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Authenticate admin and get token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check if admin exists (case-insensitive)
    const admin = await Admin.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 3. Create and return JWT Token
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Middleware to verify admin token for protected routes
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// @route   GET /api/admin/users
// @desc    Get all registered users for admin dashboard approval workflow
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// @route   PUT /api/admin/users/:id/approve
// @desc    Approve a registered user account
router.put('/users/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isApproved = true;
    await user.save();
    res.json({ success: true, message: "User approved successfully", data: user });
  } catch (error) {
    console.error("Approve user error:", error);
    res.status(500).json({ message: "Server error approving user" });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete or reject a user account
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error deleting user" });
  }
});

module.exports = router;