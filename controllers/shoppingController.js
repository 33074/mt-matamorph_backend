const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getLists = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM shopping_lists ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createList = async (req, res) => {
  try {
    const { name, items, total_cost, status } = req.body;
    await pool.execute(
      'INSERT INTO shopping_lists (id, name, items, total_cost, status) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), name, items, total_cost, status]
    );
    res.status(201).json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, status } = req.body;
    await pool.execute('UPDATE shopping_lists SET items=?, status=? WHERE id=?', [items, status, id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
