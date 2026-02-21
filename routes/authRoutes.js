const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Standard Auth
router.post('/signup', authController.register);
router.post('/login', authController.login);

// Google Auth - Fixes the 404 error
router.post('/google', authController.googleLogin);

module.exports = router;
