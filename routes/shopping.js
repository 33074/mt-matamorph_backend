const express = require('express');
const router = express.Router();
const { generateShoppingList } = require('../services/shoppingService');
const auth = require('../middleware/authMiddleware');

router.get('/generate', auth, async (req, res) => {
  try {
    const list = await generateShoppingList();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
