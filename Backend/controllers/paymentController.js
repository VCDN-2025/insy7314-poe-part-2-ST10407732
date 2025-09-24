// controllers/paymentController.js
const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
  try {
    const { amount, currency, payeeAccount, swift } = req.body;
    if (!amount || !currency || !payeeAccount || !swift) {
      return res.status(400).json({ error: 'Missing payment fields.' });
    }
    if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

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
