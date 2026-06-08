// const jwt = require('jsonwebtoken');

// const adminAuth = (req, res, next) => {
//   try {
//     // Check if the authorization header exists
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Attach the admin data to the request object
//     req.admin = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid or expired token.' });
//   }
// };

// module.exports = adminAuth;


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