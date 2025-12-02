// src/component/services/AgeCalculatorModal.jsx - PROFESSIONAL CRUD VERSION
import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../../services/serviceAPI';
import { 
  Calculator, 
  Heart, 
  Calendar, 
  Zap, 
  X, 
  Edit3, 
  Trash2,
  Save,
  RotateCcw
} from 'lucide-react';

const AgeCalculatorModal = ({ isOpen, onClose, pet, onResult, editCalculation = null }) => {
  const [formData, setFormData] = useState({
    petType: 'dog',
    petAge: '',
    breedSize: 'medium',
    petName: ''
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const petTypes = [
    { value: 'dog', label: '🐕 Dog', conversionRate: 7 },
    { value: 'cat', label: '🐈 Cat', conversionRate: 4 },
    { value: 'rabbit', label: '🐇 Rabbit', conversionRate: 8 },
    { value: 'bird', label: '🐦 Bird', conversionRate: 5 }
  ];

  const breedSizes = [
    { value: 'small', label: 'Small', icon: '🐭' },
    { value: 'medium', label: 'Medium', icon: '🐕' },
    { value: 'large', label: 'Large', icon: '🐺' }
  ];

  // Handle edit mode
  useEffect(() => {
    if (editCalculation) {
      setIsEditing(true);
      setCurrentEditId(editCalculation.id);
      setFormData({
        petType: editCalculation.petType || 'dog',
        petAge: editCalculation.petAge || '',
        breedSize: editCalculation.breedSize || 'medium',
        petName: editCalculation.petName || ''
      });
      setResult(editCalculation);
    } else {
      setIsEditing(false);
      setCurrentEditId(null);
      if (pet) {
        setFormData(prev => ({
          ...prev,
          petType: pet.type || 'dog',
          breedSize: 'medium',
          petName: pet.name || ''
        }));
      } else {
        setFormData({
          petType: 'dog',
          petAge: '',
          breedSize: 'medium',
          petName: ''
        });
      }
    }
  }, [editCalculation, pet, isOpen]);

  // API Integration with Error Handling
  const saveCalculationToAPI = async (calculationData) => {
    try {
      if (isEditing && currentEditId) {
        // UPDATE operation
        const response = await serviceAPI.updateServiceRecord('age', currentEditId, calculationData);
        return response;
      } else {
        // CREATE operation
        const response = await serviceAPI.calculateAge(calculationData);
        return response;
      }
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to localStorage if API fails
      return { calculation: calculationData };
    }
  };

  const saveToLocalStorage = (calculation) => {
    try {
      const existingHistory = JSON.parse(localStorage.getItem('serviceHistory') || '{}');
      const ageCalculations = existingHistory.ageCalculations || [];
      
      let updatedCalculations;
      if (isEditing && currentEditId) {
        // Update existing calculation
        updatedCalculations = ageCalculations.map(item => 
          item.id === currentEditId ? { ...calculation, id: currentEditId } : item
        );
      } else {
        // Add new calculation
        updatedCalculations = [calculation, ...ageCalculations.slice(0, 49)]; // Keep last 50
      }
      
      const updatedHistory = {
        ...existingHistory,
        ageCalculations: updatedCalculations
      };
      
      localStorage.setItem('serviceHistory', JSON.stringify(updatedHistory));
      console.log(`✅ Age calculation ${isEditing ? 'updated' : 'saved'} to history`);
      
      return updatedCalculations;
    } catch (error) {
      console.error('❌ LocalStorage Error:', error);
      throw error;
    }
  };

  const calculateAge = async (e) => {
    e.preventDefault();
    if (!formData.petAge || !formData.petName) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const petConfig = petTypes.find(p => p.value === formData.petType);
      const humanAge = parseFloat(formData.petAge) * petConfig.conversionRate;
      
      const calculationResult = {
        id: isEditing ? currentEditId : Date.now().toString(),
        type: 'age',
        timestamp: new Date().toISOString(),
        petName: formData.petName,
        petAge: formData.petAge,
        humanAge: Math.round(humanAge * 10) / 10,
        petType: formData.petType,
        breedSize: formData.breedSize,
        lifeStage: getLifeStage(humanAge, formData.petType),
        message: getAgeMessage(humanAge, formData.petType),
        title: `Age Calculation for ${formData.petName}`,
        description: `${formData.petAge} years → ${Math.round(humanAge * 10) / 10} human years`,
        status: isEditing ? 'updated' : 'created'
      };

      // Try API first, fallback to localStorage
      await saveCalculationToAPI(calculationResult);
      
      // Always save to localStorage for consistency
      saveToLocalStorage(calculationResult);

      setResult(calculationResult);

      // Notify parent component
      if (onResult) {
        onResult(calculationResult);
      }

    } catch (error) {
      console.error('Calculation error:', error);
      alert('Failed to save calculation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCalculation = async () => {
    if (!result || !result.id) return;

    if (!window.confirm('Are you sure you want to delete this calculation?')) return;

    try {
      // Try API deletion
      try {
        await serviceAPI.deleteServiceRecord('age', result.id);
      } catch (apiError) {
        console.warn('API deletion failed, using localStorage:', apiError);
      }

      // Delete from localStorage
      const existingHistory = JSON.parse(localStorage.getItem('serviceHistory') || '{}');
      const updatedCalculations = (existingHistory.ageCalculations || []).filter(
        item => item.id !== result.id
      );
      
      localStorage.setItem('serviceHistory', JSON.stringify({
        ...existingHistory,
        ageCalculations: updatedCalculations
      }));

      // Notify parent
      if (onResult) {
        onResult({ type: 'deleted', id: result.id });
      }

      onClose();
    } catch (error) {
      console.error('Deletion error:', error);
      alert('Failed to delete calculation');
    }
  };

  const resetForm = () => {
    setFormData({
      petType: 'dog',
      petAge: '',
      breedSize: 'medium',
      petName: pet?.name || ''
    });
    setResult(null);
    setIsEditing(false);
    setCurrentEditId(null);
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="service-modal" style={{
        background: 'white',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        animation: 'modalSlideIn 0.3s ease-out'
      }}>
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 10,
          borderRadius: '20px 20px 0 0'
        }}>
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calculator size={24} style={{ color: '#3B82F6' }} />
            <h2 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem' }}>
              {isEditing ? 'Edit Age Calculation' : 'Pet Age Calculator'}
            </h2>
            {isEditing && (
              <span style={{
                background: '#F59E0B',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                Editing
              </span>
            )}
          </div>
          <button 
            className="close-btn" 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f3f4f6';
              e.target.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = '#6b7280';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-content" style={{ padding: '2rem' }}>
          {pet && !isEditing && (
            <div className="selected-pet-banner" style={{
              background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              textAlign: 'center',
              borderLeft: '4px solid #3b82f6'
            }}>
              Calculating for: <strong>{pet.name}</strong> 🐾
            </div>
          )}

          {!result ? (
            <form onSubmit={calculateAge} className="calculator-form" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div className="form-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    <Heart size={16} />
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    value={formData.petName}
                    onChange={(e) => setFormData(prev => ({ ...prev, petName: e.target.value }))}
                    placeholder="Enter pet's name"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    <Heart size={16} />
                    Pet Type
                  </label>
                  <div className="pet-type-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '0.5rem'
                  }}>
                    {petTypes.map(petType => (
                      <button
                        key={petType.value}
                        type="button"
                        className={`pet-type-btn ${formData.petType === petType.value ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, petType: petType.value }))}
                        style={{
                          padding: '1rem',
                          border: `2px solid ${formData.petType === petType.value ? '#3b82f6' : '#e5e7eb'}`,
                          borderRadius: '10px',
                          background: formData.petType === petType.value ? '#3b82f6' : 'white',
                          color: formData.petType === petType.value ? 'white' : '#374151',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span className="pet-emoji" style={{ fontSize: '1.5rem' }}>
                          {petType.label.split(' ')[0]}
                        </span>
                        <span className="pet-name" style={{ 
                          fontWeight: '600', 
                          fontSize: '0.9rem' 
                        }}>
                          {petType.label.split(' ')[1]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    <Calendar size={16} />
                    Pet's Age *
                  </label>
                  <div className="age-input-container" style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={formData.petAge}
                      onChange={(e) => setFormData(prev => ({ ...prev, petAge: e.target.value }))}
                      placeholder="Enter age in years"
                      min="0"
                      max="50"
                      step="0.1"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        paddingRight: '60px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <span className="input-suffix" style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      years
                    </span>
                  </div>
                  <small className="input-hint" style={{
                    color: '#6b7280',
                    fontSize: '0.8rem',
                    marginTop: '0.25rem',
                    display: 'block'
                  }}>
                    Use decimals for months (e.g., 1.5 = 1 year 6 months)
                  </small>
                </div>

                {formData.petType === 'dog' && (
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      <Zap size={16} />
                      Breed Size
                    </label>
                    <div className="size-selector" style={{ display: 'flex', gap: '0.5rem' }}>
                      {breedSizes.map(size => (
                        <button
                          key={size.value}
                          type="button"
                          className={`size-btn ${formData.breedSize === size.value ? 'active' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, breedSize: size.value }))}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: `2px solid ${formData.breedSize === size.value ? '#3b82f6' : '#e5e7eb'}`,
                            borderRadius: '10px',
                            background: formData.breedSize === size.value ? '#3b82f6' : 'white',
                            color: formData.breedSize === size.value ? 'white' : '#374151',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            justifyContent: 'center'
                          }}
                        >
                          <span className="size-emoji" style={{ fontSize: '1.25rem' }}>
                            {size.icon}
                          </span>
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className={`calculate-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || !formData.petAge || !formData.petName}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  opacity: (isLoading || !formData.petAge || !formData.petName) ? 0.6 : 1,
                  transform: (isLoading || !formData.petAge || !formData.petName) ? 'none' : 'translateY(0)'
                }}
                onMouseOver={(e) => {
                  if (!isLoading && formData.petAge && formData.petName) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading && formData.petAge && formData.petName) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid transparent',
                      borderTop: '2px solid currentColor',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    {isEditing ? 'Updating...' : 'Calculating...'}
                  </>
                ) : (
                  <>
                    {isEditing ? <Save size={20} /> : <Calculator size={20} />}
                    {isEditing ? 'Update Calculation' : 'Calculate Age'}
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="result-section" style={{
              marginTop: '2rem',
              animation: 'resultSlideIn 0.5s ease-out'
            }}>
              <div className="result-card success" style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                borderLeft: '4px solid #10B981'
              }}>
                <div className="result-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ margin: 0, color: '#1f2937' }}>Age Calculation Result</h3>
                  <div className="result-badge" style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '1.5rem'
                  }}>
                    {result.petType === 'dog' ? '🐕' : result.petType === 'cat' ? '🐈' : '🐾'}
                  </div>
                </div>
                
                <div className="result-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div className="result-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}>
                    <span className="result-label" style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      Pet's Age
                    </span>
                    <span className="result-value highlight" style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      {result.petAge} years
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label" style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      Human Equivalent
                    </span>
                    <span className="result-value highlight" style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#3b82f6',
                      
                    }}>
                      {result.humanAge} years
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label" style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      Life Stage
                    </span>
                    <span className="result-value stage" style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#10B981'
                    }}>
                      {result.lifeStage}
                    </span>
                  </div>
                </div>

                <div className="result-message" style={{
                  background: '#f0f9ff',
                  padding: '1rem',
                  borderRadius: '10px',
                  borderLeft: '4px solid #3b82f6',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ margin: 0, color: '#1e40af', fontWeight: '500' }}>
                    {result.message}
                  </p>
                </div>

                <div className="result-actions" style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={handleDeleteCalculation}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#fecaca';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#fee2e2';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentEditId(result.id);
                        setResult(null);
                      }}
                      style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#fde68a';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#fef3c7';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={resetForm}
                      style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#e5e7eb';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#f3f4f6';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <RotateCcw size={16} />
                      New Calculation
                    </button>
                    <button 
                      onClick={onClose}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#2563eb';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#3b82f6';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes resultSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AgeCalculatorModal;