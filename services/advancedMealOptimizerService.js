const pool = require('../config/db');
const OpenAI = require('openai');
const { embedText, queryVectorDB } = require('./vectorMemory');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Build context: residents + inventory + recipes + feedback + predicted shopping
exports.buildMealContext = async () => {
  const [residents] = await pool.execute(`
    SELECT id, name, age, dietary_restrictions, target_calories 
    FROM residents
  `);

  const [inventory] = await pool.execute('SELECT name, quantity, unit FROM inventory');

  const [recipes] = await pool.execute(`
    SELECT id, name, calories, protein, fat, carbs, ingredients_json 
    FROM recipes
  `);

  const [feedback] = await pool.execute(`
    SELECT resident_id, recipe_id, rating 
    FROM meal_feedback
  `);

  // Predicted shopping list (basic forecast)
  const [plannedRecipes] = await pool.execute(`
    SELECT recipe_id, SUM(quantity_needed) as total_needed
    FROM planned_meals
    GROUP BY recipe_id
  `);

  const shoppingList = plannedRecipes.map(pr => {
    const item = inventory.find(i => i.name === pr.recipe_id) || { quantity: 0 };
    const quantityToBuy = pr.total_needed - item.quantity;
    return { recipe_id: pr.recipe_id, quantityToBuy: quantityToBuy > 0 ? quantityToBuy : 0 };
  });

  return { residents, inventory, recipes, feedback, shoppingList };
};

// Generate AI meal plan using full context
exports.generateAdvancedMealPlan = async () => {
  const context = await exports.buildMealContext();

  // Fetch similar past plans from vector memory
  const pastPlans = await queryVectorDB('meal_plan_vectors', JSON.stringify(context.residents));

  const prompt = `
You are an AI nutrition assistant. Generate a 7-day meal plan for each resident.
Constraints:
- Respect dietary restrictions and target calories
- Consider resident feedback: ${JSON.stringify(context.feedback)}
- Use current inventory and predicted shopping needs: ${JSON.stringify(context.shoppingList)}
- Optimize macros and calories
- Incorporate past meal preferences from memory: ${JSON.stringify(pastPlans)}
- Return JSON: {resident_id, day, meals:[{meal_type, recipe_name, calories, protein, fat, carbs}]}
Residents: ${JSON.stringify(context.residents)}
Inventory: ${JSON.stringify(context.inventory)}
Recipes: ${JSON.stringify(context.recipes)}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an AI meal optimizer with predictive inventory, feedback learning, and memory." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  });

  // Save this plan to vector memory
  await embedText('meal_plan_vectors', 0, completion.choices[0].message.content); // 0 means general context

  return completion.choices[0].message.content;
};
