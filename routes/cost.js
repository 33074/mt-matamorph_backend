const express = require('express');
const router = express.Router();
const { calculateTotalInventoryCost } = require('../services/costService');
const auth = require('../middleware/authMiddleware');

router.get('/inventory-cost', auth, async (req, res) => {
  const total = await calculateTotalInventoryCost();
  res.json({ totalInventoryCost: total });
});

module.exports = router;
