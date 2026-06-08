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

module.exports = router;