const pool = require('../config/db');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.buildSystemContext = async () => {
  const [[{ totalResidents }]] = await pool.execute(
    'SELECT COUNT(*) as totalResidents FROM residents'
  );

  const [[{ lowStock }]] = await pool.execute(
    'SELECT COUNT(*) as lowStock FROM inventory WHERE quantity < threshold'
  );

  const [[{ totalCalories }]] = await pool.execute(
    'SELECT SUM(calories) as totalCalories FROM recipes'
  );

  return `
  System Summary:
  - Total Residents: ${totalResidents}
  - Low Stock Items: ${lowStock}
  - Total Weekly Calories: ${totalCalories || 0}
  `;
};

exports.generateAIResponse = async (question) => {
  const context = await exports.buildSystemContext();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a healthcare nutrition system assistant." },
      { role: "system", content: context },
      { role: "user", content: question }
    ],
  });

  return completion.choices[0].message.content;
};
