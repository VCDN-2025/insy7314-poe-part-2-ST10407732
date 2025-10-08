const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createPayment, getUserPayments, getPaymentById } = require('../controllers/paymentController');

router.post('/', authMiddleware, createPayment);
router.get('/', authMiddleware, getUserPayments);
router.get('/:id', authMiddleware, getPaymentById);

module.exports = router;
