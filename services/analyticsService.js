const pool = require('../config/db');

exports.getAnalytics = async () => {
  // 1. Resident satisfaction (average feedback rating)
  const [residentFeedback] = await pool.execute(`
    SELECT AVG(rating) as avg_rating, DATE(created_at) as day
    FROM meal_feedback
    GROUP BY day
    ORDER BY day ASC
  `);

  // 2. Inventory usage (sum of ingredients used)
  const [inventoryUsage] = await pool.execute(`
    SELECT ingredient_name, SUM(quantity_used) as total_used
    FROM consumption_history
    GROUP BY ingredient_name
    ORDER BY total_used DESC
  `);

  // 3. Cost savings (based on predicted vs actual waste)
  const [waste] = await pool.execute(`
    SELECT SUM(predicted_quantity - actual_used) as total_saved
    FROM inventory_waste
  `);

  return {
    residentSatisfaction: residentFeedback,
    inventoryUsage: inventoryUsage,
    costSavings: waste[0]?.total_saved || 0
  };
};
