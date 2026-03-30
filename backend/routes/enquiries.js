const express              = require('express');
const db                   = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');
const router               = express.Router();

// ── POST /api/enquiries  — anyone (logged in preferred) ──────
router.post('/', async (req, res) => {
  const { property_id, name, email, message, viewing_date } = req.body;
  if (!name || !email || !property_id)
    return res.status(400).json({ message: 'Name, email and property are required.' });

  // Attach user_id if logged in (token optional here)
  let user_id = null;
  const header = req.headers['authorization'];
  if (header) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
      user_id = decoded.id;
    } catch {}
  }

  try {
    await db.query(
      'INSERT INTO enquiries (user_id, property_id, name, email, message, viewing_date) VALUES (?,?,?,?,?,?)',
      [user_id, property_id, name, email, message || '', viewing_date || null]
    );
    res.status(201).json({ message: 'Enquiry submitted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/enquiries  — admin only ─────────────────────────
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, p.title AS property_title
      FROM enquiries e
      LEFT JOIN properties p ON e.property_id = p.id
      ORDER BY e.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── PATCH /api/enquiries/:id/status  — admin only ────────────
router.patch('/:id/status', authenticate, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'confirmed', 'rejected'].includes(status))
    return res.status(400).json({ message: 'Invalid status.' });
  try {
    await db.query('UPDATE enquiries SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
