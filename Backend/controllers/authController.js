// Backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Validation patterns
const namePattern = /^[A-Za-z ,.'-]{2,100}$/;
const idPattern = /^\d{13}$/;
const accountPattern = /^\d{6,20}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

// Create JWT token
const createToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      accountNumber: user.accountNumber 
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key_change_this',
    { expiresIn: '24h' }
  );
};

// REGISTER (Customers only)
exports.register = async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, password } = req.body;

    // Validate all fields present
    if (!fullName || !idNumber || !accountNumber || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate formats
    if (!namePattern.test(fullName)) {
      return res.status(400).json({ error: 'Invalid full name format.' });
    }
    if (!idPattern.test(idNumber)) {
      return res.status(400).json({ error: 'ID number must be 13 digits.' });
    }
    if (!accountPattern.test(accountNumber)) {
      return res.status(400).json({ error: 'Invalid account number format.' });
    }
    if (!passwordPattern.test(password)) {
      return res.status(400).json({ 
        error: 'Password must be 8-128 characters with uppercase, lowercase, number, and special character.' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ idNumber }, { accountNumber }]
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this ID or account number.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      fullName: validator.escape(fullName),
      idNumber,
      accountNumber,
      passwordHash,
      role: 'customer'
    });

    await user.save();

    return res.status(201).json({ 
      message: 'Registration successful. Please log in.',
      userId: user._id 
    });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// LOGIN (All users)
exports.login = async (req, res) => {
  try {
    const { accountNumber, email, password } = req.body;

    console.log('🔐 Login attempt:', { 
      accountNumber: accountNumber || 'N/A', 
      email: email || 'N/A',
      hasPassword: !!password 
    });

    // Validate input
    if ((!accountNumber && !email) || !password) {
      return res.status(400).json({ error: 'Missing credentials.' });
    }

    let user;

    // Customer login (account number)
    if (accountNumber) {
      if (!accountPattern.test(accountNumber)) {
        return res.status(400).json({ error: 'Invalid account number format.' });
      }
      user = await User.findOne({ accountNumber });
      console.log('👤 Customer lookup:', user ? `Found: ${user.fullName}` : 'Not found');
    } 
    // Admin/Employee login (email)
    else if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }
      user = await User.findOne({ email: email.toLowerCase() });
      console.log('👔 Admin/Employee lookup:', user ? `Found: ${user.fullName} (${user.role})` : 'Not found');
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated.' });
    }

    // Check account lock
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        error: `Account locked due to failed attempts. Try again in ${remainingTime} minutes.`
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    console.log('🔑 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
        user.failedLoginAttempts = 0;
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Reset counters on success
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = createToken(user);

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    };

    res.cookie('token', token, cookieOptions);

    console.log('✅ Login successful:', user.email || user.accountNumber, `(${user.role})`);

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountNumber: user.accountNumber,
        role: user.role
      }
    });

  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    res.clearCookie('token', { path: '/' });
    return res.json({ message: 'Logout successful.' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};