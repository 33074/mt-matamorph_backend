const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');


// ---------------- GET ALL ----------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM residents');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ---------------- CREATE ----------------
router.post('/', async (req, res) => {
  console.log("POST BODY:", req.body);

  const name = req.body.name || req.body.full_name;
  const room = req.body.room || req.body.room_number;

  const allergies =
    typeof req.body.allergies === "string"
      ? req.body.allergies
      : JSON.stringify(req.body.allergies || []);

  const medical =
    typeof req.body.medical_conditions === "string"
      ? req.body.medical_conditions
      : JSON.stringify(
          req.body.medical_conditions ||
          req.body.dietary_restrictions || []
        );

  try {
    await pool.execute(
      `INSERT INTO residents 
       (id, name, room, allergies, medical_conditions)
       VALUES (?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        name,
        room,
        allergies,
        medical
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("INSERT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ---------------- UPDATE ----------------
router.put('/:id', async (req, res) => {
  console.log("UPDATE BODY:", req.body);
  console.log("UPDATE ID:", req.params.id);

  const name = req.body.name || req.body.full_name;
  const room = req.body.room || req.body.room_number;

  const allergies =
    typeof req.body.allergies === "string"
      ? req.body.allergies
      : JSON.stringify(req.body.allergies || []);

  const medical =
    typeof req.body.medical_conditions === "string"
      ? req.body.medical_conditions
      : JSON.stringify(req.body.medical_conditions || []);

  try {
    const [result] = await pool.execute(
      `UPDATE residents 
       SET name=?, room=?, allergies=?, medical_conditions=? 
       WHERE id=?`,
      [name, room, allergies, medical, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;