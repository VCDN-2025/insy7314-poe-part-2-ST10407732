const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    match: /^[A-Za-z ,.'-]{2,100}$/
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{13}$/
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{6,20}$/
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'employee', 'admin'],
    default: 'customer'
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for performance
userSchema.index({ accountNumber: 1 });
userSchema.index({ idNumber: 1 });

module.exports = mongoose.model('User', userSchema);