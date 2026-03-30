import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/* GET ACCESS TOKEN */
export async function getAccessToken() {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString("base64");

  const res = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return res.data.access_token;
}

/* GENERATE PASSWORD */
export function generatePassword() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
  const password = Buffer.from(
    process.env.SHORTCODE + process.env.PASSKEY + timestamp,
  ).toString("base64");
  return { password, timestamp };
}
