const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const shoppingService = require('../services/shoppingService');

router.get('/', auth, async (req, res) => {
  try {
    const list = await shoppingService.generateShoppingList();
    res.json({ success: true, shoppingList: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
