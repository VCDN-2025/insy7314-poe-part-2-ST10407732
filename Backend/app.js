require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

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
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'International Payments Portal API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      payments: '/api/payments/*',
      protected: '/api/protected'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

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

// 404 handler - MUST be last
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