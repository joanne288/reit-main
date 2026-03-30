require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const authRoutes   = require('./routes/auth');
const googleRoutes = require('./routes/google-auth');
const propRoutes   = require('./routes/properties');
const enqRoutes    = require('./routes/enquiries');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth',       authRoutes);
app.use('/api/auth',       googleRoutes);
app.use('/api/properties', propRoutes);
app.use('/api/enquiries',  enqRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅  Server running on http://localhost:${PORT}`));
