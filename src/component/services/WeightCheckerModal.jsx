// src/component/services/WeightCheckerModal.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../../services/serviceAPI';
import { 
  Scale, 
  Activity, 
  Heart, 
  TrendingUp, 
  X, 
  Edit3, 
  Trash2,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const WeightCheckerModal = ({ isOpen, onClose, pet, onResult, editRecord = null }) => {
  const [formData, setFormData] = useState({
    petType: 'dog',
    weight: '',
    breed: '',
    age: '',
    petName: ''
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const petTypes = [
    { value: 'dog', label: '🐕 Dog', breeds: ['Labrador', 'German Shepherd', 'Golden Retriever', 'Bulldog', 'Mixed Breed'] },
    { value: 'cat', label: '🐈 Cat', breeds: ['Siamese', 'Persian', 'Maine Coon', 'Domestic Shorthair', 'Mixed Breed'] },
    { value: 'rabbit', label: '🐇 Rabbit', breeds: ['Dutch', 'Lionhead', 'Flemish Giant', 'Mixed Breed'] }
  ];

  // Handle edit mode - FIXED
  useEffect(() => {
    if (!isOpen) return;
    
    console.log("WeightCheckerModal useEffect - isOpen:", isOpen, "editRecord:", editRecord);
    
    if (editRecord) {
      console.log("Setting up edit mode with record:", editRecord);
      setIsEditing(true);
      setCurrentEditId(editRecord.id);
      setFormData({
        petType: editRecord.petType || 'dog',
        weight: editRecord.weight?.toString() || '',
        breed: editRecord.breed || '',
        age: editRecord.age?.toString() || '',
        petName: editRecord.petName || ''
      });
      setResult(editRecord);
    } else {
      console.log("Setting up new record mode");
      setIsEditing(false);
      setCurrentEditId(null);
      setResult(null);
      if (pet) {
        setFormData({
          petType: pet.type || 'dog',
          weight: '',
          breed: pet.breed || '',
          age: pet.age?.toString() || '',
          petName: pet.name || ''
        });
      } else {
        setFormData({
          petType: 'dog',
          weight: '',
          breed: '',
          age: '',
          petName: ''
        });
      }
    }
  }, [editRecord, pet, isOpen]);

  // API Integration with Error Handling
  const saveRecordToAPI = async (recordData) => {
    try {
      if (isEditing && currentEditId) {
        // UPDATE operation
        const response = await serviceAPI.updateServiceRecord('weight', currentEditId, recordData);
        return response;
      } else {
        // CREATE operation
        const response = await serviceAPI.calculateBMI(recordData);
        return response;
      }
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to localStorage if API fails
      return { record: recordData };
    }
  };

  const saveToLocalStorage = (record) => {
    try {
      const existingHistory = JSON.parse(localStorage.getItem('serviceHistory') || '{}');
      const weightRecords = existingHistory.weightRecords || [];
      
      let updatedRecords;
      if (isEditing && currentEditId) {
        // Update existing record
        updatedRecords = weightRecords.map(item => 
          item.id === currentEditId ? { ...record, id: currentEditId } : item
        );
      } else {
        // Add new record
        updatedRecords = [record, ...weightRecords.slice(0, 49)]; // Keep last 50
      }
      
      const updatedHistory = {
        ...existingHistory,
        weightRecords: updatedRecords
      };
      
      localStorage.setItem('serviceHistory', JSON.stringify(updatedHistory));
      console.log(`✅ Weight record ${isEditing ? 'updated' : 'saved'} to history`);
      
      return updatedRecords;
    } catch (error) {
      console.error('❌ LocalStorage Error:', error);
      throw error;
    }
  };

  const calculateBMI = async (e) => {
    e.preventDefault();
    if (!formData.weight || !formData.petName) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Calculate BMI based on pet type with more sophisticated algorithm
      const baseWeight = getBaseWeight(formData.petType, formData.breed);
      const bmiScore = (parseFloat(formData.weight) / baseWeight * 100).toFixed(1);
      
      const { condition, recommendation, color, icon } = getBMICondition(bmiScore);

      const bmiResult = {
        id: isEditing ? currentEditId : Date.now().toString(),
        type: 'weight',
        timestamp: new Date().toISOString(),
        petName: formData.petName,
        weight: formData.weight,
        bmiScore,
        condition,
        recommendation,
        color,
        icon,
        petType: formData.petType,
        breed: formData.breed,
        age: formData.age,
        title: `Weight Check for ${formData.petName}`,
        description: `${formData.weight} kg - ${condition}`,
        status: isEditing ? 'updated' : 'created',
        baseWeight: baseWeight,
        healthTips: getHealthTips(condition)
      };

      // Try API first, fallback to localStorage
      await saveRecordToAPI(bmiResult);
      
      // Always save to localStorage for consistency
      saveToLocalStorage(bmiResult);

      setResult(bmiResult);

      // Notify parent component
      if (onResult) {
        onResult(bmiResult);
      }

    } catch (error) {
      console.error('BMI calculation error:', error);
      alert('Failed to save weight record. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBaseWeight = (petType, breed) => {
    // More sophisticated base weight calculation
    const baseWeights = {
      dog: {
        'Labrador': 25,
        'German Shepherd': 30,
        'Golden Retriever': 27,
        'Bulldog': 18,
        'Mixed Breed': 20,
        'default': 20
      },
      cat: {
        'Siamese': 4,
        'Persian': 5,
        'Maine Coon': 6,
        'Domestic Shorthair': 4.5,
        'Mixed Breed': 4.5,
        'default': 4.5
      },
      rabbit: {
        'Dutch': 2,
        'Lionhead': 1.5,
        'Flemish Giant': 6,
        'Mixed Breed': 2,
        'default': 2
      }
    };

    return baseWeights[petType]?.[breed] || baseWeights[petType]?.default || 20;
  };

  const getBMICondition = (bmiScore) => {
    if (bmiScore < 80) {
      return {
        condition: 'Underweight',
        recommendation: 'Consider increasing food portions and consult your vet for dietary advice',
        color: '#F59E0B',
        icon: '⚠️'
      };
    } else if (bmiScore <= 100) {
      return {
        condition: 'Ideal Weight',
        recommendation: 'Perfect! Maintain current diet and exercise routine',
        color: '#10B981',
        icon: '✅'
      };
    } else if (bmiScore <= 120) {
      return {
        condition: 'Overweight',
        recommendation: 'Moderate exercise and diet adjustment recommended. Consult your vet.',
        color: '#F59E0B',
        icon: '⚖️'
      };
    } else {
      return {
        condition: 'Obese',
        recommendation: 'Consult your vet immediately for a weight management plan',
        color: '#EF4444',
        icon: '🚨'
      };
    }
  };

  const getHealthTips = (condition) => {
    const tips = {
      'Underweight': [
        'Increase meal frequency to 3-4 times daily',
        'Consider high-calorie nutritional supplements',
        'Regular vet checkups to rule out underlying issues'
      ],
      'Ideal Weight': [
        'Maintain consistent feeding schedule',
        'Regular exercise and playtime',
        'Annual vet checkups for maintenance'
      ],
      'Overweight': [
        'Gradually reduce food portions by 10-15%',
        'Increase daily exercise and activity',
        'Avoid high-calorie treats and table scraps'
      ],
      'Obese': [
        'Immediate veterinary consultation',
        'Strict dietary management plan',
        'Supervised exercise program'
      ]
    };
    return tips[condition] || [];
  };

  const handleDeleteRecord = async () => {
    if (!result || !result.id) return;

    if (!window.confirm('Are you sure you want to delete this weight record?')) return;

    try {
      // Try API deletion
      try {
        await serviceAPI.deleteServiceRecord('weight', result.id);
      } catch (apiError) {
        console.warn('API deletion failed, using localStorage:', apiError);
      }

      // Delete from localStorage
      const existingHistory = JSON.parse(localStorage.getItem('serviceHistory') || '{}');
      const updatedRecords = (existingHistory.weightRecords || []).filter(
        item => item.id !== result.id
      );
      
      localStorage.setItem('serviceHistory', JSON.stringify({
        ...existingHistory,
        weightRecords: updatedRecords
      }));

      // Notify parent
      if (onResult) {
        onResult({ type: 'deleted', id: result.id });
      }

      handleClose();
    } catch (error) {
      console.error('Deletion error:', error);
      alert('Failed to delete weight record');
    }
  };

  const resetForm = () => {
    setFormData({
      petType: 'dog',
      weight: '',
      breed: '',
      age: '',
      petName: pet?.name || ''
    });
    setResult(null);
    setIsEditing(false);
    setCurrentEditId(null);
  };

  // FIXED: Proper close handler
  const handleClose = () => {
    console.log("WeightCheckerModal handleClose called");
    resetForm();
    if (onClose) {
      onClose();
    }
  };

  // FIXED: Don't render if not open
  if (!isOpen) {
    console.log("WeightCheckerModal not rendering because isOpen is false");
    return null;
  }

  console.log("WeightCheckerModal rendering with isOpen:", isOpen);

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        console.log("Overlay clicked");
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      style={{
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
      }}
    >
      <div 
        className="service-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          animation: 'modalSlideIn 0.3s ease-out'
        }}
      >
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
            <Scale size={24} style={{ color: '#10B981' }} />
            <h2 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem' }}>
              {isEditing ? 'Edit Weight Record' : 'Pet Weight Checker'}
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
            onClick={handleClose}
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
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              textAlign: 'center',
              borderLeft: '4px solid #10B981'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Heart size={16} style={{ color: '#065f46' }} />
                <span style={{ color: '#065f46', fontWeight: '600' }}>
                  Checking weight for: <strong>{pet.name}</strong> 🐾
                </span>
              </div>
            </div>
          )}

          {!result ? (
            <form onSubmit={calculateBMI} className="calculator-form" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {/* ... rest of your form code remains the same ... */}
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
                      e.target.style.borderColor = '#10B981';
                      e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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
                    {petTypes.map(pet => (
                      <button
                        key={pet.value}
                        type="button"
                        className={`pet-type-btn ${formData.petType === pet.value ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, petType: pet.value }))}
                        style={{
                          padding: '1rem',
                          border: `2px solid ${formData.petType === pet.value ? '#10B981' : '#e5e7eb'}`,
                          borderRadius: '10px',
                          background: formData.petType === pet.value ? '#10B981' : 'white',
                          color: formData.petType === pet.value ? 'white' : '#374151',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span className="pet-emoji" style={{ fontSize: '1.5rem' }}>
                          {pet.label.split(' ')[0]}
                        </span>
                        <span className="pet-name" style={{ 
                          fontWeight: '600', 
                          fontSize: '0.9rem' 
                        }}>
                          {pet.label.split(' ')[1]}
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
                    <Scale size={16} />
                    Weight (kg) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="Enter weight in kilograms"
                      step="0.1"
                      min="0.1"
                      max="100"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        paddingRight: '50px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#10B981';
                        e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                      fontWeight: '500',
                      background: '#f3f4f6',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      kg
                    </span>
                  </div>
                  <small style={{
                    color: '#6b7280',
                    fontSize: '0.8rem',
                    marginTop: '0.25rem',
                    display: 'block'
                  }}>
                    Enter your pet's current weight
                  </small>
                </div>

                <div className="form-group">
                  <label style={{
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}>
                    Breed (Optional)
                  </label>
                  <select 
                    value={formData.breed}
                    onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10B981';
                      e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select Breed</option>
                    {petTypes.find(p => p.value === formData.petType)?.breeds.map(breed => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}>
                    Age (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Pet's age in years"
                    step="0.1"
                    min="0"
                    max="30"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10B981';
                      e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`calculate-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || !formData.weight || !formData.petName}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
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
                  opacity: (isLoading || !formData.weight || !formData.petName) ? 0.6 : 1,
                  transform: (isLoading || !formData.weight || !formData.petName) ? 'none' : 'translateY(0)'
                }}
                onMouseOver={(e) => {
                  if (!isLoading && formData.weight && formData.petName) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading && formData.weight && formData.petName) {
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
                    {isEditing ? <Save size={20} /> : <Activity size={20} />}
                    {isEditing ? 'Update Record' : 'Check Weight Health'}
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="result-section" style={{
              marginTop: '2rem',
              animation: 'resultSlideIn 0.5s ease-out'
            }}>
              <div className="result-card" style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                borderLeft: `4px solid ${result.color}`
              }}>
                <div className="result-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ margin: 0, color: '#1f2937' }}>Weight Analysis Result</h3>
                  <div 
                    className="condition-badge"
                    style={{ 
                      backgroundColor: result.color,
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>{result.icon}</span>
                    {result.condition}
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
                    gap: '0.25rem',
                    textAlign: 'center',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <span className="result-label" style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      Current Weight
                    </span>
                    <span className="result-value highlight" style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      {result.weight} kg
                    </span>
                  </div>
                  <div className="result-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    textAlign: 'center',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <span className="result-label" style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      BMI Score
                    </span>
                    <span className="result-value highlight" style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: result.color
                    }}>
                      {result.bmiScore}
                    </span>
                  </div>
                  <div className="result-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    textAlign: 'center',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <span className="result-label" style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      Status
                    </span>
                    <span className="result-value" style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: result.color
                    }}>
                      {result.condition}
                    </span>
                  </div>
                </div>

                <div className="recommendation-section" style={{
                  background: '#f0fdf4',
                  padding: '1rem',
                  borderRadius: '10px',
                  borderLeft: '4px solid #10B981',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0',
                    color: '#065f46',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Info size={16} />
                    Recommendation
                  </h4>
                  <p style={{ margin: 0, color: '#047857', fontWeight: '500' }}>
                    {result.recommendation}
                  </p>
                </div>

                <div className="health-tips" style={{
                  background: '#fffbeb',
                  padding: '1rem',
                  borderRadius: '10px',
                  borderLeft: '4px solid #f59e0b',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0',
                    color: '#92400e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertTriangle size={16} />
                    Health Tips
                  </h4>
                  <ul style={{ 
                    margin: 0,
                    paddingLeft: '1.5rem',
                    color: '#b45309'
                  }}>
                    {result.healthTips?.map((tip, index) => (
                      <li key={index} style={{ marginBottom: '0.25rem' }}>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="result-actions" style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={handleDeleteRecord}
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
                      New Check
                    </button>
                    <button 
                      onClick={handleClose}
                      style={{
                        background: '#10B981',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#059669';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#10B981';
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

      <style>{`
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

export default WeightCheckerModal;