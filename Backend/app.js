// app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

const authRoutes = require('./routes/auth');      // your auth routes
const paymentRoutes = require('./routes/payments'); // your payment routes

const app = express();

// ---------------------
// Security headers
// ---------------------
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      "object-src": ["'none'"],
      "img-src": ["'self'", "data:"],
      "frame-ancestors": ["'none'"]
    }
  })
);

// ---------------------
// Body parser & cookies
// ---------------------
app.use(express.json());
app.use(cookieParser());

// ---------------------
// Safe Mongo Sanitize
// ---------------------
// Only sanitize req.body and req.params to prevent the "Cannot set property query" error
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// ---------------------
// CORS
// ---------------------
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// ---------------------
// Routes
// ---------------------
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// ---------------------
// Temporary test route
// ---------------------
app.get('/api/protected', (req, res) => {
  res.json({ message: '✅ Backend is working and reachable!' });
});

// ---------------------
// Root route
// ---------------------
app.get('/', (req, res) => res.send('Payments API running'));

module.exports = app;
