const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'signatures.json');

app.use(cors());
app.use(express.json());

// Helper to read and write signatures
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

// POST /api/sign - collect name, timestamp, and metadata
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

// GET /api/signatures - get all signatures
app.get('/api/signatures', (req, res) => {
  res.json(readSignatures());
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
