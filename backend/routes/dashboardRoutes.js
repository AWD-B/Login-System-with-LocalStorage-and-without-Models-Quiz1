// backend/routes/dashboardRoutes.js - Dashboard service data management
const express = require('express');
const authMiddleware = require('../middleware/auth');
const { AgeCalculation, WeightRecord, RecipeGeneration, NameGeneration } = require('../models/ServiceData');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// ========== DASHBOARD DATA ENDPOINTS ==========

// @desc    Get all user's service data for dashboard
// @route   GET /api/dashboard/data
// @access  Private
router.get('/data', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get recent data from all services
    const [ageCalculations, weightRecords, recipeGenerations, nameGenerations] = await Promise.all([
      AgeCalculation.find({ userId }).sort({ createdAt: -1 }).limit(5),
      WeightRecord.find({ userId }).sort({ measurementDate: -1 }).limit(5),
      RecipeGeneration.find({ userId }).sort({ generationDate: -1 }).limit(3),
      NameGeneration.find({ userId }).sort({ generationDate: -1 }).limit(1)
    ]);

    res.json({
      message: 'Dashboard data retrieved successfully',
      data: {
        ageCalculations,
        weightRecords, 
        recipeGenerations,
        nameGenerations
      }
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      message: 'Server error retrieving dashboard data'
    });
  }
});

// @desc    Delete service calculation
// @route   DELETE /api/dashboard/:serviceType/:id
// @access  Private
router.delete('/:serviceType/:id', async (req, res) => {
  try {
    const { serviceType, id } = req.params;
    const userId = req.user._id;

    let Model;
    switch (serviceType) {
      case 'age':
        Model = AgeCalculation;
        break;
      case 'weight':
        Model = WeightRecord;
        break;
      case 'recipe':
        Model = RecipeGeneration;
        break;
      case 'name':
        Model = NameGeneration;
        break;
      default:
        return res.status(400).json({ message: 'Invalid service type' });
    }

    const deleted = await Model.findOneAndDelete({ _id: id, userId });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({
      message: `${serviceType} record deleted successfully`,
      deletedId: id
    });

  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({
      message: 'Server error deleting record'
    });
  }
});

// @desc    Update service calculation
// @route   PUT /api/dashboard/:serviceType/:id
// @access  Private
router.put('/:serviceType/:id', async (req, res) => {
  try {
    const { serviceType, id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    let Model;
    switch (serviceType) {
      case 'age':
        Model = AgeCalculation;
        break;
      case 'weight':
        Model = WeightRecord;
        break;
      default:
        return res.status(400).json({ message: 'Invalid service type for update' });
    }

    const updated = await Model.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({
      message: `${serviceType} record updated successfully`,
      updatedRecord: updated
    });

  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({
      message: 'Server error updating record'
    });
  }
});

module.exports = router;