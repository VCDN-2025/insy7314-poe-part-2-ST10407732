// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// --------------------------
// Robustly require User model
// --------------------------
let User;
const possibleModelPaths = [
  '../models/User',    // normal if controller is in controllers/
  '../../models/User', // if nested deeper
  './models/User',     // same folder (unlikely)
  'models/User'        // fallback
];

for (const p of possibleModelPaths) {
  try {
    User = require(p);
    if (User) {
      console.log(`[authController] Loaded User model from "${p}"`);
      break;
    }
  } catch (err) {
    // silent - helpful debug below if nothing worked
  }
}

if (!User) {
  console.error('[authController] ERROR: Could not load User model. Checked paths:', possibleModelPaths);
  console.error('[authController] Make sure models/User.js exists and uses "module.exports = mongoose.model(\'User\', userSchema)"');
  // Throw so server fails fast and you can see the issue in logs.
  throw new Error('User model not loaded in authController. See server logs.');
}
// --------------------------

/* RegEx patterns for input validation (whitelisting) */
const namePattern = /^[A-Za-z ,.'-]{2,100}$/;
const idPattern = /^\d{13}$/;
const accountPattern = /^\d{6,20}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

/* Create JWT token helper */
const createToken = (user) => {
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '30m' });
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, idNumber, accountNumber, password } = req.body;

    // Basic required fields check
    if (!fullName || !idNumber || !accountNumber || !password) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Validate patterns
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

    // Check for existing user (by accountNumber or idNumber)
    const existing = await User.findOne({
      $or: [{ accountNumber }, { idNumber }]
    });
    if (existing) {
      return res.status(409).json({ error: 'Account number or ID number already registered.' });
    }

    // Hash the password
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

    if (!accountPattern.test(accountNumber)) {
      return res.status(400).json({ error: 'Invalid account number format.' });
    }

    // Attempt to find user
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // If account locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        error: `Account locked due to failed attempts. Try again in ${remainingTime} minutes.`
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
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

    const token = createToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000,
      path: '/'
    };

    res.cookie('token', token, cookieOptions);

    return res.json({
      message: 'Login successful.',
      token,
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
