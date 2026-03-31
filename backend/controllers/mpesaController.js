import axios from "axios";
import Donation from "../models/Donation.js";
import { getAccessToken, generatePassword } from "../config/mpesa.js";

/* ───────── STK PUSH ───────── */
// export const stkPush = async (req, res) => {
//   try {
//     console.log("STK HIT ✅");

//     const { name, email, phone, amount, purpose } = req.body;

//     const token = await getAccessToken();
//     const { password, timestamp } = generatePassword();

//     const response = await axios.post(
//       "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
//       {
//         BusinessShortCode: process.env.SHORTCODE,
//         Password: password,
//         Timestamp: timestamp,
//         TransactionType: "CustomerPayBillOnline",
//         Amount: amount,
//         PartyA: phone,
//         PartyB: process.env.SHORTCODE,
//         PhoneNumber: phone,
//         CallBackURL: process.env.CALLBACK_URL,
//         AccountReference: "NMS Alumni",
//         TransactionDesc: "Donation",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     // Save donation
//     await Donation.create({
//       name,
//       email,
//       phone,
//       amount,
//       purpose,
//       checkoutRequestID: response.data.CheckoutRequestID,
//     });

//     res.json({
//       message: "STK Push sent",
//       data: response.data,
//     });

//   } catch (err) {
//     console.error("ERROR:", err.response?.data || err.message);
//     res.status(500).json({
//       error: err.response?.data || err.message,
//     });
//   }
// };

export const stkPush = async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: "Phone and amount required" });
    }

    console.log("STK PUSH REQUEST:", phone, amount);

    // 🔥 TEMP TEST RESPONSE
    return res.json({
      message: "STK Push simulated successfully",
    });

  } catch (error) {
    console.error("MPESA ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/* ───────── CALLBACK ───────── */
export const mpesaCallback = async (req, res) => {
  try {
    console.log("CALLBACK RECEIVED 🔔");

    const data = req.body;

    const stk = data.Body.stkCallback;

    if (stk.ResultCode === 0) {
      const metadata = stk.CallbackMetadata.Item;

      const receipt = metadata.find(i => i.Name === "MpesaReceiptNumber")?.Value;

      await Donation.findOneAndUpdate(
        { checkoutRequestID: stk.CheckoutRequestID },
        {
          status: "Completed",
          mpesaReceipt: receipt,
        }
      );
    }

    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};