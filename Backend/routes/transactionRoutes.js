const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getPendingPayments, verifyPayment } = require('../controllers/paymentController');

router.use(authMiddleware, roleMiddleware(['employee']));

router.get('/pending', getPendingPayments);
router.put('/:id/verify', verifyPayment);

module.exports = router;
