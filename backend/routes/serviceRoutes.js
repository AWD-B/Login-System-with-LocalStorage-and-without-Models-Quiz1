// routes/serviceRoutes.js - All service API endpoints
const express = require('express');
const authMiddleware = require('../middleware/auth');
const { uploadSingle, handleUploadErrors } = require('../middleware/fileUpload');
const {
  AgeCalculation,
  WeightRecord,
  BreedIdentification,
  RecipeGeneration,
  NameGeneration,
  GuideDownload,
  ChartGeneration
} = require('../models/ServiceData');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// ========== AGE CALCULATOR ENDPOINTS ==========

// @desc    Calculate pet age and save calculation
// @route   POST /api/services/age
// @access  Private
router.post('/age', async (req, res) => {
  try {
    const { petType, petAge, breedSize, humanAge, lifeStage } = req.body;

    // Validation
    if (!petType || !petAge || !humanAge) {
      return res.status(400).json({
        message: 'Pet type, age, and human age are required'
      });
    }

    // Save calculation
    const calculation = new AgeCalculation({
      userId: req.user._id,
      petType,
      petAge: parseFloat(petAge),
      humanAge: parseFloat(humanAge),
      breedSize,
      lifeStage
    });

    await calculation.save();

    res.status(201).json({
      message: 'Age calculation saved successfully',
      calculation: {
        id: calculation._id,
        petType: calculation.petType,
        petAge: calculation.petAge,
        humanAge: calculation.humanAge,
        lifeStage: calculation.lifeStage,
        calculatedAt: calculation.calculationDate
      }
    });

  } catch (error) {
    console.error('Age calculation error:', error);
    res.status(500).json({
      message: 'Server error during age calculation'
    });
  }
});

// @desc    Get user's age calculation history
// @route   GET /api/services/age/history
// @access  Private
router.get('/age/history', async (req, res) => {
  try {
    const calculations = await AgeCalculation.find({ userId: req.user._id })
      .sort({ calculationDate: -1 })
      .limit(10);

    res.json({
      message: 'Age calculation history retrieved',
      calculations: calculations.map(calc => ({
        id: calc._id,
        petType: calc.petType,
        petAge: calc.petAge,
        humanAge: calc.humanAge,
        lifeStage: calc.lifeStage,
        calculatedAt: calc.calculationDate
      }))
    });

  } catch (error) {
    console.error('Get age history error:', error);
    res.status(500).json({
      message: 'Server error retrieving age history'
    });
  }
});

// ========== WEIGHT/BMI CHECKER ENDPOINTS ==========

// @desc    Calculate and save weight/BMI record
// @route   POST /api/services/bmi
// @access  Private
router.post('/bmi', async (req, res) => {
  try {
    const { petType, weight, bmiScore, condition, recommendations } = req.body;

    // Validation
    if (!petType || !weight || !bmiScore || !condition) {
      return res.status(400).json({
        message: 'Pet type, weight, BMI score, and condition are required'
      });
    }

    // Save weight record
    const record = new WeightRecord({
      userId: req.user._id,
      petType,
      weight: parseFloat(weight),
      bmiScore: parseFloat(bmiScore),
      condition,
      recommendations: recommendations || []
    });

    await record.save();

    res.status(201).json({
      message: 'Weight record saved successfully',
      record: {
        id: record._id,
        petType: record.petType,
        weight: record.weight,
        bmiScore: record.bmiScore,
        condition: record.condition,
        recommendations: record.recommendations,
        measuredAt: record.measurementDate
      }
    });

  } catch (error) {
    console.error('BMI calculation error:', error);
    res.status(500).json({
      message: 'Server error during BMI calculation'
    });
  }
});

// @desc    Get user's weight history
// @route   GET /api/services/bmi/history
// @access  Private
router.get('/bmi/history', async (req, res) => {
  try {
    const records = await WeightRecord.find({ userId: req.user._id })
      .sort({ measurementDate: -1 })
      .limit(20);

    res.json({
      message: 'Weight history retrieved',
      records: records.map(record => ({
        id: record._id,
        petType: record.petType,
        weight: record.weight,
        bmiScore: record.bmiScore,
        condition: record.condition,
        measuredAt: record.measurementDate
      }))
    });

  } catch (error) {
    console.error('Get weight history error:', error);
    res.status(500).json({
      message: 'Server error retrieving weight history'
    });
  }
});

// ========== BREED IDENTIFICATION ENDPOINTS ==========

// @desc    Identify breed from uploaded image
// @route   POST /api/services/breeds/identify
// @access  Private
router.post('/breeds/identify', uploadSingle, handleUploadErrors, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No image file uploaded'
      });
    }

    // In a real application, you would integrate with an AI service here
    // For demo purposes, we'll simulate breed identification
    
    const simulatedBreeds = [
      {
        name: "Golden Retriever",
        confidence: 95,
        description: "Friendly, intelligent and devoted.",
        characteristics: ["Friendly", "Intelligent", "Devoted"],
        size: "Large",
        lifeSpan: "10-12 years"
      },
      {
        name: "Labrador Retriever", 
        confidence: 88,
        description: "Outgoing, even-tempered and gentle.",
        characteristics: ["Outgoing", "Even-tempered", "Gentle"],
        size: "Large",
        lifeSpan: "10-12 years"
      },
      {
        name: "German Shepherd",
        confidence: 82,
        description: "Confident, courageous and smart.",
        characteristics: ["Confident", "Courageous", "Smart"],
        size: "Large", 
        lifeSpan: "9-13 years"
      }
    ];

    // Select random breed for demo
    const identifiedBreed = simulatedBreeds[Math.floor(Math.random() * simulatedBreeds.length)];

    // Save identification record
    const identification = new BreedIdentification({
      userId: req.user._id,
      imageUrl: `/uploads/${req.file.filename}`,
      identifiedBreed: identifiedBreed.name,
      confidence: identifiedBreed.confidence,
      manualIdentification: false
    });

    await identification.save();

    res.json({
      message: 'Breed identification completed',
      identification: {
        id: identification._id,
        breed: identifiedBreed,
        confidence: identifiedBreed.confidence,
        imageUrl: identification.imageUrl,
        identifiedAt: identification.identificationDate
      }
    });

  } catch (error) {
    console.error('Breed identification error:', error);
    res.status(500).json({
      message: 'Server error during breed identification'
    });
  }
});

// @desc    Manual breed identification
// @route   POST /api/services/breeds/manual
// @access  Private
router.post('/breeds/manual', async (req, res) => {
  try {
    const { traits } = req.body;

    // Simple trait-based matching (in real app, use proper algorithm)
    const breedMatches = await matchBreedByTraits(traits);

    // Save manual identification
    const identification = new BreedIdentification({
      userId: req.user._id,
      identifiedBreed: breedMatches[0]?.name || 'Mixed Breed',
      confidence: 75, // Lower confidence for manual identification
      manualIdentification: true,
      traits: traits
    });

    await identification.save();

    res.json({
      message: 'Manual breed identification completed',
      identification: {
        id: identification._id,
        breeds: breedMatches,
        confidence: identification.confidence,
        manual: true,
        identifiedAt: identification.identificationDate
      }
    });

  } catch (error) {
    console.error('Manual breed identification error:', error);
    res.status(500).json({
      message: 'Server error during manual breed identification'
    });
  }
});

// ========== RECIPE GENERATOR ENDPOINTS ==========

// @desc    Generate pet food recipes
// @route   POST /api/services/recipes
// @access  Private
router.post('/recipes', async (req, res) => {
  try {
    const { criteria } = req.body;

    // Generate recipes based on criteria
    const recipes = await generateRecipes(criteria);

    // Save recipe generation
    const generation = new RecipeGeneration({
      userId: req.user._id,
      criteria: criteria,
      generatedRecipes: recipes
    });

    await generation.save();

    res.json({
      message: 'Recipes generated successfully',
      recipes: recipes,
      generationId: generation._id
    });

  } catch (error) {
    console.error('Recipe generation error:', error);
    res.status(500).json({
      message: 'Server error during recipe generation'
    });
  }
});

// ========== NAME GENERATOR ENDPOINTS ==========

// @desc    Generate pet names
// @route   POST /api/services/names
// @access  Private
router.post('/names', async (req, res) => {
  try {
    const { preferences } = req.body;

    // Generate names based on preferences
    const names = await generateNames(preferences);

    // Save name generation
    const generation = new NameGeneration({
      userId: req.user._id,
      preferences: preferences,
      generatedNames: names
    });

    await generation.save();

    res.json({
      message: 'Names generated successfully',
      names: names,
      generationId: generation._id
    });

  } catch (error) {
    console.error('Name generation error:', error);
    res.status(500).json({
      message: 'Server error during name generation'
    });
  }
});

// @desc    Save favorite names
// @route   POST /api/services/names/favorites
// @access  Private
router.post('/names/favorites', async (req, res) => {
  try {
    const { favorites } = req.body;

    // Update user's favorite names
    await NameGeneration.findOneAndUpdate(
      { userId: req.user._id },
      { $addToSet: { favorites: { $each: favorites } } },
      { upsert: true, new: true }
    );

    res.json({
      message: 'Favorite names saved successfully',
      favorites: favorites
    });

  } catch (error) {
    console.error('Save favorites error:', error);
    res.status(500).json({
      message: 'Server error saving favorite names'
    });
  }
});

// ========== GUIDE DOWNLOAD ENDPOINTS ==========

// @desc    Get available guides
// @route   GET /api/services/guides
// @access  Private
router.get('/guides', async (req, res) => {
  try {
    const guides = await getAvailableGuides();
    
    res.json({
      message: 'Guides retrieved successfully',
      guides: guides,
      count: guides.length
    });

  } catch (error) {
    console.error('Get guides error:', error);
    res.status(500).json({
      message: 'Server error retrieving guides'
    });
  }
});

// @desc    Download guide and track
// @route   POST /api/services/guides/:guideId/download
// @access  Private
router.post('/guides/:guideId/download', async (req, res) => {
  try {
    const { guideId } = req.params;

    // Track download
    const download = new GuideDownload({
      userId: req.user._id,
      guideId: guideId,
      guideTitle: `Guide ${guideId}`,
      deviceType: req.headers['user-agent'] || 'Unknown'
    });

    await download.save();

    // In real app, serve the actual PDF file
    res.json({
      message: 'Guide download tracked successfully',
      download: {
        id: download._id,
        guideId: download.guideId,
        downloadedAt: download.downloadDate
      }
    });

  } catch (error) {
    console.error('Guide download error:', error);
    res.status(500).json({
      message: 'Server error during guide download'
    });
  }
});

// ========== CHART GENERATOR ENDPOINTS ==========

// @desc    Generate printable chart
// @route   POST /api/services/charts
// @access  Private
router.post('/charts', async (req, res) => {
  try {
    const { chartType, chartData } = req.body;

    // Save chart generation
    const chart = new ChartGeneration({
      userId: req.user._id,
      chartType: chartType,
      chartData: chartData
    });

    await chart.save();

    res.json({
      message: 'Chart generated successfully',
      chart: {
        id: chart._id,
        type: chart.chartType,
        data: chart.chartData,
        generatedAt: chart.generationDate
      }
    });

  } catch (error) {
    console.error('Chart generation error:', error);
    res.status(500).json({
      message: 'Server error during chart generation'
    });
  }
});

// ========== HELPER FUNCTIONS ==========

// Breed matching helper (simplified)
async function matchBreedByTraits(traits) {
  // This would query your breed database
  // For now, return sample matches
  return [
    {
      name: "Mixed Breed",
      confidence: 75,
      description: "A wonderful mix of characteristics!",
      characteristics: ["Unique", "Adaptable", "Loving"],
      size: traits.size || "Medium",
      lifeSpan: "12-15 years"
    }
  ];
}

// Recipe generation helper
async function generateRecipes(criteria) {
  // This would query your recipe database
  // For now, return sample recipes
  const sampleRecipes = [
    {
      name: "Chicken & Rice Delight",
      ingredients: [
        { name: "Chicken Breast", amount: "200g", note: "Cooked and shredded" },
        { name: "Brown Rice", amount: "1 cup", note: "Cooked" }
      ],
      instructions: [
        "Cook chicken thoroughly",
        "Prepare rice",
        "Mix ingredients together"
      ],
      nutrition: {
        calories: "350 kcal",
        protein: "25g",
        carbs: "45g",
        fat: "8g"
      },
      cookingTime: 30,
      difficulty: "easy",
      suitableFor: ["sensitive_stomach"]
    }
  ];
  
  return sampleRecipes.filter(recipe => 
    recipe.suitableFor.some(condition => 
      criteria.healthConditions?.includes(condition)
    )
  );
}

// Name generation helper
async function generateNames(preferences) {
  const nameDatabase = {
    dog: {
      cute: ['Buddy', 'Bella', 'Coco', 'Luna', 'Charlie'],
      funny: ['Bark Twain', 'Sir Waggington', 'Chewbacca'],
      unique: ['Zephyr', 'Koda', 'Nova', 'Atlas']
    },
    cat: {
      cute: ['Whiskers', 'Mittens', 'Simba', 'Luna'],
      funny: ['Catniss', 'Purrcival', 'Meowly Cyrus'],
      unique: ['Nimbus', 'Saffron', 'Pippin', 'Zara']
    }
  };

  const petNames = nameDatabase[preferences.petType] || nameDatabase.dog;
  return petNames[preferences.style] || petNames.cute;
}

// Guide retrieval helper
async function getAvailableGuides() {
  return [
    {
      id: 1,
      title: "Complete Dog Training Guide",
      description: "Step-by-step training techniques",
      category: "training",
      petType: "dog",
      fileSize: "2.4 MB",
      pages: 45,
      rating: 4.8,
      downloads: 1250
    },
    {
      id: 2,
      title: "Cat Grooming Mastery", 
      description: "Professional grooming tips",
      category: "grooming",
      petType: "cat",
      fileSize: "1.8 MB",
      pages: 32,
      rating: 4.9,
      downloads: 890
    }
  ];
}

module.exports = router;