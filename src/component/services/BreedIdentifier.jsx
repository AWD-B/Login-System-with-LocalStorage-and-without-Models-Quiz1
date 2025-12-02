// components/services/BreedIdentifier.jsx - AI Pet Breed Identification
import React, { useState, useRef } from 'react';
import { serviceAPI } from "../../services/serviceAPI";
import "../../styles/Services.css";
// Icons
import { Upload, Camera, Search, Heart, Star, Share2 } from 'lucide-react';

const BreedIdentifier = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identificationResult, setIdentificationResult] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualTraits, setManualTraits] = useState({
    size: '',
    coat: '',
    ears: '',
    tail: '',
    color: ''
  });
  const fileInputRef = useRef();

  const breedDatabase = [
    {
      id: 1,
      name: "Golden Retriever",
      confidence: 95,
      image: "🐕",
      description: "Friendly, intelligent and devoted.",
      characteristics: ["Friendly", "Intelligent", "Devoted", "Trustworthy", "Confident"],
      size: "Large",
      lifeSpan: "10-12 years",
      group: "Sporting",
      origin: "Scotland",
      temperament: "Friendly, intelligent, devoted",
      exercise: "High",
      grooming: "Moderate",
      training: "Easy",
      goodWith: ["Children", "Families", "Other dogs"],
      health: ["Hip dysplasia", "Certain heart conditions"]
    },
    {
      id: 2,
      name: "Siamese Cat",
      confidence: 88,
      image: "🐈",
      description: "Vocal, social and intelligent feline.",
      characteristics: ["Vocal", "Social", "Intelligent", "Playful", "Affectionate"],
      size: "Medium",
      lifeSpan: "15-20 years",
      group: "Asian",
      origin: "Thailand",
      temperament: "Vocal, social, intelligent",
      exercise: "Moderate",
      grooming: "Low",
      training: "Easy",
      goodWith: ["Families", "Children", "Other cats"],
      health: ["Dental issues", "Respiratory conditions"]
    },
    {
      id: 3,
      name: "Labrador Retriever",
      confidence: 92,
      image: "🐕",
      description: "Outgoing, even-tempered and gentle.",
      characteristics: ["Outgoing", "Even-tempered", "Gentle", "Athletic", "Kind"],
      size: "Large",
      lifeSpan: "10-12 years",
      group: "Sporting",
      origin: "Canada",
      temperament: "Outgoing, even-tempered, gentle",
      exercise: "High",
      grooming: "Moderate",
      training: "Easy",
      goodWith: ["Children", "Families", "Other pets"],
      health: ["Obesity", "Joint problems"]
    }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setIdentificationResult(null);
    }
  };

  const identifyBreed = async () => {
    if (!selectedImage && !manualMode) return;

    setIsIdentifying(true);
    
    try {
      // Simulate AI identification
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo, return a random breed from database
      const randomBreed = breedDatabase[Math.floor(Math.random() * breedDatabase.length)];
      setIdentificationResult({
        ...randomBreed,
        identified: true,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Breed identification error:', error);
    } finally {
      setIsIdentifying(false);
    }
  };

  const manualIdentify = () => {
    setIsIdentifying(true);
    
    setTimeout(() => {
      // Simple manual matching logic
      const matchedBreed = breedDatabase.find(breed => 
        breed.size.toLowerCase().includes(manualTraits.size.toLowerCase()) ||
        breed.characteristics.some(char => 
          char.toLowerCase().includes(manualTraits.coat.toLowerCase())
        )
      ) || breedDatabase[0];
      
      setIdentificationResult({
        ...matchedBreed,
        confidence: 75, // Lower confidence for manual identification
        identified: true,
        manual: true,
        timestamp: new Date().toISOString()
      });
      setIsIdentifying(false);
    }, 2000);
  };

  const shareResult = () => {
    if (identificationResult) {
      navigator.clipboard.writeText(
        `I identified my pet as a ${identificationResult.name} with ${identificationResult.confidence}% confidence using PetCare Pro! 🐾`
      );
      alert('Result copied to clipboard! 📋');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="service-page breed-identifier">
      <div className="service-header">
        <div className="header-icon">
          <Search size={32} />
        </div>
        <h1>Pet Breed Identifier</h1>
        <p>Discover your pet's breed using AI technology! 🔍</p>
      </div>

      <div className="identifier-container">
        {/* Upload Section */}
        <div className="upload-section">
          <div className="upload-options">
            <button
              className={`upload-option ${!manualMode ? 'active' : ''}`}
              onClick={() => setManualMode(false)}
            >
              <Camera size={24} />
              AI Photo Analysis
            </button>
            <button
              className={`upload-option ${manualMode ? 'active' : ''}`}
              onClick={() => setManualMode(true)}
            >
              <Search size={24} />
              Manual Identification
            </button>
          </div>

          {!manualMode ? (
            <div className="image-upload-area">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="file-input"
              />
              
              {!imagePreview ? (
                <div className="upload-placeholder" onClick={triggerFileInput}>
                  <Upload size={48} />
                  <h3>Upload Pet Photo</h3>
                  <p>Click to select or drag and drop</p>
                  <small>Supports JPG, PNG • Max 5MB</small>
                </div>
              ) : (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Uploaded pet" className="image-preview" />
                  <button 
                    onClick={triggerFileInput}
                    className="change-image-btn"
                  >
                    Change Image
                  </button>
                </div>
              )}

              <button
                onClick={identifyBreed}
                disabled={!selectedImage || isIdentifying}
                className="identify-btn"
              >
                {isIdentifying ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Identify Breed
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="manual-identification">
              <h3>Describe Your Pet's Features</h3>
              <div className="traits-grid">
                <div className="trait-group">
                  <label>Size</label>
                  <select 
                    value={manualTraits.size}
                    onChange={(e) => setManualTraits(prev => ({ ...prev, size: e.target.value }))}
                  >
                    <option value="">Select size</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="trait-group">
                  <label>Coat Type</label>
                  <select 
                    value={manualTraits.coat}
                    onChange={(e) => setManualTraits(prev => ({ ...prev, coat: e.target.value }))}
                  >
                    <option value="">Select coat</option>
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                    <option value="curly">Curly</option>
                    <option value="hairless">Hairless</option>
                  </select>
                </div>

                <div className="trait-group">
                  <label>Ear Shape</label>
                  <select 
                    value={manualTraits.ears}
                    onChange={(e) => setManualTraits(prev => ({ ...prev, ears: e.target.value }))}
                  >
                    <option value="">Select ears</option>
                    <option value="floppy">Floppy</option>
                    <option value="pointy">Pointy</option>
                    <option value="folded">Folded</option>
                  </select>
                </div>

                <div className="trait-group">
                  <label>Tail Type</label>
                  <select 
                    value={manualTraits.tail}
                    onChange={(e) => setManualTraits(prev => ({ ...prev, tail: e.target.value }))}
                  >
                    <option value="">Select tail</option>
                    <option value="long">Long</option>
                    <option value="short">Short</option>
                    <option value="curly">Curly</option>
                    <option value="bobbed">Bobbed</option>
                  </select>
                </div>

                <div className="trait-group">
                  <label>Primary Color</label>
                  <select 
                    value={manualTraits.color}
                    onChange={(e) => setManualTraits(prev => ({ ...prev, color: e.target.value }))}
                  >
                    <option value="">Select color</option>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="brown">Brown</option>
                    <option value="golden">Golden</option>
                    <option value="gray">Gray</option>
                    <option value="multi">Multi-colored</option>
                  </select>
                </div>
              </div>

              <button
                onClick={manualIdentify}
                disabled={isIdentifying}
                className="identify-btn"
              >
                {isIdentifying ? 'Identifying...' : 'Identify Breed'}
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {identificationResult && (
          <div className="results-section">
            <div className="result-header">
              <h3>Identification Result</h3>
              <button onClick={shareResult} className="share-btn">
                <Share2 size={16} />
                Share
              </button>
            </div>

            <div className="breed-card">
              <div className="breed-header">
                <div className="breed-emoji">{identificationResult.image}</div>
                <div className="breed-info">
                  <h2>{identificationResult.name}</h2>
                  <div className="confidence-badge">
                    <Star size={14} fill="currentColor" />
                    {identificationResult.confidence}% Confidence
                    {identificationResult.manual && <span className="manual-tag">Manual</span>}
                  </div>
                </div>
              </div>

              <p className="breed-description">{identificationResult.description}</p>

              <div className="breed-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Size</span>
                    <span className="value">{identificationResult.size}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Life Span</span>
                    <span className="value">{identificationResult.lifeSpan}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Group</span>
                    <span className="value">{identificationResult.group}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Origin</span>
                    <span className="value">{identificationResult.origin}</span>
                  </div>
                </div>

                <div className="characteristics">
                  <h4>Key Characteristics</h4>
                  <div className="characteristics-list">
                    {identificationResult.characteristics.map((char, index) => (
                      <span key={index} className="characteristic-tag">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="care-info">
                  <div className="care-item">
                    <strong>Exercise:</strong> {identificationResult.exercise}
                  </div>
                  <div className="care-item">
                    <strong>Grooming:</strong> {identificationResult.grooming}
                  </div>
                  <div className="care-item">
                    <strong>Training:</strong> {identificationResult.training}
                  </div>
                </div>

                {identificationResult.health && (
                  <div className="health-notes">
                    <h4>Health Considerations</h4>
                    <ul>
                      {identificationResult.health.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="tips-section">
          <h3>Tips for Better Identification 📸</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-emoji">📷</div>
              <h4>Clear Photos</h4>
              <p>Take photos in good lighting with your pet facing the camera</p>
            </div>
            <div className="tip-card">
              <div className="tip-emoji">🐕</div>
              <h4>Multiple Angles</h4>
              <p>Include side profile and front-facing shots for best results</p>
            </div>
            <div className="tip-card">
              <div className="tip-emoji">🌞</div>
              <h4>Natural Light</h4>
              <p>Avoid flash and use natural daylight for accurate colors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreedIdentifier;