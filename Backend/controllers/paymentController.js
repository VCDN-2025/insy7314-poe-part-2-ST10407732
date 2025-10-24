// controllers/paymentController.js
const Payment = require('../models/Payment');
const validator = require('validator');

// Regex patterns for validation
const accountPattern = /^\d{6,20}$/; // 6-20 digits
const currencyPattern = /^[A-Z]{3}$/; // 3 uppercase letters (ISO 4217)
const swiftPattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/; // Standard SWIFT format
const providerPattern = /^[A-Za-z\s]{2,50}$/; // 2-50 letters and spaces

class PaymentController {
  // -----------------------
  // Customer: create payment
  // -----------------------
  static async createPayment(req, res) {
    try {
      let { amount, currency, provider, payeeAccount, swiftCode } = req.body;

      // Basic validations
      if (amount === undefined || !currency || !provider || !payeeAccount || !swiftCode) {
        return res.status(400).json({ error: 'All payment fields are required.' });
      }

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0 || numAmount > 1000000000) {
        return res.status(400).json({ error: 'Amount must be a positive number between 0 and 1,000,000,000.' });
      }

      currency = currency.trim().toUpperCase();
      if (!currencyPattern.test(currency)) {
        return res.status(400).json({ error: 'Currency must be 3 uppercase letters (e.g., USD, EUR, ZAR).' });
      }

      provider = provider.trim();
      if (!providerPattern.test(provider)) {
        return res.status(400).json({ error: 'Provider must be 2-50 letters only.' });
      }

      payeeAccount = payeeAccount.trim();
      if (!accountPattern.test(payeeAccount)) {
        return res.status(400).json({ error: 'Payee account must be 6-20 digits.' });
      }

      swiftCode = swiftCode.trim().toUpperCase();
      if (!swiftPattern.test(swiftCode)) {
        return res.status(400).json({ error: 'SWIFT code must be 8 or 11 characters (e.g., AAAABBCCXXX).' });
      }

      // Sanitization
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
  }

  // ------------------------
  // Customer: get all payments
  // ------------------------
  static async getUserPayments(req, res) {
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
  }

  // ------------------------
  // Customer: get payment by ID
  // ------------------------
  static async getPaymentById(req, res) {
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
  }

  // ------------------------
  // Employee/Admin: get all pending payments
  // ------------------------
  static async getPendingPayments(req, res) {
    try {
      const payments = await Payment.find({ status: 'pending' })
        .populate('user', 'fullName accountNumber')
        .sort({ createdAt: 1 }); // oldest first
      res.json({ count: payments.length, payments });
    } catch (err) {
      console.error('getPendingPayments error', err);
      res.status(500).json({ error: 'Server error.' });
    }
  }

  // ------------------------
  // Employee/Admin: verify payment
  // ------------------------
  static async verifyPayment(req, res) {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) return res.status(404).json({ error: 'Payment not found.' });
      if (payment.status !== 'pending') return res.status(400).json({ error: 'Only pending payments can be verified.' });

      payment.status = 'processing';
      payment.verifiedBy = req.user._id;
      payment.verifiedAt = new Date();
      await payment.save();

      res.json({ message: 'Payment verified successfully.' });
    } catch (err) {
      console.error('verifyPayment error', err);
      res.status(500).json({ error: 'Server error.' });
    }
  }

  // ------------------------
  // Employee/Admin: mark payment completed
  // ------------------------
  static async completePayment(req, res) {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) return res.status(404).json({ error: 'Payment not found.' });
      if (payment.status !== 'processing') return res.status(400).json({ error: 'Only processing payments can be completed.' });

      payment.status = 'completed';
      await payment.save();

      res.json({ message: 'Payment completed successfully.' });
    } catch (err) {
      console.error('completePayment error', err);
      res.status(500).json({ error: 'Server error.' });
    }
  }
}

module.exports = PaymentController;
