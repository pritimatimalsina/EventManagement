const express = require('express');

const authenticateToken = require('../middleware/authMiddleware');

const {
    createRegistration,
    getRegistrations,
    deleteRegistration
} = require('../controllers/registrationController');

const router = express.Router();

// Get all registrations - Public
router.get('/', getRegistrations);

// Create registration - Protected
router.post('/', authenticateToken, createRegistration);

// Cancel registration - Protected
router.delete('/:id', authenticateToken, deleteRegistration);

module.exports = router;