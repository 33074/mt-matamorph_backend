const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createResident = async (req, res) => {
  const { name, allergies, dietary_preferences, medical_conditions } = req.body;

  try {
    await pool.execute(
      'INSERT INTO residents VALUES (?, ?, ?, ?, ?)',
      [
        uuidv4(),
        name,
        JSON.stringify(allergies),
        JSON.stringify(dietary_preferences),
        JSON.stringify(medical_conditions)
      ]
    );

    res.status(201).json({ message: "Resident created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResidents = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM residents');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
