import axios from 'axios';
import config from '../config/mpesa.js';

const generateToken = async (req, res, next) => {
    try {
        if (!config.consumerKey || !config.consumerSecret) {
            console.error("❌ Missing Consumer Key or Secret in config!");
            return res.status(500).json({ error: "Server missing M-Pesa credentials" });
        }

        // 🔍 DEBUG: Log what credentials are being used
        console.log("🔐 Using credentials:");
        console.log("   Consumer Key:", config.consumerKey?.slice(0, 10) + "...");
        console.log("   Consumer Secret:", config.consumerSecret?.slice(0, 10) + "...");

        const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
        
        console.log("   Base64 Auth:", auth.slice(0, 20) + "...");

        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            { headers: { Authorization: `Basic ${auth}` } }
        );

        req.token = response.data.access_token;
        console.log("✅ Token generated:", response.data.access_token.slice(0, 20) + "...");
        next();
        
    } catch (error) {
        console.error("❌ Token Generation Error:", error.response?.data || error.message);
        
        res.status(401).json({ 
            error: "Failed to generate M-Pesa token",
            details: error.response?.data || error.message 
        });
    }
};

export default generateToken;