const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const safeParse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  try { return JSON.parse(data); } catch { return []; }
};

exports.getResidents = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM residents ORDER BY created_at DESC'
    );

    const formatted = rows.map(r => ({
      ...r,
      allergies: safeParse(r.allergies),
      dietary_restrictions: safeParse(r.dietary_restrictions),
      food_preferences: safeParse(r.food_preferences),
      food_dislikes: safeParse(r.food_dislikes)
    }));

    res.json(formatted);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({
      error: err.message,
      sql: err.sqlMessage
    });
  }
};

exports.createResident = async (req, res) => {
  try {
    const d = req.body;
    const id = uuidv4();

    await pool.execute(
      `INSERT INTO residents (
        id, full_name, room_number, date_of_birth, status,
        allergies, dietary_restrictions, texture_requirements,
        calorie_target, food_preferences, food_dislikes, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        d.full_name,
        d.room_number,
        d.date_of_birth || null,
        d.status || 'active',

        JSON.stringify(d.allergies || []),
        JSON.stringify(d.dietary_restrictions || []),
        d.texture_requirements || 'Regular',
        parseInt(d.calorie_target) || 2000,
        JSON.stringify(d.food_preferences || []),
        JSON.stringify(d.food_dislikes || []),
        d.notes || ""
      ]
    );

    res.status(201).json({ success: true, id });

  } catch (err) {
    console.error("❌ INSERT ERROR:", err);
    res.status(500).json({
      error: err.message,
      code: err.code,
      sqlMessage: err.sqlMessage
    });
  }
};