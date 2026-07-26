import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_VACANCIES, INITIAL_CANDIDATES } from '../src/data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent JSON Storage File Path (Works on any cheap hosting without complex DB drivers)
const DB_FILE = path.join(__dirname, 'fleetforce_db.json');

// Initialize Storage
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading JSON storage file, using defaults:', err);
  }
  const defaultData = {
    vacancies: INITIAL_VACANCIES,
    candidates: INITIAL_CANDIDATES
  };
  saveDatabase(defaultData);
  return defaultData;
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing JSON storage file:', err);
  }
}

let db = loadDatabase();

// --- VACANCIES API ---
app.get('/api/vacancies', (req, res) => {
  res.json({ success: true, data: db.vacancies });
});

app.post('/api/vacancies', (req, res) => {
  const newVac = {
    id: Date.now(),
    title: req.body.title || 'Marine Vacancy',
    rank: req.body.rank || 'Officer',
    vesselType: req.body.vesselType || 'Commercial Vessel',
    dwt: req.body.dwt || '50,000 DWT',
    salary: req.body.salary || '$5,000',
    contract: req.body.contract || '4 months',
    joiningPort: req.body.joiningPort || 'TBD',
    joiningDate: req.body.joiningDate || 'ASAP',
    urgent: !!req.body.urgent,
    active: true,
    requirements: req.body.requirements || ['Valid STCW'],
    responsibilities: req.body.responsibilities || 'Standard duties'
  };
  db.vacancies.unshift(newVac);
  saveDatabase(db);
  res.status(201).json({ success: true, data: newVac });
});

app.delete('/api/vacancies/:id', (req, res) => {
  const id = Number(req.params.id);
  db.vacancies = db.vacancies.filter((v) => v.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// --- CANDIDATES / SEAFARER APPLICATIONS API ---
app.get('/api/candidates', (req, res) => {
  res.json({ success: true, data: db.candidates });
});

app.post('/api/candidates', (req, res) => {
  const newCandidate = {
    id: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
    fullName: req.body.fullName || 'Candidate',
    dob: req.body.dob || '',
    citizenship: req.body.citizenship || 'Russia',
    phone: req.body.phone || '',
    email: req.body.email || '',
    appliedRank: req.body.appliedRank || 'Officer',
    alternativeRank: req.body.alternativeRank || '',
    minSalary: req.body.minSalary || '5000',
    readyDate: req.body.readyDate || '',
    preferredVessels: req.body.preferredVessels || '',
    status: 'New',
    marlinsScore: req.body.marlinsScore || 'N/A',
    englishLevel: req.body.englishLevel || 'Good',
    notes: '',
    submittedAt: new Date().toISOString(),
    seaService: req.body.seaService || []
  };

  db.candidates.unshift(newCandidate);
  saveDatabase(db);
  res.status(201).json({ success: true, data: newCandidate });
});

app.put('/api/candidates/:id', (req, res) => {
  const { id } = req.params;
  const index = db.candidates.findIndex((c) => c.id === id);
  if (index !== -1) {
    if (req.body.status) db.candidates[index].status = req.body.status;
    if (req.body.notes !== undefined) db.candidates[index].notes = req.body.notes;
    saveDatabase(db);
    return res.json({ success: true, data: db.candidates[index] });
  }
  res.status(404).json({ success: false, message: 'Candidate not found' });
});

// --- ADMIN AUTH ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
    res.json({ success: true, token: 'fleetforce-jwt-token-9988', role: 'admin' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Serve static frontend build if present
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.send('FleetForce API Server is running. Frontend dev server is at http://localhost:3000');
  }
});

app.listen(PORT, () => {
  console.log(`[FleetForce Backend] Server running on port ${PORT}`);
});
