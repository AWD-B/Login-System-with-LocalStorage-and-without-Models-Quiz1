// components/services/GuideDownloader.jsx - Pet Care Guides Download Center
import React, { useState, useEffect } from 'react';
import { serviceAPI } from "../../services/serviceAPI";
import "../../styles/Services.css";

// Icons
import { Download, BookOpen, Search, Filter, Star } from 'lucide-react';

const GuideDownloader = () => {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPet, setSelectedPet] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Sample guide data - in real app, this comes from API
  const sampleGuides = [
    {
      id: 1,
      title: "Complete Dog Training Guide",
      description: "Step-by-step training techniques for puppies and adult dogs",
      category: "training",
      petType: "dog",
      fileSize: "2.4 MB",
      pages: 45,
      rating: 4.8,
      downloads: 1250,
      image: "🐕",
      color: "#8B5CF6"
    },
    {
      id: 2,
      title: "Cat Grooming Mastery",
      description: "Professional grooming tips for healthy and happy cats",
      category: "grooming",
      petType: "cat",
      fileSize: "1.8 MB",
      pages: 32,
      rating: 4.9,
      downloads: 890,
      image: "🐈",
      color: "#EC4899"
    },
    {
      id: 3,
      title: "Bird Care Essentials",
      description: "Complete guide to bird housing, feeding, and health",
      category: "care",
      petType: "bird",
      fileSize: "3.1 MB",
      pages: 58,
      rating: 4.7,
      downloads: 450,
      image: "🐦",
      color: "#10B981"
    },
    {
      id: 4,
      title: "Fish Tank Maintenance",
      description: "Keep your aquarium clean and fish healthy",
      category: "maintenance",
      petType: "fish",
      fileSize: "1.5 MB",
      pages: 28,
      rating: 4.6,
      downloads: 320,
      image: "🐠",
      color: "#3B82F6"
    },
    {
      id: 5,
      title: "Rabbit Nutrition Guide",
      description: "Optimal diet plans for healthy rabbits",
      category: "nutrition",
      petType: "rabbit",
      fileSize: "2.1 MB",
      pages: 36,
      rating: 4.8,
      downloads: 280,
      image: "🐇",
      color: "#F59E0B"
    },
    {
      id: 6,
      title: "Small Pet Housing",
      description: "Creating perfect habitats for hamsters and guinea pigs",
      category: "housing",
      petType: "small",
      fileSize: "2.7 MB",
      pages: 42,
      rating: 4.5,
      downloads: 190,
      image: "🐹",
      color: "#6366F1"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📚' },
    { value: 'training', label: 'Training', icon: '🎓' },
    { value: 'grooming', label: 'Grooming', icon: '✨' },
    { value: 'nutrition', label: 'Nutrition', icon: '🍎' },
    { value: 'health', label: 'Health', icon: '❤️' },
    { value: 'housing', label: 'Housing', icon: '🏠' },
    { value: 'care', label: 'General Care', icon: '🐾' }
  ];

  const petTypes = [
    { value: 'all', label: 'All Pets', icon: '🐾' },
    { value: 'dog', label: 'Dogs', icon: '🐕' },
    { value: 'cat', label: 'Cats', icon: '🐈' },
    { value: 'bird', label: 'Birds', icon: '🐦' },
    { value: 'fish', label: 'Fish', icon: '🐠' },
    { value: 'rabbit', label: 'Rabbits', icon: '🐇' },
    { value: 'small', label: 'Small Pets', icon: '🐹' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGuides(sampleGuides);
      setFilteredGuides(sampleGuides);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterGuides();
  }, [searchTerm, selectedCategory, selectedPet, guides]);

  const filterGuides = () => {
    let filtered = guides;

    if (searchTerm) {
      filtered = filtered.filter(guide =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(guide => guide.category === selectedCategory);
    }

    if (selectedPet !== 'all') {
      filtered = filtered.filter(guide => guide.petType === selectedPet);
    }

    setFilteredGuides(filtered);
  };

  const handleDownload = async (guideId) => {
    try {
      // In real app, this would download the actual PDF
      const guide = guides.find(g => g.id === guideId);
      alert(`Downloading: ${guide.title}`);
      
      // Track download in backend
      await serviceAPI.downloadGuide(guideId);
      
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="service-page guide-downloader">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading amazing guides for you... 📚</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page guide-downloader">
      <div className="service-header">
        <div className="header-icon">
          <BookOpen size={32} />
        </div>
        <h1>Pet Care Guides Library</h1>
        <p>Download free expert guides for your furry friends! 📚</p>
      </div>

      <div className="guides-container">
        {/* Search and Filters */}
        <div className="guides-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <Filter size={16} />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select 
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
              >
                {petTypes.map(pet => (
                  <option key={pet.value} value={pet.value}>
                    {pet.icon} {pet.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="guides-grid">
          {filteredGuides.length > 0 ? (
            filteredGuides.map(guide => (
              <div key={guide.id} className="guide-card">
                <div 
                  className="guide-header"
                  style={{ backgroundColor: guide.color }}
                >
                  <span className="guide-emoji">{guide.image}</span>
                  <div className="guide-rating">
                    <Star size={14} fill="currentColor" />
                    {guide.rating}
                  </div>
                </div>

                <div className="guide-content">
                  <h3 className="guide-title">{guide.title}</h3>
                  <p className="guide-description">{guide.description}</p>
                  
                  <div className="guide-meta">
                    <span className="meta-item">📄 {guide.pages} pages</span>
                    <span className="meta-item">💾 {guide.fileSize}</span>
                    <span className="meta-item">⬇️ {guide.downloads}</span>
                  </div>

                  <button 
                    onClick={() => handleDownload(guide.id)}
                    className="download-btn"
                    style={{ backgroundColor: guide.color }}
                  >
                    <Download size={18} />
                    Download Guide
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No guides found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="guides-stats">
          <div className="stat-card">
            <span className="stat-number">{guides.length}+</span>
            <span className="stat-label">Expert Guides</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Total Downloads</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">4.8</span>
            <span className="stat-label">Average Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDownloader;