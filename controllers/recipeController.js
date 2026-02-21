const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Helper to safely parse JSON strings into arrays
const safeParse = (data) => {
  if (!data || data === 'undefined' || data === null) return [];
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) { return []; }
};

exports.getRecipes = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM recipes ORDER BY created_at DESC');
    
    // Explicit fallbacks prevent the "controlled to uncontrolled" warning in React
    const formatted = rows.map(r => ({
      ...r,
      name: r.name || "",
      meal_type: r.meal_type || "Lunch",
      category: r.category || "Entrée",
      cuisine: r.cuisine || "",
      description: r.description || "",
      instructions: r.instructions || "",
      image_url: r.image_url || "",
      texture: r.texture || "Regular",
      dietary_tags: safeParse(r.dietary_tags),
      allergens: safeParse(r.allergens),
      ingredients: safeParse(r.ingredients)
    }));
    res.json(formatted);
  } catch (err) {
    console.error("❌ SQL FETCH ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const data = req.body;
    const id = uuidv4();
    await pool.execute(
      `INSERT INTO recipes (
        id, name, meal_type, category, cuisine, servings, description, 
        ingredients, instructions, prep_time, cook_time, calories, 
        sodium, dietary_tags, allergens, texture, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, 
        data.name || "", 
        data.meal_type || "Lunch", 
        data.category || "Entrée", 
        data.cuisine || "", 
        parseInt(data.servings) || 10, 
        data.description || "",
        JSON.stringify(data.ingredients || []), 
        data.instructions || "", 
        parseInt(data.prep_time) || 0, 
        parseInt(data.cook_time) || 0, 
        parseInt(data.calories) || 0, 
        parseInt(data.sodium) || 0, 
        JSON.stringify(data.dietary_tags || []), 
        JSON.stringify(data.allergens || []), 
        data.texture || "Regular", 
        data.image_url || ""
      ]
    );
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error("❌ SQL INSERT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await pool.execute(
      `UPDATE recipes SET 
        name=?, meal_type=?, category=?, cuisine=?, servings=?, description=?, 
        ingredients=?, instructions=?, prep_time=?, cook_time=?, calories=?, 
        sodium=?, dietary_tags=?, allergens=?, texture=?, image_url=?
      WHERE id=?`,
      [
        data.name || "", 
        data.meal_type || "Lunch", 
        data.category || "Entrée", 
        data.cuisine || "", 
        parseInt(data.servings) || 0, 
        data.description || "",
        JSON.stringify(data.ingredients || []), 
        data.instructions || "", 
        parseInt(data.prep_time) || 0, 
        parseInt(data.cook_time) || 0, 
        parseInt(data.calories) || 0, 
        parseInt(data.sodium) || 0, 
        JSON.stringify(data.dietary_tags || []), 
        JSON.stringify(data.allergens || []), 
        data.texture || "Regular", 
        data.image_url || "",
        id
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("❌ SQL UPDATE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM recipes WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    console.log("✅ Recipe deleted successfully:", id);
    res.json({ success: true, message: "Recipe deleted" });
  } catch (err) { 
    console.error("❌ SQL DELETE ERROR:", err.message);
    // This error usually happens if the recipe is tied to a Meal Plan
    res.status(500).json({ 
      error: "Database error. If this recipe is in a Meal Plan, delete the plan first." 
    }); 
  }
};
