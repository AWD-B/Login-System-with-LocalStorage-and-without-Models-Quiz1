// src/component/ServiceHistory.jsx - FIXED VERSION
import React from 'react';
import { serviceAPI } from '../services/serviceAPI';
import { Trash2, Edit, Calculator, Scale, ChefHat, Heart } from 'lucide-react';

const ServiceHistory = ({ 
  history = {},
  onDelete 
}) => {
  
  // Destructure the history object with fallbacks
  const { 
    ageCalculations = [], 
    weightRecords = [], 
    recipes = [],
    names = []
  } = history;

  const handleDeleteRecord = async (serviceType, id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      // Call the parent's delete handler
      if (onDelete) {
        onDelete(id, serviceType);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete record');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'age': return <Calculator size={16} />;
      case 'weight': return <Scale size={16} />;
      case 'recipe': return <ChefHat size={16} />;
      case 'name': return <Heart size={16} />;
      default: return <Calculator size={16} />;
    }
  };

  const getPetEmoji = (petType) => {
    switch (petType) {
      case 'dog': return '🐕';
      case 'cat': return '🐈';
      case 'rabbit': return '🐇';
      case 'bird': return '🐦';
      default: return '🐾';
    }
  };

  return (
    <div 
  className="service-history" 
  style={{
    background: 'transparent'
  }}
>
      <h3 className="history-title">Your Service History</h3>
      
      <div className="history-grid">
        {/* Age Calculations */}
        {ageCalculations.length > 0 && (
          <div className="history-category">
            <h4 className="category-title">
              <Calculator size={20} />
              Age Calculations ({ageCalculations.length})
            </h4>
            <div className="history-items">
              {ageCalculations.slice(0, 5).map(calc => (
                <div key={calc.id || calc._id} className="history-item age-calculation">
                  <div className="item-header">
                    <span className="pet-emoji">{getPetEmoji(calc.petType)}</span>
                    <span className="item-title">{calc.petName}: {calc.petAge}y → {calc.humanAge}y</span>
                    <button 
                      onClick={() => handleDeleteRecord('age', calc.id || calc._id)}
                      className="delete-btn"
                      title="Delete calculation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="item-details">
                    <span className="life-stage">{calc.lifeStage}</span>
                    <span className="item-date">{formatDate(calc.timestamp || calc.calculationDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weight Records */}
        {weightRecords.length > 0 && (
          <div className="history-category">
            <h4 className="category-title">
              <Scale size={20} />
              Weight Records ({weightRecords.length})
            </h4>
            <div className="history-items">
              {weightRecords.slice(0, 5).map(record => (
                <div key={record.id || record._id} className="history-item weight-record">
                  <div className="item-header">
                    <span className="weight-value">{record.weight}kg</span>
                    <span className={`bmi-status ${record.condition?.toLowerCase()}`}>
                      {record.condition}
                    </span>
                    <button 
                      onClick={() => handleDeleteRecord('weight', record.id || record._id)}
                      className="delete-btn"
                      title="Delete record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="item-details">
                    <span className="bmi-score">BMI: {record.bmiScore}</span>
                    <span className="item-date">{formatDate(record.timestamp || record.measurementDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Generations */}
       {/* Recipe Generations */}
{recipes.length > 0 && (
  <div className="history-category">
    <h4 className="category-title">
      <ChefHat size={20} />
      Recent Recipes ({recipes.length})
    </h4>
    <div className="history-items">
      {recipes.slice(0, 5).map(recipe => (
        <div key={recipe.id || recipe._id} className="history-item recipe-generation">
          <div className="item-header">
            <span className="recipe-name">{recipe.name || 'Generated Recipes'}</span>
            <button 
              onClick={() => handleDeleteRecord('recipe', recipe.id || recipe._id)}
              className="delete-btn"
              title="Delete recipes"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="item-details">
            <span className="criteria">
              For: {recipe.petInfo?.petType || recipe.petType || 'pet'}
            </span>
            <span className="item-date">{formatDate(recipe.timestamp || recipe.generationDate)}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
        {/* Name Generations */}
        {names.length > 0 && (
          <div className="history-category">
            <h4 className="category-title">
              <Heart size={20} />
              Favorite Names ({names.length})
            </h4>
            <div className="history-items">
              {names.slice(0, 5).map(nameItem => (
                <div key={nameItem.id || nameItem._id} className="history-item name-generation">
                  <div className="item-header">
                    <span className="names-count">
                      {nameItem.favorites?.length || 1} favorites
                    </span>
                    <button 
                      onClick={() => handleDeleteRecord('name', nameItem.id || nameItem._id)}
                      className="delete-btn"
                      title="Delete names"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="item-details">
                    <span className="name-preferences">
                      Style: {nameItem.preferences?.style || 'cute'}
                    </span>
                    <span className="item-date">{formatDate(nameItem.timestamp || nameItem.generationDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {ageCalculations.length === 0 && weightRecords.length === 0 && 
         recipes.length === 0 && names.length === 0 && (
          <div className="empty-history">
            <div className="empty-icon">📊</div>
            <p>No activity yet</p>
            <small>Use the services above to see your history here!</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceHistory;