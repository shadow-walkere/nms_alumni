import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import mpesaRoutes from "./routes/mpesaRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* DB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ROUTES */
app.use("/api/mpesa", mpesaRoutes);

/* TEST */
app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});