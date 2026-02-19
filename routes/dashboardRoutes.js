const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/summary', authMiddleware, getSummary);

module.exports = router;
