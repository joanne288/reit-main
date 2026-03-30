const express              = require('express');
const db                   = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');
const router               = express.Router();

// ── GET /api/properties  — public ────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { location, type, search } = req.query;
    let query  = 'SELECT * FROM properties WHERE 1=1';
    const args = [];

    if (location) { query += ' AND location = ?';                          args.push(location); }
    if (type)     { query += ' AND type = ?';                              args.push(type); }
    if (search)   { query += ' AND (title LIKE ? OR location LIKE ?)';    args.push(`%${search}%`, `%${search}%`); }

    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, args);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/properties/:id  — public ────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM properties WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Property not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/properties  — admin only ───────────────────────
router.post('/', authenticate, adminOnly, async (req, res) => {
  const { title, price, location, type, description, image, bedrooms, bathrooms, area_sqft } = req.body;
  if (!title || !price || !location)
    return res.status(400).json({ message: 'Title, price and location are required.' });

  try {
    const [result] = await db.query(
      'INSERT INTO properties (title, price, location, type, description, image, bedrooms, bathrooms, area_sqft) VALUES (?,?,?,?,?,?,?,?,?)',
      [title, price, location, type || 'bungalow', description || '', image || '', bedrooms || 3, bathrooms || 2, area_sqft || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Property added.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── PUT /api/properties/:id  — admin only ────────────────────
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  const { title, price, location, type, description, image, bedrooms, bathrooms, area_sqft } = req.body;
  try {
    await db.query(
      'UPDATE properties SET title=?, price=?, location=?, type=?, description=?, image=?, bedrooms=?, bathrooms=?, area_sqft=? WHERE id=?',
      [title, price, location, type, description, image, bedrooms, bathrooms, area_sqft, req.params.id]
    );
    res.json({ message: 'Property updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── DELETE /api/properties/:id  — admin only ─────────────────
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM properties WHERE id = ?', [req.params.id]);
    res.json({ message: 'Property deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
