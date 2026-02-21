const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_this';

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await pool.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    res.status(201).json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { email: rows[0].email } });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    // For demo: Use provided email or default
    const email = req.body.email || "resident.care@kluniversity.in";
    const tokenPayload = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token: tokenPayload, user: { email: email } });
  } catch (err) { res.status(500).json({ error: "Google Auth Failed" }); }
};
