const pool = require('../config/db');

exports.generateWeeklyPlan = async () => {
  const [recipes] = await pool.execute('SELECT * FROM recipes');

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const plan = {};

  for (let i = 0; i < 7; i++) {
    const recipe = recipes[i % recipes.length];
    plan[days[i]] = recipe;
  }

  return plan;
};
