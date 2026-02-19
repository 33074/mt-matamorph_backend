const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const mealService = require('../services/advancedMealOptimizerService');

router.get('/meal-plan', auth, async (req, res) => {
  try {
    const mealPlan = await mealService.generateAdvancedMealPlan();
    res.json({ success: true, mealPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
