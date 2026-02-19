const pool = require('../config/db');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Build context: residents + inventory + recipes
exports.buildMealContext = async () => {
  const [residents] = await pool.execute('SELECT id, name, age, dietary_restrictions FROM residents');
  const [inventory] = await pool.execute('SELECT name, quantity, unit FROM inventory');
  const [recipes] = await pool.execute('SELECT id, name, calories, protein, fat, carbs, ingredients_json FROM recipes');

  return { residents, inventory, recipes };
};

// Generate optimized meal plan
exports.generateMealPlan = async () => {
  const context = await exports.buildMealContext();

  // Convert data into prompt-friendly JSON strings
  const residentsStr = JSON.stringify(context.residents);
  const inventoryStr = JSON.stringify(context.inventory);
  const recipesStr = JSON.stringify(context.recipes);

  const prompt = `
You are a professional nutrition assistant. Generate a 7-day meal plan for all residents below.
Constraints:
- Respect each resident's dietary restrictions
- Use available inventory only
- Balance daily calories and macros (protein, fat, carbs)
- Optimize inventory usage
- Return as JSON: {resident_id, day, meals:[{meal_type, recipe_name, calories, protein, fat, carbs}]}

Residents:
${residentsStr}

Inventory:
${inventoryStr}

Recipes:
${recipesStr}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an AI meal optimizer." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  });

  return completion.choices[0].message.content;
};
