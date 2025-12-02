// src/component/services/NameGeneratorModal.jsx - In-dashboard name generator
import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../../services/serviceAPI';
import { Heart, Star, Copy, Shuffle, X, Volume2 } from 'lucide-react';

const NameGeneratorModal = ({ isOpen, onClose, pet, onNamesSave }) => {
  const [preferences, setPreferences] = useState({
    petType: 'dog',
    gender: 'unisex',
    style: 'cute',
    length: 'short',
    startingLetter: 'any'
  });
  const [generatedNames, setGeneratedNames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedName, setSelectedName] = useState(null);

  const petTypes = [
    { value: 'dog', label: '🐕 Dog', icon: '🐕' },
    { value: 'cat', label: '🐈 Cat', icon: '🐈' },
    { value: 'rabbit', label: '🐇 Rabbit', icon: '🐇' },
    { value: 'bird', label: '🐦 Bird', icon: '🐦' }
  ];

  const genders = [
    { value: 'male', label: '♂️ Male', icon: '♂️' },
    { value: 'female', label: '♀️ Female', icon: '♀️' },
    { value: 'unisex', label: '⚧ Unisex', icon: '⚧' }
  ];

  const styles = [
    { value: 'cute', label: '😊 Cute', icon: '😊' },
    { value: 'funny', label: '😄 Funny', icon: '😄' },
    { value: 'unique', label: '✨ Unique', icon: '✨' },
    { value: 'strong', label: '💪 Strong', icon: '💪' }
  ];

  // Pre-fill form if pet is provided
  useEffect(() => {
    if (pet) {
      setPreferences(prev => ({
        ...prev,
        petType: pet.type || 'dog',
        gender: pet.gender || 'unisex'
      }));
    }
  }, [pet]);

  const generateNames = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await serviceAPI.generateNames({ preferences });
      setGeneratedNames(response.names || []);

      if (onNamesSave) {
        onNamesSave(response.generationId);
      }

    } catch (error) {
      console.error('Name generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addToFavorites = (name) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav === name);
      if (exists) return prev;
      return [...prev, name];
    });
  };

  const removeFromFavorites = (name) => {
    setFavorites(prev => prev.filter(fav => fav !== name));
  };

  const copyToClipboard = (name) => {
    navigator.clipboard.writeText(name);
    setSelectedName(name);
    setTimeout(() => setSelectedName(null), 2000);
  };

  const saveFavorites = async () => {
    try {
      await serviceAPI.saveFavoriteNames(favorites);
      alert('Favorites saved successfully! 💾');
    } catch (error) {
      console.error('Save favorites error:', error);
    }
  };

  const speakName = (name) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="service-modal name-generator-modal">
        <div className="modal-header">
          <div className="modal-title">
            <Heart size={24} />
            <h2>Pet Name Generator</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {pet && (
            <div className="selected-pet-banner">
              Finding names for: <strong>{pet.name}</strong> 🐾
            </div>
          )}

          {generatedNames.length === 0 ? (
            <form onSubmit={generateNames} className="preferences-form">
              <div className="preferences-section">
                <h3>Name Preferences</h3>
                
                <div className="preference-group">
                  <label>Pet Type</label>
                  <div className="option-buttons">
                    {petTypes.map(pet => (
                      <button
                        key={pet.value}
                        type="button"
                        className={`option-btn ${preferences.petType === pet.value ? 'active' : ''}`}
                        onClick={() => setPreferences(prev => ({ ...prev, petType: pet.value }))}
                      >
                        <span className="option-emoji">{pet.icon}</span>
                        {pet.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="preference-group">
                  <label>Gender</label>
                  <div className="option-buttons">
                    {genders.map(gender => (
                      <button
                        key={gender.value}
                        type="button"
                        className={`option-btn ${preferences.gender === gender.value ? 'active' : ''}`}
                        onClick={() => setPreferences(prev => ({ ...prev, gender: gender.value }))}
                      >
                        <span className="option-emoji">{gender.icon}</span>
                        {gender.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="preference-group">
                  <label>Name Style</label>
                  <div className="option-buttons">
                    {styles.map(style => (
                      <button
                        key={style.value}
                        type="button"
                        className={`option-btn ${preferences.style === style.value ? 'active' : ''}`}
                        onClick={() => setPreferences(prev => ({ ...prev, style: style.value }))}
                      >
                        <span className="option-emoji">{style.icon}</span>
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className={`generate-btn ${isGenerating ? 'loading' : ''}`}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    Generating Names...
                  </>
                ) : (
                  <>
                    <Shuffle size={20} />
                    Generate Names
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="names-results">
              <div className="results-header">
                <h3>Suggested Names ({generatedNames.length})</h3>
                <div className="results-actions">
                  <button 
                    onClick={() => setGeneratedNames([])}
                    className="btn-secondary"
                  >
                    Generate New
                  </button>
                </div>
              </div>

              <div className="names-grid">
                {generatedNames.map((name, index) => {
                  const isFavorite = favorites.includes(name);
                  const isSelected = selectedName === name;

                  return (
                    <div
                      key={index}
                      className={`name-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => speakName(name)}
                    >
                      <div className="name-content">
                        <h4 className="name-text">{name}</h4>
                        <div className="name-actions">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              isFavorite ? removeFromFavorites(name) : addToFavorites(name);
                            }}
                            className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                          >
                            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(name);
                            }}
                            className="copy-btn"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakName(name);
                            }}
                            className="speak-btn"
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="copy-indicator">Copied! 📋</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {favorites.length > 0 && (
                <div className="favorites-section">
                  <div className="favorites-header">
                    <h4>Your Favorite Names ({favorites.length})</h4>
                    <button onClick={saveFavorites} className="save-favorites-btn">
                      <Star size={16} />
                      Save Favorites
                    </button>
                  </div>

                  <div className="favorites-grid">
                    {favorites.map((fav, index) => (
                      <div key={index} className="favorite-card">
                        <span className="favorite-name">{fav}</span>
                        <button
                          onClick={() => removeFromFavorites(fav)}
                          className="remove-favorite"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="name-meanings">
                <h4>Popular Name Meanings</h4>
                <div className="meanings-grid">
                  <div className="meaning-card">
                    <h5>Luna 🌙</h5>
                    <p>Latin for "moon" - perfect for pets with calm nature</p>
                  </div>
                  <div className="meaning-card">
                    <h5>Zeus ⚡</h5>
                    <p>Greek mythology - great for strong, commanding pets</p>
                  </div>
                  <div className="meaning-card">
                    <h5>Bella 🌸</h5>
                    <p>Italian for "beautiful" - suits elegant pets</p>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={onClose} className="btn-primary">
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NameGeneratorModal;