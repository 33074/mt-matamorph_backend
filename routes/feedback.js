const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const feedbackService = require('../services/feedbackService');

router.post('/', auth, async (req, res) => {
  try {
    const { resident_id, recipe_id, rating, notes } = req.body;
    if (!resident_id || !recipe_id || rating === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    await feedbackService.recordMealFeedback(resident_id, recipe_id, rating, notes);
    res.json({ success: true, message: 'Feedback recorded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:resident_id', auth, async (req, res) => {
  try {
    const feedback = await feedbackService.getResidentFeedback(req.params.resident_id);
    res.json({ success: true, feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
