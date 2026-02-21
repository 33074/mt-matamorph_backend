const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/summary', async (req, res) => {
  try {
    const [residents] = await pool.execute('SELECT COUNT(*) as count FROM residents');
    const [recipes] = await pool.execute('SELECT COUNT(*) as count FROM recipes');
    // Logic from your reference: Calculate low stock count
    const [inventory] = await pool.execute('SELECT COUNT(*) as count FROM inventory WHERE current_stock <= minimum_stock');
    
    res.json({
      totalResidents: residents[0].count,
      totalRecipes: recipes[0].count,
      lowStockItems: inventory[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
