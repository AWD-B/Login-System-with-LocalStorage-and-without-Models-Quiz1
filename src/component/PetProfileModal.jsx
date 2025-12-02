// components/PetProfileModal.jsx - FIXED VERSION
import React, { useState, useEffect, useRef } from 'react';

const PetProfileModal = ({ isOpen, onClose, pet = null, onPetUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    weight: '',
    birthDate: '',
    gender: 'unknown',
    image: '',
    preferences: {
      food: [],
      activities: [],
      allergies: []
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('');

  // Reset form when pet prop changes or modal opens
  useEffect(() => {
    if (pet) {
      // Edit mode - fill form with existing pet data
      setFormData({
        name: pet.name || '',
        type: pet.type || 'dog',
        breed: pet.breed || '',
        age: pet.age || '',
        weight: pet.weight || '',
        birthDate: pet.birthDate ? pet.birthDate.split('T')[0] : '',
        gender: pet.gender || 'unknown',
        image: pet.image || '',
        preferences: pet.preferences || {
          food: [],
          activities: [],
          allergies: []
        }
      });
      setImagePreview(pet.image || '');
    } else {
      // Create mode - reset form
      setFormData({
        name: '',
        type: 'dog',
        breed: '',
        age: '',
        weight: '',
        birthDate: '',
        gender: 'unknown',
        image: '',
        preferences: {
          food: [],
          activities: [],
          allergies: []
        }
      });
      setImagePreview('');
    }
    setError('');
  }, [pet, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (category, value) => {
    const preferences = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: preferences
      }
    }));
  };

  // FIXED: Handle image upload properly
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const imageDataUrl = event.target.result;
      
      // Store the base64 data URL directly in formData
      setFormData(prev => ({
        ...prev,
        image: imageDataUrl
      }));
      
      // Also set preview
      setImagePreview(imageDataUrl);
    };

    reader.onerror = () => {
      setError('Failed to read image file');
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Pet name is required');
      }

      // Prepare data - using localStorage for now since we don't have petAPI
      const submitData = {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        birthDate: formData.birthDate || undefined,
        // Ensure image is properly set
        image: formData.image || '/default-pet.png'
      };

      let result;
      if (pet) {
        // UPDATE operation - using localStorage
        result = {
          pet: {
            ...submitData,
            _id: pet._id, // Keep the same ID
            updatedAt: new Date().toISOString()
          },
          message: 'Pet updated successfully'
        };
      } else {
        // CREATE operation - using localStorage
        result = {
          pet: {
            ...submitData,
            _id: Date.now().toString(), // Generate unique ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          message: 'Pet created successfully'
        };
      }

      console.log('✅ Pet operation successful:', result.message);
      onPetUpdate(result.pet); // Notify parent component
      onClose(); // Close modal

    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error('❌ Pet operation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear image
  const handleClearImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="profile-edit-modal">
        <div className="modal-header">
          <h2>{pet ? 'Edit Pet Profile' : 'Create Pet Profile'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            {error && (
              <div className="error-message" style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            {/* Image Upload Section - FIXED */}
            <div className="image-upload-section">
              <div className="image-preview">
                <img 
                  src={imagePreview || formData.image || '/default-pet.png'} 
                  alt="Pet preview" 
                  className="preview-image"
                  onError={(e) => {
                    e.target.src = '/default-pet.png';
                  }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'center' }}>
                  <label className="upload-label">
                    📷 Upload Image
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="file-input"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {(imagePreview || formData.image) && formData.image !== '/default-pet.png' && (
                    <button 
                      type="button" 
                      onClick={handleClearImage}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
                <small style={{ color: '#6b7280', marginTop: '0.5rem', display: 'block' }}>
                  Max size: 5MB • JPG, PNG, GIF
                </small>
              </div>
            </div>

            {/* Pet Information Form */}
            <div className="form-grid">
              <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label htmlFor="name">Pet Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your pet's name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Pet Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="dog">🐕 Dog</option>
                  <option value="cat">🐈 Cat</option>
                  <option value="bird">🐦 Bird</option>
                  <option value="rabbit">🐇 Rabbit</option>
                  <option value="fish">🐠 Fish</option>
                  <option value="hamster">🐹 Hamster</option>
                  <option value="other">🐾 Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="e.g., Golden Retriever"
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age (years)</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  placeholder="2.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  placeholder="12.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="birthDate">Birth Date</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="unknown">Unknown</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Preferences */}
              <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label htmlFor="food">Favorite Foods (comma separated)</label>
                <input
                  type="text"
                  id="food"
                  value={formData.preferences.food.join(', ')}
                  onChange={(e) => handlePreferenceChange('food', e.target.value)}
                  placeholder="chicken, rice, carrots"
                />
              </div>

              <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label htmlFor="activities">Favorite Activities</label>
                <input
                  type="text"
                  id="activities"
                  value={formData.preferences.activities.join(', ')}
                  onChange={(e) => handlePreferenceChange('activities', e.target.value)}
                  placeholder="walking, playing fetch, swimming"
                />
              </div>

              <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label htmlFor="allergies">Allergies</label>
                <input
                  type="text"
                  id="allergies"
                  value={formData.preferences.allergies.join(', ')}
                  onChange={(e) => handlePreferenceChange('allergies', e.target.value)}
                  placeholder="chocolate, grapes, pollen"
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? 'Saving...' : (pet ? 'Update Profile' : 'Create Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetProfileModal;