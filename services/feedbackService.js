const pool = require('../config/db');

exports.recordMealFeedback = async (resident_id, recipe_id, rating, notes = '') => {
  await pool.execute(`
    INSERT INTO meal_feedback (resident_id, recipe_id, rating, notes, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `, [resident_id, recipe_id, rating, notes]);
};

exports.getResidentFeedback = async (resident_id) => {
  const [feedback] = await pool.execute(`
    SELECT recipe_id, rating, notes, created_at
    FROM meal_feedback
    WHERE resident_id = ?
    ORDER BY created_at DESC
  `, [resident_id]);

  return feedback;
};
