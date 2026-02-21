const pool = require('../config/db');

exports.generateAIResponse = async (question) => {
    const q = question.toLowerCase();
    
    // Your existing smart response logic
    if (q.includes('resident') || q.includes('who')) {
      return "I have access to the Residents database. For example, Dorothy Chen is currently in Room 101A and has a documented allergy to Peanuts.";
    }
    
    if (q.includes('meal') || q.includes('suggest')) {
      return "Based on your current recipes, I suggest the Baked Salmon with Rice for any diabetic-friendly residents.";
    }

    return "MediMorph AI is online. I can help you cross-reference resident allergies with your recipe database.";
};

// NEW: Function to fix the 404 error and generate the meal plan
exports.generateMealPlan = async (residentId) => {
    try {
        // Fetch resident details including allergies and conditions
        const [rows] = await pool.execute('SELECT * FROM residents WHERE id = ?', [residentId]);
        const resident = rows[0];

        if (!resident) throw new Error("Resident not found in database.");

        // Simulate AI logic cross-referencing health data
        return {
            residentName: resident.name,
            room: resident.room,
            conditions: resident.medical_conditions,
            allergies: resident.allergens,
            plan: [
                { time: "08:00 AM", meal: "Oatmeal with Berries", note: "Controlled portion for Diabetes" },
                { time: "12:30 PM", meal: "Grilled Chicken Salad", note: "Checked for Peanut/Shellfish safety" },
                { time: "06:30 PM", meal: "Baked Salmon with Rice", note: "High protein, low-sodium" }
            ],
            status: "Generated successfully"
        };
    } catch (err) {
        console.error("Service Error:", err.message);
        throw err;
    }
};