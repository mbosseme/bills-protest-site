import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'signatures.json');

app.use(cors());
app.use(express.json());

function readSignatures() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}
function writeSignatures(sigs) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(sigs, null, 2));
}

app.post('/api/sign', (req, res) => {
  const { name, location, userAgent } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const newSig = {
    name,
    location: location || null,
    userAgent: userAgent || null,
    timestamp: new Date().toISOString(),
  };
  const sigs = readSignatures();
  sigs.push(newSig);
  writeSignatures(sigs);
  res.json({ success: true });
});

// Protect signatures endpoint with a simple API key
app.get('/api/signatures', (req, res) => {
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
