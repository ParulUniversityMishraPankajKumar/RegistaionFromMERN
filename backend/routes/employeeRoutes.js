const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeeController');

// CRUD routes
router.post('/', controller.createEmployee);
router.get('/', controller.getEmployees);
router.get('/:id', controller.getEmployeeById);
router.put('/:id', controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

module.exports = router;
