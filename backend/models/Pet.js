// models/Pet.js - Pet Profile Model
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'fish', 'hamster', 'other']
  },
  breed: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  birthDate: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown']
  },
  image: {
    type: String, // URL for pet image
    default: ''
  },
  medicalHistory: [{
    condition: String,
    date: Date,
    notes: String
  }],
  preferences: {
    food: [String],
    activities: [String],
    allergies: [String]
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Create index for faster queries
petSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('Pet', petSchema);