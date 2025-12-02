// server.js - REPLACE COMPLETELY with this fixed code
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, './.env') });

const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins (for testing only)
  credentials: true
}));
app.use(express.json());

// Connect to Database
connectDB();

// Import Routes
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/api/auth', authRoutes);

// ========== HEALTH CHECK AND TEST ROUTES ==========
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint accessed!');
  res.json({ 
    message: 'Backend server is working! 🎉',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
// Add after your existing routes in server.js

// Import new routes
const petRoutes = require('./routes/petRoutes');
const authMiddleware = require('./middleware/auth');

// Use pet routes
app.use('/api/pets', petRoutes);

// Add this test route to verify auth middleware
app.get('/api/protected-test', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Protected route working! ✅',
    user: req.user.username 
  });
});

// Add after your existing routes in server.js

// Import service routes
const serviceRoutes = require('./routes/serviceRoutes');

// Use service routes
app.use('/api/services', serviceRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve guide files statically
app.use('/guides', express.static(path.join(__dirname, 'public', 'guides')));

// ========== ROOT ROUTE FOR API INFO ==========
app.get('/', (req, res) => {
  res.json({
    message: 'PetShop Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        checkUsername: 'GET /api/auth/check-username?username=test'
      },
      health: {
        test: 'GET /api/test',
        health: 'GET /api/health'
      }
    }
  });
});

// Import dashboard routes
const dashboardRoutes = require('./routes/dashboardRoutes');

// Use dashboard routes
app.use('/api/dashboard', dashboardRoutes);


// ========== 404 HANDLER (FIXED FOR EXPRESS 5) ==========
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ========== ERROR HANDLING MIDDLEWARE ==========
app.use((err, req, res, next) => {
  console.error('🚨 Global Error Handler:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n===================================');
  console.log('🚀 PETSHOP BACKEND SERVER STARTED');
  console.log('===================================');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('-----------------------------------');
  console.log('🔗 Available Endpoints:');
  console.log('   • GET  /api/test');
  console.log('   • GET  /api/health');
  console.log('   • GET  /api/auth/check-username?username=test');
  console.log('   • POST /api/auth/register');
  console.log('   • POST /api/auth/login');
  console.log('===================================\n');
});