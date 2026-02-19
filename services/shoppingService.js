const pool = require('../config/db');

exports.generateShoppingList = async () => {
  // 1. Get all planned recipes for the upcoming week
  const [plannedRecipes] = await pool.execute(`
    SELECT recipe_id, SUM(quantity_needed) as total_needed
    FROM planned_meals
    GROUP BY recipe_id
  `);

  // 2. Get current inventory
  const [inventory] = await pool.execute(`SELECT name, quantity FROM inventory`);

  // 3. Compare and compute deficit
  const shoppingList = plannedRecipes.map(pr => {
    const item = inventory.find(i => i.name === pr.recipe_id) || { quantity: 0 };
    const quantityToBuy = pr.total_needed - item.quantity;
    return { recipe_id: pr.recipe_id, quantityToBuy: quantityToBuy > 0 ? quantityToBuy : 0 };
  });

  return shoppingList;
};
