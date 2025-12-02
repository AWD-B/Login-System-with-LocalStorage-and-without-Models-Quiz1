// components/services/AgeCalculator.jsx - Pet Age Calculator with Cute Animations
import React, { useState, useEffect } from 'react';
import { serviceAPI } from "../../services/serviceAPI";
import "../../styles/Services.css";

// Icons
import { Calculator, Heart, Calendar, Zap, Save } from 'lucide-react';

const AgeCalculator = () => {
  const [formData, setFormData] = useState({
    petType: 'dog',
    petAge: '',
    breedSize: 'medium',
    birthDate: ''
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [animation, setAnimation] = useState('');

  // Pet type configurations
  const petTypes = [
    { value: 'dog', label: '🐕 Dog', conversionRate: 7 },
    { value: 'cat', label: '🐈 Cat', conversionRate: 4 },
    { value: 'rabbit', label: '🐇 Rabbit', conversionRate: 8 },
    { value: 'hamster', label: '🐹 Hamster', conversionRate: 25 },
    { value: 'bird', label: '🐦 Bird', conversionRate: 5 },
    { value: 'fish', label: '🐠 Fish', conversionRate: 1 }
  ];

  const breedSizes = [
    { value: 'small', label: 'Small', icon: '🐭' },
    { value: 'medium', label: 'Medium', icon: '🐕' },
    { value: 'large', label: 'Large', icon: '🐺' }
  ];

  // Calculate age locally for instant feedback
  const calculateAge = async (e) => {
    e.preventDefault();
    if (!formData.petAge) return;

    setIsLoading(true);
    setAnimation('calculating');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const petConfig = petTypes.find(pet => pet.value === formData.petType);
      const humanAge = parseFloat(formData.petAge) * petConfig.conversionRate;
      
      const calculationResult = {
        petAge: formData.petAge,
        humanAge: Math.round(humanAge * 10) / 10,
        petType: formData.petType,
        lifeStage: getLifeStage(humanAge, formData.petType),
        message: getAgeMessage(humanAge, formData.petType),
        timestamp: new Date().toISOString()
      };

      setResult(calculationResult);
      setAnimation('success');
      
      // Save to history
      setHistory(prev => [calculationResult, ...prev.slice(0, 4)]);
      
      // Save to backend if user is logged in
      const token = localStorage.getItem('authToken');
      if (token) {
        await serviceAPI.calculateAge(calculationResult);
      }

    } catch (error) {
      console.error('Calculation error:', error);
      setAnimation('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getLifeStage = (humanAge, petType) => {
    if (petType === 'dog') {
      if (humanAge < 2) return 'Puppy 🐾';
      if (humanAge < 7) return 'Adult 🐕';
      return 'Senior 🐶';
    }
    if (petType === 'cat') {
      if (humanAge < 1) return 'Kitten 😺';
      if (humanAge < 7) return 'Adult 🐈';
      return 'Senior 🐱';
    }
    return 'Adult';
  };

  const getAgeMessage = (humanAge, petType) => {
    const messages = {
      dog: [
        "Just a baby! Lots of energy and learning ahead! 🎾",
        "In their prime! Perfect time for adventures! 🌟",
        "A wise companion! Extra love and care needed! 💝"
      ],
      cat: [
        "Playful kitten days! So much curiosity! 🧶",
        "Majestic adult cat! Independent and graceful! 👑",
        "Senior sweetheart! Cherish every moment! 🛌"
      ]
    };
    
    const petMessages = messages[petType] || ["Your pet is wonderful at any age! 💕"];
    if (humanAge < 2) return petMessages[0];
    if (humanAge < 10) return petMessages[1];
    return petMessages[2];
  };

  const saveCalculation = () => {
    localStorage.setItem('ageCalculations', JSON.stringify(history));
    setAnimation('saved');
    setTimeout(() => setAnimation(''), 2000);
  };

  return (
    <div className="service-page age-calculator">
      {/* Animated Header */}
      <div className="service-header">
        <div className="header-icon">
          <Calculator size={32} />
        </div>
        <h1>Pet Age Calculator</h1>
        <p>Discover your pet's age in human years! 🐾</p>
      </div>

      <div className="calculator-container">
        {/* Input Form */}
        <div className="input-section">
          <form onSubmit={calculateAge} className="age-form">
            <div className="form-grid">
              {/* Pet Type Selection */}
              <div className="form-group">
                <label className="form-label">
                  <Heart size={16} />
                  Pet Type
                </label>
                <div className="pet-type-grid">
                  {petTypes.map(pet => (
                    <button
                      key={pet.value}
                      type="button"
                      className={`pet-type-btn ${formData.petType === pet.value ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, petType: pet.value }))}
                    >
                      <span className="pet-emoji">{pet.label.split(' ')[0]}</span>
                      <span className="pet-name">{pet.label.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Input */}
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} />
                  Pet's Age
                </label>
                <div className="age-input-container">
                  <input
                    type="number"
                    value={formData.petAge}
                    onChange={(e) => setFormData(prev => ({ ...prev, petAge: e.target.value }))}
                    placeholder="Enter age in years"
                    min="0"
                    max="50"
                    step="0.1"
                    className="age-input"
                    required
                  />
                  <span className="input-suffix">years</span>
                </div>
                <small className="input-hint">You can use decimals (e.g., 1.5 for 1 year 6 months)</small>
              </div>

              {/* Breed Size (for dogs) */}
              {formData.petType === 'dog' && (
                <div className="form-group">
                  <label className="form-label">
                    <Zap size={16} />
                    Breed Size
                  </label>
                  <div className="size-selector">
                    {breedSizes.map(size => (
                      <button
                        key={size.value}
                        type="button"
                        className={`size-btn ${formData.breedSize === size.value ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, breedSize: size.value }))}
                      >
                        <span className="size-emoji">{size.icon}</span>
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Calculate Button */}
            <button 
              type="submit" 
              className={`calculate-btn ${isLoading ? 'loading' : ''} ${animation}`}
              disabled={isLoading || !formData.petAge}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator size={20} />
                  Calculate Age
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className={`result-section ${animation}`}>
            <div className="result-card">
              <div className="result-header">
                <h3>Age Calculation Result</h3>
                <div className="result-badge">
                  {result.petType === 'dog' ? '🐕' : 
                   result.petType === 'cat' ? '🐈' : 
                   result.petType === 'rabbit' ? '🐇' : '🐾'}
                </div>
              </div>
              
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Pet's Age</span>
                  <span className="result-value highlight">{result.petAge} years</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Human Equivalent</span>
                  <span className="result-value highlight">{result.humanAge} years</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Life Stage</span>
                  <span className="result-value stage">{result.lifeStage}</span>
                </div>
              </div>

              <div className="result-message">
                <p>{result.message}</p>
              </div>

              {/* Save Button */}
              <button 
                onClick={saveCalculation}
                className="save-btn"
                disabled={animation === 'saved'}
              >
                <Save size={16} />
                {animation === 'saved' ? 'Saved! 💾' : 'Save Calculation'}
              </button>
            </div>
          </div>
        )}

        {/* Calculation History */}
        {history.length > 0 && (
          <div className="history-section">
            <h4>Recent Calculations</h4>
            <div className="history-grid">
              {history.map((calc, index) => (
                <div key={index} className="history-card">
                  <div className="history-pet">
                    {calc.petType === 'dog' ? '🐕' : 
                     calc.petType === 'cat' ? '🐈' : '🐾'}
                  </div>
                  <div className="history-details">
                    <span className="history-age">{calc.petAge} → {calc.humanAge}y</span>
                    <span className="history-stage">{calc.lifeStage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fun Facts */}
        <div className="fun-facts">
          <h4>Did You Know? 🤔</h4>
          <div className="facts-grid">
            <div className="fact-card">
              <span className="fact-emoji">🐕</span>
              <p>Small dogs live longer than large breeds!</p>
            </div>
            <div className="fact-card">
              <span className="fact-emoji">🐈</span>
              <p>Cats are considered seniors at 11+ human years</p>
            </div>
            <div className="fact-card">
              <span className="fact-emoji">🐇</span>
              <p>Rabbits age very quickly in their first year!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;