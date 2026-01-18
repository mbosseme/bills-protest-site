import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'signatures.json');

// Database connection pool (only used if DATABASE_URL is present)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Required for Render Postgres
    })
  : null;

// Initialize Database Table
if (pool) {
  pool.query(`
    CREATE TABLE IF NOT EXISTS signatures (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).then(() => {
    console.log('Connected to PostgreSQL and verified table.');
  }).catch(err => {
    console.error('PostgreSQL Connection Error:', err);
  });
}

app.use(cors());
app.use(express.json());

async function readSignatures() {
  if (pool) {
    try {
      const result = await pool.query('SELECT name, location, user_agent as "userAgent", created_at as timestamp FROM signatures ORDER BY created_at DESC');
      return result.rows;
    } catch (err) {
      console.error('Error reading from DB:', err);
      return [];
    }
  }
  // Fallback to local file
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

async function writeSignature(newSig) {
  if (pool) {
    try {
      await pool.query(
        'INSERT INTO signatures (name, location, user_agent, created_at) VALUES ($1, $2, $3, $4)',
        [newSig.name, newSig.location, newSig.userAgent, newSig.timestamp]
      );
      return;
    } catch (err) {
      console.error('Error writing to DB:', err);
      throw err;
    }
  }
  // Fallback to local file
  const sigs = await readSignatures(); // Note: treating as async now
  sigs.push(newSig);
  fs.writeFileSync(DATA_FILE, JSON.stringify(sigs, null, 2));
}

app.post('/api/sign', async (req, res) => {
  const { name, location, userAgent } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const newSig = {
    name,
    location: location || null,
    userAgent: userAgent || null,
    timestamp: new Date().toISOString(),
  };

  try {
    await writeSignature(newSig);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save signature' });
  }
});

// Protect signatures endpoint with a simple API key
app.get('/api/signatures', async (req, res) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const expectedKey = process.env.SIGNATURES_API_KEY || 'bills2026secret';
  if (apiKey !== expectedKey) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(readSignatures());
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
