const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM inventory');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add inventory item
router.post('/', async (req, res) => {
  try {
    const { name, quantity, threshold } = req.body;

    await pool.execute(
      'INSERT INTO inventory VALUES (UUID(), ?, ?, ?)',
      [name, quantity, threshold]
    );

    res.json({ message: "Inventory item added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
