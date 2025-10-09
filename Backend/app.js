// Backend/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

// ---------- BRUTE/CSRF IMPORTS ----------
const ExpressBrute = require('express-brute');
const csrf = require('csurf');
// ------------------------------------------

const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ---------- EXPRESS-BRUTE (safe dev setup) ----------
try {
  const MemoryStore = ExpressBrute.MemoryStore || require('express-brute').MemoryStore;
  const bruteStore = new MemoryStore();

  const bruteforce = new ExpressBrute(bruteStore, {
    freeRetries: 5,
    minWait: 5 * 60 * 1000, // 5 minutes
    maxWait: 60 * 60 * 1000, // 1 hour
    lifetime: 24 * 60 * 60, // 1 day (seconds)
  });

  app.use('/api/auth/login', bruteforce.prevent);

  console.log('[express-brute] Using in-memory store (development).');
} catch (err) {
  console.error('[express-brute] Failed to initialize memory store:', err);
}
// ------------------------------------------------------------------

// Root route – only show Payments API running
app.get('/', (req, res) => {
  res.send('Payments API running');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ---------- CSRF protection ----------
const csrfProtection = csrf({ cookie: true });

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Auth and payment routes with CSRF
app.use('/api/auth', csrfProtection, authRoutes);
app.use('/api/payments', csrfProtection, paymentRoutes);

// Protected route for testing auth
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Access granted',
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      accountNumber: req.user.accountNumber,
      idNumber: req.user.idNumber,
      role: req.user.role
    }
  });
});

// CSRF error handler
app.use((err, req, res, next) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next(err);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

module.exports = app;
