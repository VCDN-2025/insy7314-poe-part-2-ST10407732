// controllers/paymentController.js
const Payment = require('../models/Payment');
const validator = require('validator');

// Regex patterns for validation
const accountPattern = /^\d{6,20}$/; // 6-20 digits
const currencyPattern = /^[A-Z]{3}$/; // 3 uppercase letters (ISO 4217)
const swiftPattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/; // Standard SWIFT format
const providerPattern = /^[A-Za-z\s]{2,50}$/; // 2-50 letters and spaces

exports.createPayment = async (req, res) => {
  try {
    let { amount, currency, provider, payeeAccount, swiftCode } = req.body;

    // -----------------
    // Basic validations
    // -----------------
    if (amount === undefined || !currency || !provider || !payeeAccount || !swiftCode) {
      return res.status(400).json({ error: 'All payment fields are required.' });
    }

    // Amount validation
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > 1000000000) {
      return res.status(400).json({ error: 'Amount must be a positive number between 0 and 1,000,000,000.' });
    }

    // Currency validation (ISO 4217)
    currency = currency.trim().toUpperCase();
    if (!currencyPattern.test(currency)) {
      return res.status(400).json({ error: 'Currency must be 3 uppercase letters (e.g., USD, EUR, ZAR).' });
    }

    // Provider validation
    provider = provider.trim();
    if (!providerPattern.test(provider)) {
      return res.status(400).json({ error: 'Provider must be 2-50 letters only.' });
    }

    // Payee account validation
    payeeAccount = payeeAccount.trim();
    if (!accountPattern.test(payeeAccount)) {
      return res.status(400).json({ error: 'Payee account must be 6-20 digits.' });
    }

    // SWIFT validation
    swiftCode = swiftCode.trim().toUpperCase();
    if (!swiftPattern.test(swiftCode)) {
      return res.status(400).json({ error: 'SWIFT code must be 8 or 11 characters (e.g., AAAABBCCXXX).' });
    }

    // -----------------
    // Sanitization
    // -----------------
    currency = validator.escape(currency);
    provider = validator.escape(provider);
    payeeAccount = validator.escape(payeeAccount);
    swiftCode = validator.escape(swiftCode);

    const payment = new Payment({
      user: req.user._id,
      amount: numAmount,
      currency,
      provider,
      payeeAccount,
      swiftCode,
      status: 'pending'
    });

    await payment.save();

    return res.status(201).json({ 
      message: 'Payment submitted successfully', 
      paymentId: payment._id,
      payment: {
        amount: payment.amount,
        currency: payment.currency,
        provider: payment.provider,
        status: payment.status,
        createdAt: payment.createdAt
      }
    });
  } catch (err) {
    console.error('createPayment error', err);
    return res.status(500).json({ error: 'Server error while processing payment.' });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    return res.json({ 
      success: true, 
      count: payments.length,
      payments 
    });
  } catch (err) {
    console.error('getUserPayments error', err);
    return res.status(500).json({ error: 'Server error while fetching payments.' });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).select('-__v');
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found.' });
    }
    
    return res.json({ success: true, payment });
  } catch (err) {
    console.error('getPaymentById error', err);
    return res.status(500).json({ error: 'Server error while fetching payment.' });
  }
};