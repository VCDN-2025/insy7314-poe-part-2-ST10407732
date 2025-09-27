const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createPayment, getUserPayments } = require('../controllers/paymentController');

// All payment routes should require authentication
router.post('/', authMiddleware, createPayment);
router.get('/', authMiddleware, getUserPayments);

module.exports = router;
