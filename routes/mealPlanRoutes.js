const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// Database Connection Pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "medimorph"
});

// GET all meal plans
router.get("/", (req, res) => {
  const query = "SELECT * FROM meal_plans ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST a new meal plan
router.post("/", (req, res) => {
  const { resident_id, resident_name, week_start_date, meals, notes, total_calories } = req.body;
  
  const query = `INSERT INTO meal_plans 
    (resident_id, resident_name, week_start_date, meals, notes, total_calories, status) 
    VALUES (?, ?, ?, ?, ?, ?, 'draft')`;
  
  const values = [
    resident_id, 
    resident_name, 
    week_start_date, 
    JSON.stringify(meals), 
    notes, 
    total_calories
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ SQL Insert Error:", err.message); // Log the error
      return res.status(500).json({ error: err.message });
    }
    console.log("✅ Plan saved for:", resident_name);
    res.status(201).json({ id: result.insertId, message: "Plan saved" });
  });
});

module.exports = router;
