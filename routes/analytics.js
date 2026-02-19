const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const analyticsService = require('../services/analyticsService');

router.get('/', auth, async (req, res) => {
  try {
    const data = await analyticsService.getAnalytics();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
