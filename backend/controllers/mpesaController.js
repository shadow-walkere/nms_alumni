import axios from "axios";
import Donation from "../models/Donation.js";
import { getAccessToken, generatePassword } from "../config/mpesa.js";

/* ───────── STK PUSH ───────── */
export const stkPush = async (req, res) => {
  try {
    const { name, phone, amount, purpose } = req.body;

    // Validate required fields
    if (!phone || !amount) {
      return res.status(400).json({ error: "Phone and amount are required" });
    }

    // Format phone to Kenya standard (2547XXXXXXXX)
    const formattedPhone = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone.startsWith("254")
      ? phone
      : "254" + phone;

    // Generate STK Push password
    const token = await getAccessToken();
console.log("Access Token:", token);
    const { password, timestamp } = generatePassword();

    // Save donation as pending
    const donation = await Donation.create({
      name,
      phone: formattedPhone,
      amount,
      purpose,
      status: "Pending",
    });

    // Make STK Push request
    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: process.env.SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: "NMS Alumni",
        TransactionDesc: "Donation",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Respond with checkout ID and full M-Pesa response
    res.json({
      message: "STK Push sent successfully",
      checkoutRequestID: stkResponse.data.CheckoutRequestID,
      data: stkResponse.data,
    });
  } catch (error) {
    console.error(
      "STK ERROR:",
      error.response?.data || error.message || error
    );
    res.status(500).json({
      error: "Failed to initiate STK Push",
      details: error.response?.data || error.message,
    });
  }
};

/* ───────── CALLBACK ───────── */
export const mpesaCallback = async (req, res) => {
  try {
    const callback = req.body;

    console.log("🟢 M-Pesa Callback Received:", JSON.stringify(callback, null, 2));

    const stkCallback = callback.Body?.stkCallback;
    if (!stkCallback) {
      console.warn("⚠️ No stkCallback found in request body");
      return res.sendStatus(200); // Respond 200 to prevent retries
    }

    const { ResultCode, ResultDesc, CheckoutRequestID } = stkCallback;

    // If transaction failed, log and return
    if (ResultCode !== 0) {
      console.warn(`❌ Transaction failed: ${ResultDesc} (Code: ${ResultCode})`);
      return res.sendStatus(200);
    }

    // Extract metadata
    const metadata = stkCallback.CallbackMetadata?.Item || [];
    const receipt = metadata.find((i) => i.Name === "MpesaReceiptNumber")?.Value;
    const amount = metadata.find((i) => i.Name === "Amount")?.Value;
    const phone = metadata.find((i) => i.Name === "PhoneNumber")?.Value;

    if (!receipt || !amount || !phone) {
      console.warn("⚠️ Missing required fields in callback metadata");
      return res.sendStatus(200);
    }

    // Update the donation in DB
    const donation = await Donation.findOneAndUpdate(
      { phone, amount, status: "Pending" },
      {
        status: "Completed",
        mpesaReceipt: receipt,
        checkoutID: CheckoutRequestID,
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!donation) {
      console.warn(
        `⚠️ No pending donation found for phone ${phone} and amount ${amount}`
      );
    } else {
      console.log(`✅ Donation updated. Receipt: ${receipt}, Amount: ${amount}`);
    }

    // Respond 200 OK to M-Pesa
    res.sendStatus(200);
  } catch (error) {
    console.error("🔥 CALLBACK ERROR:", error);
    res.sendStatus(500); // M-Pesa retries if 500
  }
};