import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import mpesaRoutes from "./routes/mpesaRoutes.js"; // ✅ MUST EXIST

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🕵️ DEBUGGING MIDDLEWARE: This will print every incoming request to your terminal
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Base Route (To check if server is alive from your browser)
app.get("/", (req, res) => {
  res.send("Backend API is running successfully! 🚀");
});

/* DB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

/* ROUTES */
app.use("/api/mpesa", mpesaRoutes);

// Catch-all for 404s (Tells you exactly what went wrong)
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found on this server.` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});