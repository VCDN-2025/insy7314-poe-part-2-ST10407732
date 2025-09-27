const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]{3}$/ // 3-letter ISO currency code
  },
  payeeAccount: {
    type: String,
    required: true,
    match: /^\d{6,20}$/
  },
  swift: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/
  },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
