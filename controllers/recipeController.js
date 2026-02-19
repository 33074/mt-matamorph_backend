const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createRecipe = async (req, res) => {
  const { name, description, calories, protein, carbs, fats, ingredients, meal_type } = req.body;

  try {
    await pool.execute(
      'INSERT INTO recipes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        uuidv4(),
        name,
        description,
        calories,
        protein,
        carbs,
        fats,
        JSON.stringify(ingredients),
        meal_type
      ]
    );

    res.status(201).json({ message: "Recipe created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM recipes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
