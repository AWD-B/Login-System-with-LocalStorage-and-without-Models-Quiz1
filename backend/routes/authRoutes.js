// routes/authRoutes.js - REPLACE COMPLETELY with this code
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ========== USERNAME AVAILABILITY CHECK ==========
router.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    
    console.log('🔍 Checking username availability for:', username);
    
    // Input validation
    if (!username || username.length < 3) {
      return res.status(400).json({ 
        available: false, 
        message: "Username must be at least 3 characters" 
      });
    }
    
    // Check if username exists in database
    const existingUser = await User.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });
    
    console.log('✅ Username check result:', existingUser ? 'taken' : 'available');
    
    res.json({ 
      available: !existingUser,
      message: existingUser ? "Username already taken" : "Username available"
    });
    
  } catch (error) {
    console.error('❌ Username check error:', error);
    res.status(500).json({ 
      available: false, 
      message: "Server error checking username" 
    });
  }
});

// ========== USER REGISTRATION ENDPOINT ==========
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('👤 Registration attempt:', { username, email });
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() }, 
        { username: { $regex: new RegExp(`^${username}$`, 'i') } }
      ]
    });
    
    if (existingUser) {
      const message = existingUser.email === email.toLowerCase() 
        ? "Email already registered" 
        : "Username already taken";
      
      console.log('❌ Registration failed:', message);
      return res.status(400).json({ message });
    }

    // Create user (password will be hashed by the User model pre-save hook)
    const user = await User.create({ 
      username: username.trim(), 
      email: email.toLowerCase().trim(), 
      password: password // Will be hashed automatically
    });

    console.log('✅ User registered successfully:', user.username);
    
    // Generate JWT token for immediate login after registration
    const token = jwt.sign(
      { id: user._id, username: user.username }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: "User registered successfully! 🎉",
      token: token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      }
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = `${field} already exists`;
      return res.status(400).json({ message });
    }
    
    res.status(500).json({ 
      message: "Server error during registration" 
    });
  }
});

// ========== USER LOGIN ENDPOINT ==========
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔐 Login attempt for username:', username);
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: "Username and password are required" 
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        { email: username.toLowerCase() }
      ]
    });

    // Security: Generic error message to prevent user enumeration
    if (!user) {
      console.log('❌ Login failed: User not found');
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    // Verify password using the model method
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password for user:', user.username);
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username,
        email: user.email 
      }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for user:', user.username);
    
    // Send success response with token and user data
    res.json({
      message: "Login successful! 🎉",
      token: token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      message: "Server error during login" 
    });
  }
});

// ========== AUTH TEST ROUTE ==========
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes are working! ✅',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;