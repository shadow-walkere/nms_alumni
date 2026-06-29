// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import User from "./models/User.js";

// // --- ROUTE IMPORTS ---
// import mpesaRoutes from "./routes/mpesaRoutes.js"; 
// import AdminRoute from "../src/Admin/AdminRoute.jsx"; 
// import { AdminRoutes } from "../src/Admin/AdminDashboard.jsx";


// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // 🕵️ DEBUGGING MIDDLEWARE
// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// });

// // Base Route
// app.get("/", (req, res) => {
//   res.send("Backend API is running successfully! 🚀");
// });

// /* DB */
// mongoose.connect(process.env.MONGO_URI)
//   .then(async () => {
//     console.log("✅ MongoDB Connected");
//     try {
//       const adminUsername = process.env.ADMIN_USERNAME || "Admin";
//       const adminPassword = process.env.ADMIN_PASSWORD || "Admin@1234";

//       // Case-insensitive query to see if admin already exists
//       const adminExists = await User.findOne({ 
//         username: { $regex: new RegExp(`^${adminUsername}$`, "i") } 
//       });

//       if (!adminExists) {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(adminPassword, salt);

//         await User.create({
//           username: adminUsername,
//           password: hashedPassword,
//           role: "admin"
//         });
//         console.log(`✅ Default admin created (username: ${adminUsername})`);
//       } else {
//         console.log("ℹ️ Admin user already exists in database.");
//       }
//     } catch (seedErr) {
//       console.error("❌ Failed to seed default admin:", seedErr);
//     }
//   })
//   .catch(err => console.error("❌ MongoDB Connection Error:", err));

// /* -----------------------------------
//  * ROUTES
//  * ----------------------------------- */
// app.use("/api/mpesa", mpesaRoutes);
// app.use("/api/admin", AdminRoutes);
// // ✅ Restore Admin Auth routes

// // Catch-all for 404s
// app.use((req, res) => {
//   res.status(404).json({ error: `Route ${req.originalUrl} not found on this server.` });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
// // Trigger reload: 1

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Models
const Admin = require('./models/Admin');

// Route Files
const authRoutes = require('./routes/Auth');
const adminRoutes = require('./routes/AdminRoutes');
const visitorRoutes = require('./routes/VisitorRoutes');
const galleryRoutes = require('./routes/GalleryRoute');
const newsEventsRoutes = require('./routes/NewsEvents');
const alumniRoutes = require('./routes/AlumniRoute');
const faqRoutes = require('./routes/FAQRoute.js');

const app = express();


// CORS Configuration

const allowedOrigins = [
  "http://localhost:3000",                     // Local dev (React)
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
  "https://nms-alumni.onrender.com",           // Your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],   // ✅ Removed invalid "*"
    credentials: true,
  })
);
app.use(express.json());

// Mount Routes

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news-events', newsEventsRoutes);
app.use('/api/alumni', alumniRoutes);
app.use("/api/faq",faqRoutes)
// ✅ Leadership routes mounted


// Database Connection & Admin Setup

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB successfully connected');

    const adminUsername = process.env.ADMIN_USERNAME || 'Admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';

    const adminExists = await Admin.findOne({
      username: { $regex: new RegExp(`^${adminUsername}$`, 'i') }
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await Admin.create({
        username: adminUsername,
        password: hashedPassword
      });
      console.log(`⚠️ Default Admin created! Username: ${adminUsername}`);
    } else {
      let updated = false;
      if (adminExists.username !== adminUsername) {
        adminExists.username = adminUsername;
        updated = true;
      }
      const isMatch = await bcrypt.compare(adminPassword, adminExists.password);
      if (!isMatch) {
        adminExists.password = await bcrypt.hash(adminPassword, 10);
        updated = true;
      }
      if (updated) {
        await adminExists.save();
        console.log(`✅ Admin credentials updated to match .env for username: ${adminUsername}`);
      }
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
