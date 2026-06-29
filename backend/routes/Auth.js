const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, year, profession } = req.body;

    // Check for existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user (isApproved defaults to false)
    user = new User({
      name,
      email,
      password: hashedPassword,
      year: parseInt(year),
      profession,
      isApproved: false
    });

    await user.save();

    res.status(201).json({ 
      message: "Account created successfully! Please wait for admin approval before logging in." 
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verify user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Verify account approval status
    if (!user.isApproved) {
      return res.status(403).json({ message: "Your account is pending admin approval." });
    }

    // Generate Auth Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: "Login successful!", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

module.exports = router;