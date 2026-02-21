const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { v4: uuidv4 } = require('uuid');

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "Token required" });

    // Fetch user info using the access token
    const googleRes = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const { sub: googleId, email, name, picture: avatar } = googleRes.data;

    // Check if user exists
    const [users] = await db.execute("SELECT * FROM users WHERE google_id = ? OR email = ?", [googleId, email]);

    let user;
    if (users.length > 0) {
      user = users[0];
    } else {
      const id = uuidv4();
      await db.execute(
        "INSERT INTO users (id, name, email, google_id, avatar, role) VALUES (?, ?, ?, ?, ?, ?)",
        [id, name, email, googleId, avatar, 'admin']
      );
      user = { id, name, email, avatar };
    }

    const appToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.json({ token: appToken, user });
  } catch (error) {
    console.error("Google Auth Detailed Error:", error.response?.data || error.message);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

module.exports = router;
