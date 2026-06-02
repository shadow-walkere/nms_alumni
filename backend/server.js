import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

// --- ROUTE IMPORTS ---
import mpesaRoutes from "./routes/mpesaRoutes.js"; // ✅ MUST EXIST
import adminAuthRoutes from "./routes/AdminAuth.js"; // 👈 Add your auth routes here

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🕵️ DEBUGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Base Route
app.get("/", (req, res) => {
  res.send("Backend API is running successfully! 🚀");
});

/* DB */
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try {
      const adminUsername = process.env.ADMIN_USERNAME || "Admin";
      const adminPassword = process.env.ADMIN_PASSWORD || "Admin@1234";

      // Case-insensitive query to see if admin already exists
      const adminExists = await User.findOne({ 
        username: { $regex: new RegExp(`^${adminUsername}$`, "i") } 
      });

      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await User.create({
          username: adminUsername,
          password: hashedPassword,
          role: "admin"
        });
        console.log(`✅ Default admin created (username: ${adminUsername})`);
      } else {
        console.log("ℹ️ Admin user already exists in database.");
      }
    } catch (seedErr) {
      console.error("❌ Failed to seed default admin:", seedErr);
    }
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

/* -----------------------------------
 * ROUTES
 * ----------------------------------- */
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/admin", adminAuthRoutes); // ✅ Restore Admin Auth routes

// Catch-all for 404s
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found on this server.` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
// Trigger reload: 1