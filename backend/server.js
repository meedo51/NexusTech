require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/apps');
const heroRoutes = require('./routes/hero');
const socialRoutes = require('./routes/social');
const uploadRoutes = require('./routes/upload');
const profileRoutes = require('./routes/profile');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;
const API_PORT = process.env.API_PORT || 7788;

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: [process.env.CORS_ORIGIN || 'http://localhost:7788'].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many login attempts. Try again later.' } });
const sensitiveLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many attempts. Try again later.' } });

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/verify-2fa', authLimiter);
app.use('/api/profile/password', sensitiveLimiter);
app.use('/api/profile/email', sensitiveLimiter);
app.use('/api/profile/2fa/enable', sensitiveLimiter);
app.use('/api/profile/2fa/disable', sensitiveLimiter);
app.use('/api/profile/2fa/verify', sensitiveLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - ALL under /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/apps', appRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'NexusTech API is running',
    port: API_PORT,
    timestamp: new Date().toISOString()
  });
});

// Catch-all for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/nexustech';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected on port 27018');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`NexusTech Backend running on port ${PORT}`);
      console.log(`API available at http://localhost:${API_PORT}/api`);
      console.log(`Health check: http://localhost:${API_PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
