const pool = require('../config/db');

exports.getSummary = async (req, res) => {
  try {
    const [[{ totalResidents }]] = await pool.execute(
      'SELECT COUNT(*) as totalResidents FROM residents'
    );

    const [[{ totalRecipes }]] = await pool.execute(
      'SELECT COUNT(*) as totalRecipes FROM recipes'
    );

    const [[{ lowStockItems }]] = await pool.execute(
      'SELECT COUNT(*) as lowStockItems FROM inventory WHERE quantity < threshold'
    );

    const [[{ weeklyCalories }]] = await pool.execute(
      'SELECT SUM(calories) as weeklyCalories FROM recipes'
    );

    res.json({
      totalResidents,
      totalRecipes,
      lowStockItems,
      weeklyCaloriesGenerated: weeklyCalories || 0
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
