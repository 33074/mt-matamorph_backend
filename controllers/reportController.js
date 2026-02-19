const pool = require('../config/db');

exports.nutritionReport = async (req, res) => {
  try {
    const [[totals]] = await pool.execute(
      'SELECT SUM(protein) as protein, SUM(carbs) as carbs, SUM(fats) as fats FROM recipes'
    );

    res.json(totals);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
