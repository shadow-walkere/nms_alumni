
import dotenv from 'dotenv';

dotenv.config();

const config = {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    passkey: process.env.MPESA_PASSKEY,
    shortCode: process.env.MPESA_SHORTCODE,
    callbackUrl: process.env.MPESA_CALLBACK_URL || 'https:5000/api/mpesa/callback',
    environment: 'sandbox' // or 'production'
};

// ✅ Validate on startup
if (!config.consumerKey || !config.consumerSecret) {
    console.error('❌ FATAL: M-Pesa credentials not loaded from .env');
    console.error('   Make sure you have:');
    console.error('   - MPESA_CONSUMER_KEY');
    console.error('   - MPESA_CONSUMER_SECRET');
    console.error('   - MPESA_PASSKEY');
    console.error('   - MPESA_SHORTCODE');
    process.exit(1);
}

console.log('✅ M-Pesa config loaded:', {
    consumerKey: config.consumerKey?.slice(0, 5) + '...',
    consumerSecret: config.consumerSecret?.slice(0, 5) + '...',
    shortCode: config.shortCode
});

export default config;