const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header or cookie
    let token = null;
    
    // Check Authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Fallback to cookie
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided. Please login.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database (exclude password)
    const user = await User.findById(decoded.id).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found. Please login again.' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive. Please contact support.' });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please login again.' });
    }
    
    console.error('Authentication error:', err);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
};

module.exports = authMiddleware;