const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

const nodemailer = require('nodemailer');

// Setup Nodemailer Transporter
let transporter;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  console.log('📬 Nodemailer configured with Custom SMTP:', process.env.SMTP_HOST);
} else {
  console.log('⚠️ SMTP environment variables not configured. Using console logging + Ethereal fallback for OTP.');
}

// Helper to send OTP email
async function sendOTPEmail(email, otp) {
  const subject = 'Ragnarheim Clan Initiation - Verify Identity';
  const html = `
    <div style="background-color: #0b0c10; color: #c5c6c7; font-family: 'Courier New', Courier, monospace; padding: 30px; border-radius: 8px; border: 2px solid #1f2833; max-width: 600px; margin: auto;">
      <h2 style="color: #66fcf1; text-align: center; border-bottom: 2px solid #1f2833; padding-bottom: 15px; text-transform: uppercase; letter-spacing: 2px;">Clan Initiation</h2>
      <p style="font-size: 1.1em; line-height: 1.6; color: #c5c6c7;">Greetings, Hero.</p>
      <p style="line-height: 1.6; color: #c5c6c7;">You have initiated request for entrance into the <strong>Ragnarheim System</strong>. To verify your identity and finalize your registration, use the following decrypted authentication key:</p>
      <div style="background-color: #1f2833; border: 1px dashed #66fcf1; color: #66fcf1; font-size: 2em; font-weight: bold; text-align: center; padding: 15px; margin: 25px 0; border-radius: 4px; letter-spacing: 5px;">
        ${otp}
      </div>
      <p style="font-size: 0.9em; color: #858585; line-height: 1.6;">This code is active for <strong>10 minutes</strong>. If you did not request this entrance, please ignore this transmission.</p>
      <div style="text-align: center; margin-top: 30px; border-top: 2px solid #1f2833; padding-top: 15px; font-size: 0.8em; color: #666;">
        Ragnarheim Security System // Sector 9
      </div>
    </div>
  `;

  console.log(`🔑 [OTP TRANSMISSION] Generated OTP for ${email}: ${otp}`);

  // Option 1: Use Resend HTTP API (Bypasses Render's port 587/465 outbound blocks completely!)
  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Ragnarheim <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: subject,
          html: html
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✅ [Resend HTTP] Email sent successfully to ${email} (ID: ${data.id})`);
        return;
      } else {
        console.error(`❌ [Resend HTTP] Failed to send via Resend API:`, data);
      }
    } catch (err) {
      console.error(`❌ [Resend HTTP] Network error while calling Resend:`, err.message);
    }
  }

  // Option 2: Use Nodemailer SMTP (Works on local dev and paid Render hosting)
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        html: html
      });
      console.log(`✅ [Nodemailer SMTP] Email sent successfully to ${email}`);
      return;
    } catch (err) {
      console.error(`❌ [Nodemailer SMTP] Failed to send SMTP email to ${email}:`, err.message);
    }
  }

  // Option 3: Ethereal Email fallback
  try {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    const info = await testTransporter.sendMail({
      from: '"Ragnarheim System" <noreply@ragnarheim.com>',
      to: email,
      subject: subject,
      html: html
    });
    console.log(`📬 [Ethereal Fallback] Message sent: %s`, info.messageId);
    console.log(`🔗 [Ethereal Fallback] Preview URL: %s`, nodemailer.getTestMessageUrl(info));
  } catch (fallbackErr) {
    console.log(`⚠️ Ethereal fallback could not initialize: ${fallbackErr.message}. (OTP is still printed in console above)`);
  }
}

// Simple User Schema
const userSchema = new mongoose.Schema({
  gamertag: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Member' },
  isVerified: { type: Boolean, default: true }, // Default true for existing users so they aren't locked out
  otp: { type: String },
  otpExpires: { type: Date }
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

// Admin Route - Get all users (no passwords)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { gamertag, email, password } = req.body;
    
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'Hero email is already registered.' });
      } else {
        // Delete stale unverified registration so we can create a clean one
        await User.deleteOne({ email, isVerified: false });
      }
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 3. Hash password and save new User
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      gamertag, 
      email, 
      password: hashedPassword,
      isVerified: false, // Explicitly false for new signups
      otp,
      otpExpires
    });
    
    await newUser.save();

    // 4. Send OTP email asynchronously
    sendOTPEmail(email, otp);

    res.status(201).json({ message: 'Initiation OTP sent to email. Verify to complete registration.', email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP key are required.' });
    }

    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(400).json({ message: 'Registration not found or already verified.' });
    }

    // Check expiration
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP key has expired. Please request a new one.' });
    }

    // Check OTP match
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP key.' });
    }

    // Verify and clean up OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Hero verification complete! Welcome to the clan.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(400).json({ message: 'Registration not found or already verified.' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send OTP email
    sendOTPEmail(email, otp);

    res.json({ message: 'A new initiation OTP has been sent to your email.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });
    
    // Check verification status
    if (user.isVerified === false) {
      return res.status(400).json({ message: 'Initiation incomplete. Please verify your email first.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid Credentials' });

    // Create encrypted JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret', // Always set this in Render!
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Welcome back, Hero', 
      token,
      user: {
        id: user._id,
        gamertag: user.gamertag,
        email: user.email,
        role: user.role
      }
    });
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
