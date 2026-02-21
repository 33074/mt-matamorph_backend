const pool = require('../config/db');

exports.generateMealPlan = async (req, res) => {
  try {
    const { residentId } = req.body;
    
    // 1. Fetch resident details to consider allergies/conditions
    const [resident] = await pool.execute('SELECT * FROM residents WHERE id = ?', [residentId]);
    
    if (!resident.length) return res.status(404).json({ error: "Resident not found" });

    // 2. Simple logic for your demo plan generation
    const plan = {
      residentName: resident[0].name,
      dailySchedule: [
        { time: "08:00 AM", meal: "Oatmeal with Berries", notes: "Low sugar for Diabetes" },
        { time: "12:30 PM", meal: "Grilled Chicken Salad", notes: "Ensure no peanut dressing" },
        { time: "06:30 PM", meal: "Baked Salmon with Rice", notes: "High protein, low sodium" }
      ],
      warnings: "Strictly avoid Peanut and Shellfish products."
    };

    res.json(plan);
  } catch (err) {
    console.error("AI Generation Error:", err.message);
    res.status(500).json({ error: "Failed to generate AI plan" });
  }
};
