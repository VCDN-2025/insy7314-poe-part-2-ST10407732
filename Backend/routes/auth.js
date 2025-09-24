// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // adjust path

// Correct: pass the function reference, not call it
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
