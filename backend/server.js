// server.js
console.log("🚀 Starting backend server...");
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------- Config ----------
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/networkdb';

// ---------- Connect Mongo ----------
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error', err));

// ---------- Schema ----------
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  role: { type: String, default: 'operator' }
});

const DeviceSchema = new Schema({
  name: String,
  status: String,
  location: String
});

const LogSchema = new Schema({
  deviceId: { type: Schema.Types.ObjectId, ref: 'Device', required: false },
  level: String,
  message: String,
  time: { type: Date, default: Date.now }
});

const AlertSchema = new Schema({
  title: String,
  severity: String,
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Device = mongoose.model('Device', DeviceSchema);
const Log = mongoose.model('Log', LogSchema);
const Alert = mongoose.model('Alert', AlertSchema);

// ---------- Helper ----------
function generateToken(user) {
  const payload = { id: user._id, name: user.name, email: user.email, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = payload;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

// ---------- Seed Data ----------
async function seedIfEmpty() {
  const usersCount = await User.countDocuments();
  if (usersCount === 0) {
    const saltRounds = 10;
    const adminHash = await bcrypt.hash('admin123', saltRounds);
    const opHash = await bcrypt.hash('operator123', saltRounds);

    await User.create([
      { name: 'Admin User', email: 'admin@example.com', passwordHash: adminHash, role: 'admin' },
      { name: 'Operator User', email: 'op@example.com', passwordHash: opHash, role: 'operator' }
    ]);
    console.log('🔧 Seeded users');
  }

  const devCount = await Device.countDocuments();
  if (devCount === 0) {
    const d = await Device.create([
      { name: 'Router #1', status: 'online', location: 'Floor 1' },
      { name: 'Router #2', status: 'offline', location: 'Floor 2' },
      { name: 'Switch #3', status: 'online', location: 'Rack 3' }
    ]);
    await Log.create([
      { deviceId: d[0]._id, level: 'info', message: 'Startup complete' },
      { deviceId: d[1]._id, level: 'critical', message: 'Device offline' },
    ]);
    await Alert.create([
      { title: 'Router #2 lost connection', severity: 'high' },
      { title: 'Switch #3 temperature high', severity: 'medium' }
    ]);
    console.log('🔧 Seeded devices, logs, alerts');
  }
}
seedIfEmpty().catch(console.error);

// ---------- Routes ----------
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/devices', authenticateToken, async (req, res) => {
  const devices = await Device.find();
  res.json({ devices });
});

app.get('/api/logs', authenticateToken, async (req, res) => {
  const logs = await Log.find().sort({ time: -1 });
  res.json({ logs });
});

app.get('/api/alerts', authenticateToken, async (req, res) => {
  const alerts = await Alert.find().sort({ date: -1 });
  res.json({ alerts });
});

app.get('/api/users', authenticateToken, requireRole('admin'), async (req, res) => {
  const users = await User.find().select('name email role');
  res.json({ users });
});

// ---------- Start ----------
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
