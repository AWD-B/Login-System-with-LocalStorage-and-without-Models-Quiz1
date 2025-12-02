// src/component/ServiceResultCard.jsx
import React from 'react';
import { 
  FaCalculator, 
  FaWeight, 
  FaUtensils, 
  FaSignature, 
  FaTrash,
  FaPaw,
  FaHeart,
  FaChartLine
} from 'react-icons/fa';

const ServiceResultCard = ({ result, onDelete }) => {
  if (!result) return null;

  // Get service type and configuration
  const getServiceConfig = (type) => {
    const configs = {
      age: { 
        icon: <FaCalculator />, 
        color: '#3B82F6', 
        label: 'Age Calculation',
        bgColor: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
      },
      weight: { 
        icon: <FaWeight />, 
        color: '#10B981', 
        label: 'Weight Check',
        bgColor: 'linear-gradient(135deg, #10B981 0%, #047857 100%)'
      },
      recipe: { 
        icon: <FaUtensils />, 
        color: '#F59E0B', 
        label: 'Recipe Generated',
        bgColor: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
      },
      name: { 
        icon: <FaSignature />, 
        color: '#EC4899', 
        label: 'Names Generated',
        bgColor: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
      }
    };
    return configs[type] || { icon: <FaPaw />, color: '#6B7280', label: 'Service Result' };
  };

  const config = getServiceConfig(result.type);
  
  // Format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render different content based on service type
  const renderContent = () => {
    switch (result.type) {
      case 'age':
        return (
          <div className="result-content">
            <div className="result-main">
              <span className="result-value">{result.petAge} years</span>
              <span className="result-arrow">→</span>
              <span className="result-value highlight">{result.humanAge} human years</span>
            </div>
            <div className="result-details">
              <span className="pet-type-badge">
                {result.petType === 'dog' ? '🐕' : 
                 result.petType === 'cat' ? '🐈' : '🐾'} 
                {result.petType}
              </span>
              <span className="life-stage">{result.lifeStage}</span>
            </div>
            {result.message && (
              <p className="result-message">{result.message}</p>
            )}
          </div>
        );

      case 'weight':
        const getConditionColor = (condition) => {
          const colors = {
            'Underweight': '#F59E0B',
            'Ideal Weight': '#10B981', 
            'Overweight': '#F59E0B',
            'Obese': '#EF4444'
          };
          return colors[condition] || '#6B7280';
        };

        return (
          <div className="result-content">
            <div className="result-main">
              <span className="result-value">{result.weight} kg</span>
              <span className="result-arrow">→</span>
              <span className="result-value">BMI: {result.bmiScore}</span>
            </div>
            <div className="result-details">
              <span 
                className="condition-badge"
                style={{ backgroundColor: getConditionColor(result.condition) }}
              >
                {result.condition}
              </span>
              <span className="pet-type-badge">
                {result.petType === 'dog' ? '🐕' : '🐈'} {result.petType}
              </span>
            </div>
            {result.recommendation && (
              <p className="result-message">{result.recommendation}</p>
            )}
          </div>
        );

      case 'recipe':
  return (
    <div className="result-content">
      <div className="result-main">
        <span className="result-value">{result.recipesCount || result.recipes?.length || 1} recipes</span>
      </div>
      <div className="result-details">
        <span className="pet-type-badge">
          For {result.petInfo?.petType || result.petType || 'pet'}
        </span>
        {result.name && (
          <span className="recipe-name">{result.name}</span>
        )}
      </div>
      {result.criteria && (
        <p className="result-message">
          Based on: {result.criteria.healthConditions?.join(', ') || 'standard diet'}
        </p>
      )}
    </div>
  );

      case 'name':
        return (
          <div className="result-content">
            <div className="result-main">
              <span className="result-value">{result.namesCount || result.names?.length || 5} names</span>
            </div>
            <div className="result-details">
              <span className="pet-type-badge">
                {result.preferences?.petType || 'Various'} names
              </span>
              <span className="style-badge">{result.preferences?.style || 'cute'}</span>
            </div>
            {result.favoritesCount > 0 && (
              <p className="result-message">
                {result.favoritesCount} favorites saved 💖
              </p>
            )}
          </div>
        );

      default:
        return (
          <div className="result-content">
            <div className="result-main">
              <span className="result-value">Service completed</span>
            </div>
            <p className="result-message">Check your service history for details</p>
          </div>
        );
    }
  };

};

export default ServiceResultCard;