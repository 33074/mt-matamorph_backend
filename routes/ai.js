const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const aiService = require('../services/aiService');

router.post('/ask', auth, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await aiService.generateAIResponse(question);

    res.json({
      question,
      answer: response
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
