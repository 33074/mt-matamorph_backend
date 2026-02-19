const express = require('express');
const router = express.Router();
const { generateWeeklyPlan } = require('../services/mealPlannerService');
const auth = require('../middleware/authMiddleware');

router.get('/weekly', auth, async (req, res) => {
  const plan = await generateWeeklyPlan();
  res.json(plan);
});

module.exports = router;
