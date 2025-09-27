const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');

// RegEx patterns for input validation (whitelisting)
const namePattern = /^[A-Za-z ,.'-]{2,100}$/;
const idPattern = /^\d{13}$/;
const accountPattern = /^\d{6,20}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;
const passwordMinLength = 8;

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' });
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, idNumber, accountNumber, password } = req.body;
    
    // Input validation
    if (!fullName || !idNumber || !accountNumber || !password) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    
    if (!namePattern.test(fullName)) {
      return res.status(400).json({ error: 'Invalid full name format.' });
    }
    
    if (!idPattern.test(idNumber)) {
      return res.status(400).json({ error: 'Invalid ID number format.' });
    }
    
    if (!accountPattern.test(accountNumber)) {
      return res.status(400).json({ error: 'Invalid account number format.' });
    }
    
    if (!passwordPattern.test(password)) {
      return res.status(400).json({ 
        error: 'Password must be 8-128 characters with uppercase, lowercase, number, and special character.' 
      });
    }
    
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Check if user already exists
    const existing = await User.findOne({ 
      $or: [{ accountNumber }, { idNumber }] 
    });
    if (existing) {
      return res.status(409).json({ error: 'Account number or ID number already registered.' });
    }

    // Hash password with high salt rounds for security
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      fullName: validator.escape(fullName),
      email: email ? validator.normalizeEmail(email) : undefined,
      idNumber,
      accountNumber,
      passwordHash: hash,
      role: 'customer'
    });
    
    await user.save();

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { accountNumber, password } = req.body;
    
    if (!accountNumber || !password) {
      return res.status(400).json({ error: 'Missing credentials.' });
    }

    // Validate input format
    if (!accountPattern.test(accountNumber)) {
      return res.status(400).json({ error: 'Invalid account number format.' });
    }

    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({ 
        error: `Account locked due to failed attempts. Try again in ${remainingTime} minutes.` 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      // Increment failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
        user.failedLoginAttempts = 0;
      }
      
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    const token = createToken(user);

    // Set secure HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000, // 30 minutes
      path: '/'
    };
    
   res.cookie('token', token, cookieOptions); // optional for frontend testing

return res.json({ 
  message: 'Login successful.',
  token,   // <-- add this line
  user: {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    accountNumber: user.accountNumber
  }
});

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  res.json({ message: 'Logged out successfully.' });
};