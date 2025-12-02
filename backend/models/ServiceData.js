// models/ServiceData.js - Schema for service calculations & user data
const mongoose = require('mongoose');

// Age Calculation Schema
const ageCalculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  },
  petType: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'rabbit', 'bird', 'fish', 'hamster']
  },
  petAge: {
    type: Number,
    required: true
  },
  humanAge: {
    type: Number,
    required: true
  },
  breedSize: {
    type: String,
    enum: ['small', 'medium', 'large']
  },
  lifeStage: String,
  calculationDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Weight/BMI Record Schema
const weightRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  },
  weight: {
    type: Number,
    required: true
  },
  bmiScore: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['underweight', 'ideal', 'overweight', 'obese'],
    required: true
  },
  recommendations: [String],
  measurementDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Breed Identification Schema
const breedIdentificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: String,
  identifiedBreed: String,
  confidence: Number,
  manualIdentification: {
    type: Boolean,
    default: false
  },
  traits: {
    size: String,
    coat: String,
    ears: String,
    tail: String,
    color: String
  },
  identificationDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Recipe Generation Schema
const recipeGenerationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  criteria: {
    petType: String,
    weight: Number,
    age: Number,
    healthConditions: [String],
    ingredients: [String],
    cookingTime: String,
    difficulty: String
  },
  generatedRecipes: [{
    name: String,
    ingredients: [{
      name: String,
      amount: String,
      note: String
    }],
    instructions: [String],
    nutrition: {
      calories: String,
      protein: String,
      carbs: String,
      fat: String
    },
    cookingTime: Number,
    difficulty: String,
    suitableFor: [String]
  }],
  generationDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Name Generation Schema
const nameGenerationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  preferences: {
    petType: String,
    gender: String,
    style: String,
    length: String,
    startingLetter: String
  },
  generatedNames: [String],
  favorites: [String],
  generationDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Guide Download Schema
const guideDownloadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guideId: String,
  guideTitle: String,
  downloadDate: {
    type: Date,
    default: Date.now
  },
  deviceType: String
}, { timestamps: true });

// Chart Generation Schema
const chartGenerationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chartType: {
    type: String,
    enum: ['feeding', 'vaccination', 'medication', 'training', 'weight', 'grooming']
  },
  chartData: mongoose.Schema.Types.Mixed,
  generationDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create models
const AgeCalculation = mongoose.model('AgeCalculation', ageCalculationSchema);
const WeightRecord = mongoose.model('WeightRecord', weightRecordSchema);
const BreedIdentification = mongoose.model('BreedIdentification', breedIdentificationSchema);
const RecipeGeneration = mongoose.model('RecipeGeneration', recipeGenerationSchema);
const NameGeneration = mongoose.model('NameGeneration', nameGenerationSchema);
const GuideDownload = mongoose.model('GuideDownload', guideDownloadSchema);
const ChartGeneration = mongoose.model('ChartGeneration', chartGenerationSchema);

module.exports = {
  AgeCalculation,
  WeightRecord,
  BreedIdentification,
  RecipeGeneration,
  NameGeneration,
  GuideDownload,
  ChartGeneration
};