const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const delayMs = parseInt(process.env.DELAY, 10) || 0;
if (delayMs > 0) {
  app.use((req, res, next) => setTimeout(next, delayMs));
}

// In-memory data store (loaded from db.json, deep copies for mutability)
let users = [];
let cars = [];
let carParts = [];

function loadSeedData() {
  const dbPath = path.join(__dirname, '..', 'db.json');
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    users = (data.users || []).map((u) => ({ ...u }));
    cars = (data.cars || []).map((c) => ({ ...c }));
    carParts = (data.carParts || []).map((p) => ({ ...p }));
    console.log(`Loaded ${users.length} users, ${cars.length} cars and ${carParts.length} car parts`);
  } catch (err) {
    console.warn('Could not load db.json, using empty data:', err.message);
    users = [];
    cars = [];
    carParts = [];
  }
}

function nextId(collection) {
  const ids = collection.map((item) => item.id).filter(Number.isInteger);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

// API router (mounted at /api so frontend's api/cars, api/login etc. work)
const api = express.Router();

// --- Auth / Login ---

api.post('/login', (req, res) => {
  const { username, email, password } = req.body;
  const user = users.find(
    (u) =>
      (username && u.username === username) || (email && u.email === email)
  );
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const { password: _, ...userWithoutPassword } = user;
  const token = `mock-jwt-${user.id}-${Date.now()}`;
  res.json({
    token,
    user: userWithoutPassword,
    expiresIn: 3600,
  });
});

// --- Cars REST API ---

api.get('/cars', (req, res) => {
  const embed = req.query._embed;
  let result = [...cars];
  if (embed === 'carParts') {
    result = result.map((car) => ({
      ...car,
      carParts: carParts.filter((p) => p.carId === car.id),
    }));
  }
  res.json(result);
});

api.get('/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const car = cars.find((c) => c.id === id);
  if (!car) return res.status(404).json({ error: 'Car not found' });
  const embed = req.query._embed;
  let result = { ...car };
  if (embed === 'carParts') {
    result.carParts = carParts.filter((p) => p.carId === id);
  }
  res.json(result);
});

api.post('/cars', (req, res) => {
  const { make, model, year, color } = req.body;
  const car = {
    id: nextId(cars),
    make: make ?? '',
    model: model ?? '',
    year: year ?? null,
    color: color ?? '',
  };
  cars.push(car);
  res.status(201).json(car);
});

api.put('/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = cars.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Car not found' });
  const { make, model, year, color } = req.body;
  cars[idx] = {
    id,
    make: make ?? cars[idx].make,
    model: model ?? cars[idx].model,
    year: year ?? cars[idx].year,
    color: color ?? cars[idx].color,
  };
  res.json(cars[idx]);
});

api.patch('/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = cars.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Car not found' });
  cars[idx] = { ...cars[idx], ...req.body, id };
  res.json(cars[idx]);
});

api.delete('/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = cars.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Car not found' });
  carParts = carParts.filter((p) => p.carId !== id);
  cars.splice(idx, 1);
  res.status(204).send();
});

// --- CarParts REST API ---

api.get('/carParts', (req, res) => {
  const carId = req.query.carId;
  const expand = req.query._expand;
  let result = [...carParts];
  if (carId != null) {
    const id = Number(carId);
    result = result.filter((p) => p.carId === id);
  }
  if (expand === 'car') {
    result = result.map((part) => {
      const car = cars.find((c) => c.id === part.carId);
      return { ...part, car: car ?? null };
    });
  }
  res.json(result);
});

api.get('/carParts/:id', (req, res) => {
  const id = Number(req.params.id);
  const part = carParts.find((p) => p.id === id);
  if (!part) return res.status(404).json({ error: 'Car part not found' });
  const expand = req.query._expand;
  let result = { ...part };
  if (expand === 'car') {
    result.car = cars.find((c) => c.id === part.carId) ?? null;
  }
  res.json(result);
});

api.post('/carParts', (req, res) => {
  const { name, carId, partNumber } = req.body;
  const part = {
    id: nextId(carParts),
    name: name ?? '',
    carId: carId != null ? Number(carId) : null,
    partNumber: partNumber ?? '',
  };
  carParts.push(part);
  res.status(201).json(part);
});

api.put('/carParts/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = carParts.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Car part not found' });
  const { name, carId, partNumber } = req.body;
  carParts[idx] = {
    id,
    name: name ?? carParts[idx].name,
    carId: carId != null ? Number(carId) : carParts[idx].carId,
    partNumber: partNumber ?? carParts[idx].partNumber,
  };
  res.json(carParts[idx]);
});

api.patch('/carParts/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = carParts.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Car part not found' });
  const updates = { ...req.body };
  if (updates.carId != null) updates.carId = Number(updates.carId);
  carParts[idx] = { ...carParts[idx], ...updates, id };
  res.json(carParts[idx]);
});

api.delete('/carParts/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = carParts.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Car part not found' });
  carParts.splice(idx, 1);
  res.status(204).send();
});

loadSeedData();

app.use('/api', api);

// Serve Angular static build when present (e.g. in Docker/production)
const staticDir = path.join(__dirname, '..', 'dist', 'cars-ngrx', 'browser');
if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('API: /api/login, /api/cars, /api/carParts');
  if (fs.existsSync(staticDir)) {
    console.log('Serving frontend from dist/cars-ngrx/browser');
  }
});
