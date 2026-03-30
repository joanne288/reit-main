require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

async function reset() {
  const hash = await bcrypt.hash('admin123', 10);
  await db.query("UPDATE users SET password = ? WHERE email = 'admin@jmra.com'", [hash]);
  console.log('Password updated successfully!');
  console.log('Hash:', hash);
  process.exit();
}

reset();