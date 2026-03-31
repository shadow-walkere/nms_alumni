import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    checkoutRequestId: { type: String, required: true, unique: true },
    merchantRequestId: String,
    
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    message: { type: String, default: "" }, 
    
    status: { type: String, default: 'Pending' }, // Pending, Success, Failed
    mpesaReceiptNumber: String,
    date: { type: Date, default: Date.now }
});

export default mongoose.model('Donation', donationSchema);