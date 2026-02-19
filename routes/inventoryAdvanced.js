const express = require('express');
const router = express.Router();
const { getLowStockItems } = require('../services/inventoryService');
const auth = require('../middleware/authMiddleware');

router.get('/low-stock', auth, async (req, res) => {
  try {
    const items = await getLowStockItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
