// routes/petRoutes.js - CRUD Operations for Pets
const express = require('express');
const Pet = require('../models/Pet');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// @desc    Create a new pet profile
// @route   POST /api/pets
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { 
      name, type, breed, age, weight, birthDate, gender, 
      image, medicalHistory, preferences 
    } = req.body;

    // Validation
    if (!name || !type) {
      return res.status(400).json({ 
        message: 'Pet name and type are required' 
      });
    }

    // Create new pet
    const pet = new Pet({
      userId: req.user._id,
      name,
      type,
      breed,
      age,
      weight,
      birthDate,
      gender,
      image,
      medicalHistory,
      preferences
    });

    await pet.save();
    
    console.log(`✅ Pet profile created: ${name} for user ${req.user.username}`);
    
    res.status(201).json({
      message: 'Pet profile created successfully! 🎉',
      pet
    });

  } catch (error) {
    console.error('❌ Create pet error:', error);
    res.status(500).json({ 
      message: 'Server error creating pet profile' 
    });
  }
});

// @desc    Get all pets for logged-in user
// @route   GET /api/pets
// @access  Private
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    console.log(`📊 Retrieved ${pets.length} pets for user ${req.user.username}`);
    
    res.json({
      message: 'Pets retrieved successfully',
      count: pets.length,
      pets
    });

  } catch (error) {
    console.error('❌ Get pets error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving pets' 
    });
  }
});

// @desc    Get single pet by ID
// @route   GET /api/pets/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!pet) {
      return res.status(404).json({ 
        message: 'Pet not found' 
      });
    }

    res.json({
      message: 'Pet retrieved successfully',
      pet
    });

  } catch (error) {
    console.error('❌ Get pet error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving pet' 
    });
  }
});

// @desc    Update pet profile
// @route   PUT /api/pets/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!pet) {
      return res.status(404).json({ 
        message: 'Pet not found' 
      });
    }

    console.log(`✏️ Pet profile updated: ${pet.name}`);
    
    res.json({
      message: 'Pet profile updated successfully! ✅',
      pet
    });

  } catch (error) {
    console.error('❌ Update pet error:', error);
    res.status(500).json({ 
      message: 'Server error updating pet profile' 
    });
  }
});

// @desc    Delete pet profile
// @route   DELETE /api/pets/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!pet) {
      return res.status(404).json({ 
        message: 'Pet not found' 
      });
    }

    console.log(`🗑️ Pet profile deleted: ${pet.name}`);
    
    res.json({
      message: 'Pet profile deleted successfully',
      deletedPet: pet
    });

  } catch (error) {
    console.error('❌ Delete pet error:', error);
    res.status(500).json({ 
      message: 'Server error deleting pet profile' 
    });
  }
});

module.exports = router;