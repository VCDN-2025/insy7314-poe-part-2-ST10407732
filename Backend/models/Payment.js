const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0,
    max: 1000000000
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]{3}$/ // 3-letter ISO currency code
  },
  provider: {
    type: String,
    required: true,
    match: /^[A-Za-z\s]{2,50}$/
  },
  payeeAccount: {
    type: String,
    required: true,
    match: /^\d{6,20}$/
  },
  swiftCode: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending' 
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  }
}, { 
  timestamps: true 
});

// Index for faster queries
PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);