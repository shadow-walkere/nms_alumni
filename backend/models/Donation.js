import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  amount: Number,
  purpose: String,
  status: {
    type: String,
    default: "Pending",
  },
  mpesaReceipt: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Donation", donationSchema);