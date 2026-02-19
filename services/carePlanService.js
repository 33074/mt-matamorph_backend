const pool = require('../config/db');

exports.generateCarePlan = async (residentId) => {
  const [residentRows] = await pool.execute(
    'SELECT * FROM residents WHERE id = ?',
    [residentId]
  );

  if (residentRows.length === 0) {
    throw new Error("Resident not found");
  }

  const resident = residentRows[0];
  const allergies = resident.allergies || [];

  const [recipes] = await pool.execute('SELECT * FROM recipes');

  const safeRecipes = recipes.filter(recipe => {
    const ingredients = recipe.ingredients || [];
    return !ingredients.some(ing => allergies.includes(ing));
  });

  return safeRecipes.slice(0, 7);
};