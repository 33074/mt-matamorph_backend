const express = require('express');
const router = express.Router();
const { generateWeeklyPlan } = require('../controllers/carePlanController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:residentId/weekly', authMiddleware, generateWeeklyPlan);

module.exports = router;
