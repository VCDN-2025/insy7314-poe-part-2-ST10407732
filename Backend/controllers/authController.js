// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');

const namePattern = /^[A-Za-z ,.'-]{2,100}$/;
const idPattern = /^\d{13}$/;
const accountPattern = /^\d{6,20}$/;
const passwordMinLength = 8;

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' });
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, idNumber, accountNumber, password } = req.body;
    if (!fullName || !idNumber || !accountNumber || !password) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (!namePattern.test(fullName)) return res.status(400).json({ error: 'Invalid full name.' });
    if (!idPattern.test(idNumber)) return res.status(400).json({ error: 'Invalid ID number.' });
    if (!accountPattern.test(accountNumber)) return res.status(400).json({ error: 'Invalid account number.' });
    if (password.length < passwordMinLength) return res.status(400).json({ error: 'Password too short.' });
    if (email && !validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email.' });

    const existing = await User.findOne({ accountNumber });
    if (existing) return res.status(409).json({ error: 'Account number already registered.' });

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      email,
      idNumber,
      accountNumber,
      passwordHash: hash
    });
    await user.save();

    return res.status(201).json({ message: 'Registered successfully.' });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { accountNumber, password } = req.body;
    if (!accountNumber || !password) return res.status(400).json({ error: 'Missing credentials.' });

    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({ error: 'Account locked due to many failed attempts. Try later.' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000;
        user.failedLoginAttempts = 0;
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = createToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000
    };
    res.cookie('token', token, cookieOptions);
    return res.json({ message: 'Login successful.' });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
