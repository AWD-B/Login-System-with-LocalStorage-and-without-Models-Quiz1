// components/services/WeightChecker.jsx - Pet Weight & BMI Checker
import React, { useState, useEffect } from 'react';
import { serviceAPI } from "../../services/serviceAPI";
import "../../styles/Services.css";

// Icons
import { Scale, Activity, Heart, TrendingUp, AlertTriangle } from 'lucide-react';

const WeightChecker = () => {
  const [formData, setFormData] = useState({
    petType: 'dog',
    weight: '',
    breed: '',
    age: '',
    length: '',
    gender: 'unknown'
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weightHistory, setWeightHistory] = useState([]);

  const petTypes = [
    { value: 'dog', label: '🐕 Dog', breeds: ['Labrador', 'German Shepherd', 'Golden Retriever', 'Bulldog', 'Poodle'] },
    { value: 'cat', label: '🐈 Cat', breeds: ['Siamese', 'Persian', 'Maine Coon', 'Bengal', 'Domestic Shorthair'] },
    { value: 'rabbit', label: '🐇 Rabbit', breeds: ['Dutch', 'Lionhead', 'Flemish Giant', 'Mini Rex'] }
  ];

  const calculateBMI = async (e) => {
    e.preventDefault();
    if (!formData.weight) return;

    setIsLoading(true);
    
    try {
      // Simulate calculation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const baseWeight = formData.petType === 'dog' ? 20 : 
                        formData.petType === 'cat' ? 4.5 : 2;
      
      const bmiScore = (parseFloat(formData.weight) / baseWeight * 100).toFixed(1);
      
      let condition, recommendation, color;
      
      if (bmiScore < 85) {
        condition = 'Underweight';
        recommendation = 'Consider increasing food portions and consult your vet';
        color = 'var(--warning-color)';
      } else if (bmiScore <= 115) {
        condition = 'Ideal Weight';
        recommendation = 'Perfect! Maintain current diet and exercise routine';
        color = 'var(--success-color)';
      } else if (bmiScore <= 130) {
        condition = 'Overweight';
        recommendation = 'Moderate exercise and diet adjustment recommended';
        color = 'var(--caution-color)';
      } else {
        condition = 'Obese';
        recommendation = 'Consult your vet for a weight management plan';
        color = 'var(--danger-color)';
      }

      const bmiResult = {
        bmiScore,
        condition,
        recommendation,
        color,
        timestamp: new Date().toISOString(),
        ...formData
      };

      setResult(bmiResult);
      setWeightHistory(prev => [bmiResult, ...prev.slice(0, 5)]);

    } catch (error) {
      console.error('BMI calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="service-page weight-checker">
      <div className="service-header">
        <div className="header-icon">
          <Scale size={32} />
        </div>
        <h1>Pet Weight & BMI Checker</h1>
        <p>Keep track of your pet's healthy weight range! ⚖️</p>
      </div>

      <div className="checker-container">
        <div className="input-section">
          <form onSubmit={calculateBMI} className="weight-form">
            <div className="form-grid">
              {/* Pet Type */}
              <div className="form-group">
                <label>Pet Type</label>
                <select 
                  value={formData.petType}
                  onChange={(e) => setFormData(prev => ({ ...prev, petType: e.target.value }))}
                >
                  {petTypes.map(pet => (
                    <option key={pet.value} value={pet.value}>
                      {pet.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight Input */}
              <div className="form-group">
                <label>
                  <Scale size={16} />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Enter weight"
                  step="0.1"
                  min="0.1"
                  required
                />
              </div>

              {/* Breed */}
              <div className="form-group">
                <label>Breed</label>
                <select 
                  value={formData.breed}
                  onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                >
                  <option value="">Select Breed</option>
                  {petTypes.find(pet => pet.value === formData.petType)?.breeds.map(breed => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </select>
              </div>

              {/* Age */}
              <div className="form-group">
                <label>Age (years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Pet's age"
                  step="0.1"
                  min="0"
                />
              </div>
            </div>

            <button type="submit" className="calculate-btn" disabled={isLoading}>
              {isLoading ? 'Calculating...' : 'Check Weight Health'}
            </button>
          </form>
        </div>

        {result && (
          <div className="result-section">
            <div className="bmi-result-card">
              <div className="bmi-score" style={{ color: result.color }}>
                <span className="score">{result.bmiScore}</span>
                <span className="label">BMI Score</span>
              </div>
              
              <div className="condition-indicator">
                <div 
                  className="condition-badge"
                  style={{ backgroundColor: result.color }}
                >
                  {result.condition}
                </div>
                <p className="recommendation">{result.recommendation}</p>
              </div>

              <div className="health-tips">
                <h4>Health Tips 💡</h4>
                <ul>
                  <li>Regular exercise and playtime</li>
                  <li>Balanced diet with proper portions</li>
                  <li>Regular vet checkups</li>
                  <li>Monitor weight monthly</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Weight Tracking Chart Area */}
        {weightHistory.length > 0 && (
          <div className="tracking-section">
            <h4>Weight History</h4>
            <div className="weight-timeline">
              {weightHistory.map((record, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot" style={{ backgroundColor: record.color }}></div>
                  <div className="timeline-content">
                    <span className="weight">{record.weight}kg</span>
                    <span className="condition">{record.condition}</span>
                    <span className="date">{new Date(record.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightChecker;