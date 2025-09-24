// app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');

const app = express();

// Security headers
app.use(helmet());

// Light CSP example via helmet
app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    "default-src": ["'self'"],
    "script-src": ["'self'"],
    "object-src": ["'none'"],
    "img-src": ["'self'", "data:"],
    "frame-ancestors": ["'none'"]
  }
}));

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize()); // prevent NoSQL injection

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// Simple root route
app.get('/', (req, res) => res.send('Payments API running'));

module.exports = app;
