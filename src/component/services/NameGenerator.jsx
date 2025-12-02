// components/services/NameGenerator.jsx - Creative Pet Name Generator
import React, { useState, useEffect } from 'react';
import { serviceAPI } from "../../services/serviceAPI";
import "../../styles/Services.css";

// Icons
import { Heart, Star, Copy, Shuffle, Bookmark, Volume2 } from 'lucide-react';

const NameGenerator = () => {
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

  const nameDatabase = {
    dog: {
      cute: ['Buddy', 'Bella', 'Coco', 'Luna', 'Charlie', 'Lucy', 'Max', 'Daisy'],
      funny: ['Bark Twain', 'Sir Waggington', 'Chewbacca', 'Princess Paws', 'Droolius Caesar'],
      unique: ['Zephyr', 'Koda', 'Nova', 'Atlas', 'Lyra', 'Orion', 'Sage', 'Juno'],
      strong: ['Zeus', 'Thor', 'Titan', 'Valkyrie', 'Hunter', 'Ranger', 'Blaze']
    },
    cat: {
      cute: ['Whiskers', 'Mittens', 'Simba', 'Luna', 'Oliver', 'Chloe', 'Leo', 'Lily'],
      funny: ['Catniss', 'Purrcival', 'Meowly Cyrus', 'Chairman Meow', 'Fuzz Aldrin'],
      unique: ['Nimbus', 'Saffron', 'Pippin', 'Zara', 'Kairo', 'Lyric', 'Rumi'],
      strong: ['Shadow', 'Midnight', 'Raven', 'Onyx', 'Phantom', 'Saber', 'Jaguar']
    },
    rabbit: {
      cute: ['Thumper', 'BunBun', 'Cotton', 'Snowball', 'Pepper', 'Cinnamon'],
      funny: ['Hopalong', 'Bugs', 'Flopsy', 'Mopsy', 'Peter', 'Roger'],
      unique: ['Willow', 'Clover', 'Pippin', 'Dandelion', 'Basil', 'Petal'],
      strong: ['Storm', 'Rocky', 'Thunder', 'Blaze', 'Hunter', 'Ranger']
    },
    bird: {
      cute: ['Sunny', 'Sky', 'Blue', 'Tweetie', 'Mango', 'Kiwi'],
      funny: ['Feather Locklear', 'Wingston', 'Beaker', 'Polly', 'Captain Squawk'],
      unique: ['Zephyr', 'Aero', 'Nimbus', 'Cirrus', 'Phoenix', 'Skyler'],
      strong: ['Thor', 'Zeus', 'Talon', 'Hunter', 'Storm', 'Blaze']
    }
  };

  const petTypes = [
    { value: 'dog', label: '🐕 Dog', icon: '🐕' },
    { value: 'cat', label: '🐈 Cat', icon: '🐈' },
    { value: 'rabbit', label: '🐇 Rabbit', icon: '🐇' },
    { value: 'bird', label: '🐦 Bird', icon: '🐦' },
    { value: 'fish', label: '🐠 Fish', icon: '🐠' },
    { value: 'hamster', label: '🐹 Hamster', icon: '🐹' }
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
    { value: 'strong', label: '💪 Strong', icon: '💪' },
    { value: 'elegant', label: '👑 Elegant', icon: '👑' }
  ];

  const nameLengths = [
    { value: 'short', label: 'Short (1-2 syllables)', icon: '🔤' },
    { value: 'medium', label: 'Medium (3 syllables)', icon: '🔠' },
    { value: 'long', label: 'Long (4+ syllables)', icon: '📖' },
    { value: 'any', label: 'Any Length', icon: '🎲' }
  ];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const generateNames = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const petNames = nameDatabase[preferences.petType] || nameDatabase.dog;
      const styleNames = petNames[preferences.style] || petNames.cute;
      
      // Filter by gender and length
      let filteredNames = styleNames.filter(name => {
        const syllables = name.split(/[aeiouy]+/i).length - 1;
        
        if (preferences.length === 'short' && syllables > 2) return false;
        if (preferences.length === 'medium' && (syllables < 2 || syllables > 3)) return false;
        if (preferences.length === 'long' && syllables < 4) return false;
        
        if (preferences.startingLetter !== 'any' && 
            !name.toLowerCase().startsWith(preferences.startingLetter.toLowerCase())) {
          return false;
        }
        
        return true;
      });
      
      // Shuffle and take 12 names
      const shuffled = [...filteredNames].sort(() => 0.5 - Math.random());
      setGeneratedNames(shuffled.slice(0, 12));
      
    } catch (error) {
      console.error('Name generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addToFavorites = (name) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.name === name);
      if (exists) return prev;
      
      const newFavorite = {
        name,
        petType: preferences.petType,
        style: preferences.style,
        timestamp: new Date().toISOString()
      };
      
      return [...prev, newFavorite];
    });
  };

  const removeFromFavorites = (name) => {
    setFavorites(prev => prev.filter(fav => fav.name !== name));
  };

  const copyToClipboard = (name) => {
    navigator.clipboard.writeText(name);
    setSelectedName(name);
    setTimeout(() => setSelectedName(null), 2000);
  };

  const speakName = (name) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const saveFavorites = () => {
    localStorage.setItem('petNameFavorites', JSON.stringify(favorites));
    alert('Favorites saved! 💾');
  };

  useEffect(() => {
    const saved = localStorage.getItem('petNameFavorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="service-page name-generator">
      <div className="service-header">
        <div className="header-icon">
          <Heart size={32} />
        </div>
        <h1>Pet Name Generator</h1>
        <p>Find the perfect name for your new best friend! 🦴</p>
      </div>

      <div className="name-generator-container">
        {/* Preferences Panel */}
        <div className="preferences-panel">
          <h3>Tell us about your pet</h3>
          
          <div className="preferences-grid">
            {/* Pet Type */}
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

            {/* Gender */}
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

            {/* Name Style */}
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

            {/* Name Length */}
            <div className="preference-group">
              <label>Name Length</label>
              <div className="option-buttons">
                {nameLengths.map(length => (
                  <button
                    key={length.value}
                    type="button"
                    className={`option-btn ${preferences.length === length.value ? 'active' : ''}`}
                    onClick={() => setPreferences(prev => ({ ...prev, length: length.value }))}
                  >
                    <span className="option-emoji">{length.icon}</span>
                    {length.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Starting Letter */}
            <div className="preference-group">
              <label>Starting Letter</label>
              <div className="letter-buttons">
                <button
                  className={`letter-btn ${preferences.startingLetter === 'any' ? 'active' : ''}`}
                  onClick={() => setPreferences(prev => ({ ...prev, startingLetter: 'any' }))}
                >
                  Any
                </button>
                {alphabet.map(letter => (
                  <button
                    key={letter}
                    className={`letter-btn ${preferences.startingLetter === letter ? 'active' : ''}`}
                    onClick={() => setPreferences(prev => ({ ...prev, startingLetter: letter }))}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generateNames}
            disabled={isGenerating}
            className="generate-names-btn"
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
        </div>

        {/* Generated Names Grid */}
        {generatedNames.length > 0 && (
          <div className="names-results">
            <div className="results-header">
              <h3>Suggested Names ({generatedNames.length})</h3>
              <div className="results-actions">
                <span className="results-info">
                  Click on names to hear pronunciation
                </span>
              </div>
            </div>

            <div className="names-grid">
              {generatedNames.map((name, index) => {
                const isFavorite = favorites.some(fav => fav.name === name);
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
          </div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="favorites-section">
            <div className="favorites-header">
              <h3>Your Favorite Names ({favorites.length})</h3>
              <button onClick={saveFavorites} className="save-favorites-btn">
                <Bookmark size={16} />
                Save Favorites
              </button>
            </div>

            <div className="favorites-grid">
              {favorites.map((fav, index) => (
                <div key={index} className="favorite-card">
                  <span className="favorite-name">{fav.name}</span>
                  <span className="favorite-meta">
                    {petTypes.find(p => p.value === fav.petType)?.icon} • 
                    {styles.find(s => s.value === fav.style)?.label}
                  </span>
                  <button
                    onClick={() => removeFromFavorites(fav.name)}
                    className="remove-favorite"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Name Meaning Section */}
        <div className="name-meaning-section">
          <h3>Popular Name Meanings 📚</h3>
          <div className="meanings-grid">
            <div className="meaning-card">
              <h4>Luna 🌙</h4>
              <p>Latin for "moon" - perfect for pets with a calm, gentle nature</p>
            </div>
            <div className="meaning-card">
              <h4>Zeus ⚡</h4>
              <p>Greek mythology - great for strong, commanding pets</p>
            </div>
            <div className="meaning-card">
              <h4>Bella 🌸</h4>
              <p>Italian for "beautiful" - suits elegant, graceful pets</p>
            </div>
            <div className="meaning-card">
              <h4>Leo 🦁</h4>
              <p>Latin for "lion" - ideal for brave, confident pets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameGenerator;