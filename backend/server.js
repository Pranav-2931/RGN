const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ FATAL: MONGO_URI environment variable is not set. Check Render environment variables.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ RGN MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// Simple User Schema
const userSchema = new mongoose.Schema({
  gamertag: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Member' }
});

const User = mongoose.model('User', userSchema);

// Health Check Route
app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: state === 1 ? '✅ OK' : '❌ DOWN',
    database: states[state] || 'unknown',
    dbName: mongoose.connection.name || 'N/A',
    host: mongoose.connection.host || 'N/A',
    timestamp: new Date().toISOString()
  });
});

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { gamertag, email, password } = req.body;
    const newUser = new User({ gamertag, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Hero Registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });
    res.json({ message: 'Welcome back, Hero', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const path = require('path');

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'dist');
  console.log('SUCCESS: Serving static files from:', distPath);

  app.use(express.static(distPath));

  app.use((req, res) => {
    const indexPath = path.resolve(distPath, 'index.html');
    res.sendFile(indexPath);
  });
} else {
  console.log('DEBUG: Not in production mode (NODE_ENV is:', process.env.NODE_ENV, ')');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 RGN Backend running on port ${PORT}`));
