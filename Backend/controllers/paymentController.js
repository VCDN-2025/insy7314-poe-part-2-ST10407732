// controllers/paymentController.js
const Payment = require('../models/Payment');
const validator = require('validator');

// Regex patterns for validation
const accountPattern = /^\d{6,20}$/; // 6-20 digits
const currencyPattern = /^[A-Z]{3}$/; // 3 uppercase letters (ISO 4217)
const swiftPattern = /^[A-Z0-9]{8,11}$/; // 8-11 chars, uppercase letters/numbers

exports.createPayment = async (req, res) => {
  try {
    let { amount, currency, payeeAccount, swift } = req.body;

    // -----------------
    // Basic validations
    // -----------------
    if (amount === undefined || currency === undefined || !payeeAccount || !swift) {
      return res.status(400).json({ error: 'Missing payment fields.' });
    }

    // Amount validation
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    // Currency validation
    if (!currencyPattern.test(currency)) {
      return res.status(400).json({ error: 'Currency must be 3 uppercase letters (e.g., USD).' });
    }

    // Payee account validation
    if (!accountPattern.test(payeeAccount)) {
      return res.status(400).json({ error: 'Payee account must be 6-20 digits.' });
    }

    // SWIFT validation
    if (!swiftPattern.test(swift)) {
      return res.status(400).json({ error: 'SWIFT code must be 8-11 uppercase letters/numbers.' });
    }

    // -----------------
    // Sanitization
    // -----------------
    currency = validator.escape(currency);
    payeeAccount = validator.escape(payeeAccount);
    swift = validator.escape(swift);

    const payment = new Payment({
      user: req.user._id,
      amount,
      currency,
      payeeAccount,
      swift
    });

    await payment.save();

    return res.status(201).json({ message: 'Payment created', paymentId: payment._id });
  } catch (err) {
    console.error('createPayment error', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(payments);
  } catch (err) {
    console.error('getUserPayments error', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};
