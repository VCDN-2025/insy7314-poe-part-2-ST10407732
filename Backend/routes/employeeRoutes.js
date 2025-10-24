// Backend/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// CRUD operations
router.post('/', employeeController.createEmployee);
router.get('/', employeeController.listEmployees);
router.get('/:id', employeeController.getEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;