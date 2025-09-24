// routes/payments.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Example: get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
