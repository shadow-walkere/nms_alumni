import express from 'express';
import axios from 'axios';
import config from '../config/mpesa.js'; 
import generateToken from '../middleware/generateToken.js';
import Transaction from '../models/Donation.js';

const router = express.Router();

// ✅ Helper: Format phone number to M-Pesa format
const formatPhoneNumber = (phone) => {
    let formatted = phone.replace(/\D/g, ''); // Remove non-digits
    if (formatted.startsWith('0')) {
        formatted = '254' + formatted.slice(1);
    } else if (!formatted.startsWith('254')) {
        formatted = '254' + formatted;
    }
    return formatted;
};

// ✅ Helper: Validate inputs
const validateStkPushInput = (data) => {
    const { name, phone, amount, purpose } = data;
    const errors = [];

    if (!name || name.trim().length === 0) errors.push('Name is required');
    if (!phone || phone.trim().length === 0) errors.push('Phone number is required');
    if (!amount || amount <= 0) errors.push('Amount must be greater than 0');
    if (!purpose || purpose.trim().length === 0) errors.push('Purpose is required');

    // ✅ Validate phone format (should be 10-12 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 12) {
        errors.push('Invalid phone number format');
    }

    // ✅ Validate amount (M-Pesa has limits: 1-150,000 KES)
    if (amount < 1 || amount > 150000) {
        errors.push('Amount must be between 1 and 150,000 KES');
    }

    return errors;
};

// 1. Initiate STK Push
router.post('/stkpush', generateToken, async (req, res) => {
    try {
        const { name, phone, amount, purpose, message } = req.body;

        // ✅ Validate inputs
        const validationErrors = validateStkPushInput({ name, phone, amount, purpose });
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: validationErrors 
            });
        }

        // ✅ Check if config is loaded
        if (!config.shortCode || !config.passkey || !config.callbackUrl) {
            console.error('❌ M-Pesa config missing:', { 
                shortCode: !!config.shortCode, 
                passkey: !!config.passkey, 
                callbackUrl: !!config.callbackUrl 
            });
            return res.status(500).json({ 
                error: 'Server misconfigured: M-Pesa credentials missing' 
            });
        }

        // ✅ Format phone number
        const formattedPhone = formatPhoneNumber(phone);

        // ✅ Generate timestamp
        const timestamp = new Date()
            .toISOString()
            .replace(/[-:T.Z]/g, '')
            .slice(0, 14);

        // ✅ Create base64 password
        const password = Buffer.from(
            `${config.shortCode}${config.passkey}${timestamp}`
        ).toString('base64');

        console.log('📱 STK Push Request:', {
            phone: formattedPhone,
            amount,
            purpose,
            timestamp
        });

        // ✅ Make STK Push request to M-Pesa
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: config.shortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: parseInt(amount),
                PartyA: formattedPhone,
                PartyB: config.shortCode,
                PhoneNumber: formattedPhone,
                CallBackURL: config.callbackUrl,
                AccountReference: 'NMS Alumni',
                TransactionDesc: purpose || 'Donation Payment'
            },
            { 
                headers: { 
                    Authorization: `Bearer ${req.token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        // ✅ Check M-Pesa response
        if (response.data.ResponseCode !== '0') {
            console.warn('⚠️ M-Pesa warning:', response.data);
            return res.status(400).json({ 
                error: response.data.ResponseDescription || 'STK Push failed',
                code: response.data.ResponseCode
            });
        }

        // ✅ Save transaction to database
        const transaction = await Transaction.create({
            checkoutRequestId: response.data.CheckoutRequestID,
            merchantRequestId: response.data.MerchantRequestID,
            name: name.trim(),
            phoneNumber: formattedPhone,
            amount: parseInt(amount),
            purpose: purpose.trim(),
            message: message?.trim() || '',
            status: 'Pending',
            createdAt: new Date()
        });

        console.log('✅ Transaction created:', transaction._id);

        res.status(200).json({
            success: true,
            message: 'STK Push sent successfully',
            data: {
                checkoutRequestId: response.data.CheckoutRequestID,
                merchantRequestId: response.data.MerchantRequestID,
                responseCode: response.data.ResponseCode,
                responseDescription: response.data.ResponseDescription
            }
        });

    } catch (error) {
        console.error('❌ STK Push Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.errorDescription || 
                           error.response?.data?.ResponseDescription ||
                           error.message ||
                           'Failed to initiate STK Push';

        res.status(statusCode).json({ 
            error: errorMessage,
            code: error.response?.data?.ResponseCode || 'ERROR'
        });
    }
});

// 2. Callback URL (Safaricom hits this)
router.post('/callback', async (req, res) => {
    try {
        console.log('📨 Callback received:', JSON.stringify(req.body, null, 2));

        const callbackData = req.body?.Body?.stkCallback;

        if (!callbackData) {
            console.warn('⚠️ Invalid callback structure');
            return res.status(400).json({ error: 'Invalid callback data' });
        }

        const checkoutRequestId = callbackData.CheckoutRequestID;
        const resultCode = callbackData.ResultCode;
        const resultDesc = callbackData.ResultDesc;

        console.log(`📊 Callback - RequestID: ${checkoutRequestId}, ResultCode: ${resultCode}`);

        // ✅ Handle successful payment
        if (resultCode === 0) {
            try {
                const callbackMetadata = callbackData.CallbackMetadata?.Item || [];
                
                // Extract receipt number and other details
                const receipt = callbackMetadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
                const transAmount = callbackMetadata.find(i => i.Name === 'Amount')?.Value;
                const transTime = callbackMetadata.find(i => i.Name === 'TransTime')?.Value;
                const phoneNumber = callbackMetadata.find(i => i.Name === 'PhoneNumber')?.Value;

                const updatedTransaction = await Transaction.findOneAndUpdate(
                    { checkoutRequestId },
                    {
                        status: 'Success',
                        mpesaReceiptNumber: receipt,
                        transactionAmount: transAmount,
                        transactionTime: transTime,
                        transactionPhoneNumber: phoneNumber,
                        completedAt: new Date()
                    },
                    { new: true }
                );

                if (updatedTransaction) {
                    console.log('✅ Transaction updated as Success:', updatedTransaction._id);
                } else {
                    console.warn('⚠️ Transaction not found for update:', checkoutRequestId);
                }

            } catch (dbError) {
                console.error('❌ Database error during success update:', dbError.message);
            }

        } else {
            // ❌ Handle failed payment
            try {
                const updatedTransaction = await Transaction.findOneAndUpdate(
                    { checkoutRequestId },
                    {
                        status: 'Failed',
                        failureReason: resultDesc,
                        failedAt: new Date()
                    },
                    { new: true }
                );

                if (updatedTransaction) {
                    console.log('❌ Transaction updated as Failed:', updatedTransaction._id);
                    console.log('   Reason:', resultDesc);
                } else {
                    console.warn('⚠️ Transaction not found for failure update:', checkoutRequestId);
                }

            } catch (dbError) {
                console.error('❌ Database error during failure update:', dbError.message);
            }
        }

    } catch (error) {
        console.error('❌ Callback processing error:', error.message);
    }

    // ✅ ALWAYS respond with success to Safaricom so they stop retrying
    // (Even if we failed to update the database)
    res.status(200).json({ 
        ResultCode: 0, 
        ResultDesc: 'Accepted' 
    });
});

// 3. BONUS: Get transaction status (useful for frontend polling)
router.get('/status/:checkoutRequestId', async (req, res) => {
    try {
        const { checkoutRequestId } = req.params;

        if (!checkoutRequestId) {
            return res.status(400).json({ error: 'Checkout request ID required' });
        }

        const transaction = await Transaction.findOne({ checkoutRequestId });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({
            status: transaction.status,
            name: transaction.name,
            amount: transaction.amount,
            purpose: transaction.purpose,
            mpesaReceiptNumber: transaction.mpesaReceiptNumber,
            failureReason: transaction.failureReason,
            createdAt: transaction.createdAt,
            completedAt: transaction.completedAt
        });

    } catch (error) {
        console.error('❌ Status check error:', error.message);
        res.status(500).json({ error: 'Failed to fetch transaction status' });
    }
});

export default router;