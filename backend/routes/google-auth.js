const express = require('express');
const jwt     = require('jsonwebtoken');
const db      = require('../db');
const router  = express.Router();

// ── POST /api/auth/google ─────────────────────────────────
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'No credential provided.' });

  try {
    // Verify token with Google
    const googleRes  = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const googleData = await googleRes.json();

    if (googleData.error) {
      return res.status(401).json({ message: 'Invalid Google token.' });
    }

    const { email, name, sub: googleId } = googleData;

    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    let user;
    if (existing.length > 0) {
      user = existing[0];
    } else {
      // Auto-register new Google user
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, 'GOOGLE_AUTH_' + googleId, 'user']
      );
      user = { id: result.insertId, name, email, role: 'user' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
