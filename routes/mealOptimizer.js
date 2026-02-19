const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const mealService = require('../services/mealOptimizerService');

router.get('/meal-plan', auth, async (req, res) => {
  try {
    const mealPlan = await mealService.generateMealPlan();
    res.json({ success: true, mealPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
