const express = require('express');
const router = express.Router();
const { nutritionReport } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/nutrition', authMiddleware, nutritionReport);

module.exports = router;
