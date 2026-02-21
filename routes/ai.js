const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const aiService = require('../services/aiService');

// Existing Chat Route
router.post('/ask', auth, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });
    const response = await aiService.generateAIResponse(question);
    res.json({ question, answer: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NEW: Meal Plan Route to fix the 404 error
router.post('/generate-plan', auth, async (req, res) => {
  try {
    const { residentId } = req.body;
    if (!residentId) return res.status(400).json({ error: 'Resident ID is required' });

    // This calls the service to create a personalized nutrition plan
    const plan = await aiService.generateMealPlan(residentId);
    res.json(plan);
  } catch (err) {
    console.error("Meal Plan Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;