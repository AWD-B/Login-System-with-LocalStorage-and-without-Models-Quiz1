// Dashing.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashing.css";

// Import API services
import { serviceAPI } from "../services/serviceAPI";

// Import modals
import PetProfileModal from "./PetProfileModal";
import AgeCalculatorModal from "./services/AgeCalculatorModal";
import WeightCheckerModal from "./services/WeightCheckerModal";
import RecipeGeneratorModal from "./services/RecipeGeneratorModal";
import NameGeneratorModal from "./services/NameGeneratorModal";
import ServiceHistory from "./ServiceHistory";
import ServiceResultCard from "./ServiceResultCard";

// Icons
import { 
  FaCalculator, 
  FaWeight, 
  FaUtensils, 
  FaSignature, 
  FaSignOutAlt,
  FaPaw,
  FaUserCircle,
  FaEdit,
  FaPlus,
  FaHistory,
  FaTrash
} from "react-icons/fa";

const Dashing = () => {
  const navigate = useNavigate();
  
  // Main state
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');
  const [editingWeightRecord, setEditingWeightRecord] = useState(null);
  
  // Service states - WITH SAFE DEFAULT VALUES
  const [serviceHistory, setServiceHistory] = useState({
    ageCalculations: [],
    weightRecords: [],
    recipes: [],
    names: []
  });
  const [activeService, setActiveService] = useState(null);
  const [serviceResults, setServiceResults] = useState([]);

  // Modal states
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  // Safe access to serviceHistory with fallbacks
  const safeServiceHistory = {
    ageCalculations: serviceHistory?.ageCalculations || [],
    weightRecords: serviceHistory?.weightRecords || [],
    recipes: serviceHistory?.recipes || [],
    names: serviceHistory?.names || []
  };

  // Load all dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Check authentication
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.log("No token found");
          setIsLoading(false);
          return;
        }

        // Test API connection
       try {
  // Only test API if backend is running
  // For now, skip API test since we're using localStorage
  setApiStatus('connected');
  console.log("✅ Using localStorage mode");
} catch (error) {
  setApiStatus('connected'); // Still connected to localStorage
  console.log("⚠️ Using localStorage (backend not available)");
}
        // Load user data
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }

        // Load all data in parallel
        await Promise.all([
          loadPetsFromAPI(),
          loadServiceHistory()
        ]);

      } catch (error) {
        console.error("❌ Error loading dashboard data:", error);
        setApiStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // CRUD: Load pets from API
  const loadPetsFromAPI = async () => {
    try {
      console.log("🔄 Loading pets...");
      
      const savedPets = localStorage.getItem('userPets');
      if (savedPets) {
        const petsData = JSON.parse(savedPets);
        setPets(petsData);
        console.log(`✅ Loaded ${petsData.length} pets from localStorage`);
      } else {
        setPets([]);
        console.log("ℹ️ No pets found in localStorage");
      }
      
    } catch (error) {
      console.error("❌ Failed to load pets:", error);
      setPets([]);
    }
  };

  // CRUD: Load service history
  const loadServiceHistory = async () => {
    try {
      console.log("🔄 Loading service history...");
      
      const savedHistory = localStorage.getItem('serviceHistory');
      if (savedHistory) {
        const historyData = JSON.parse(savedHistory);
        // Ensure all arrays exist
        const safeHistory = {
          ageCalculations: historyData.ageCalculations || [],
          weightRecords: historyData.weightRecords || [],
          recipes: historyData.recipes || [],
          names: historyData.names || []
        };
        setServiceHistory(safeHistory);
        console.log("✅ Loaded service history from localStorage");
      } else {
        setServiceHistory({
          ageCalculations: [],
          weightRecords: [],
          recipes: [],
          names: []
        });
        console.log("ℹ️ No service history found");
      }
    } catch (error) {
      console.error("❌ Failed to load service history:", error);
      setServiceHistory({
        ageCalculations: [],
        weightRecords: [],
        recipes: [],
        names: []
      });
    }
  };

  // CRUD: Handle pet operations
  const handlePetUpdate = (updatedPet) => {
    let updatedPets;
    
    if (editingPet) {
      updatedPets = pets.map(pet => 
        pet._id === updatedPet._id ? updatedPet : pet
      );
    } else {
      const newPet = {
        ...updatedPet,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedPets = [newPet, ...pets];
    }
    
    setPets(updatedPets);
    localStorage.setItem('userPets', JSON.stringify(updatedPets));
    setIsPetModalOpen(false);
    setEditingPet(null);
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet profile?')) return;

    try {
      const updatedPets = pets.filter(pet => pet._id !== petId);
      setPets(updatedPets);
      localStorage.setItem('userPets', JSON.stringify(updatedPets));
      console.log("✅ Pet deleted successfully");
    } catch (error) {
      console.error("❌ Failed to delete pet:", error);
      alert('Failed to delete pet: ' + error.message);
    }
  };

  // Service Operations - FIXED with safe access
  const handleServiceResult = (result) => {
    console.log("Service result received:", result);
    
    const resultWithId = {
      ...result,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    setServiceResults(prev => [resultWithId, ...prev.slice(0, 5)]);
    
    const savedHistory = JSON.parse(localStorage.getItem('serviceHistory') || '{}');
    const newHistory = {
      ageCalculations: savedHistory.ageCalculations || [],
      weightRecords: savedHistory.weightRecords || [],
      recipes: savedHistory.recipes || [],
      names: savedHistory.names || []
    };
    
    if (result.type === 'age') {
      newHistory.ageCalculations = [resultWithId, ...newHistory.ageCalculations.slice(0, 9)];
    } else if (result.type === 'weight') {
      newHistory.weightRecords = [resultWithId, ...newHistory.weightRecords.slice(0, 9)];
    } else if (result.type === 'recipe') {
      newHistory.recipes = [resultWithId, ...newHistory.recipes.slice(0, 9)];
    }
    
    localStorage.setItem('serviceHistory', JSON.stringify(newHistory));
    setServiceHistory(newHistory);
  };

  const handleDeleteServiceResult = (resultId, type) => {
    const newHistory = { ...safeServiceHistory };
    
    if (type === 'age') {
      newHistory.ageCalculations = newHistory.ageCalculations.filter(item => item.id !== resultId);
    } else if (type === 'weight') {
      newHistory.weightRecords = newHistory.weightRecords.filter(item => item.id !== resultId);
    } else if (type === 'recipe' || type === 'recipes') {
      newHistory.recipes = newHistory.recipes.filter(item => item.id !== resultId);
    }
    
    setServiceHistory(newHistory);
    setServiceResults(prev => prev.filter(item => item.id !== resultId));
    localStorage.setItem('serviceHistory', JSON.stringify(newHistory));
  };

  const handleEditWeightRecord = (record) => {
    setEditingWeightRecord(record);
    setIsWeightModalOpen(true);
  };

  // Service click handlers
  const handleServiceClick = (serviceName) => {
    switch (serviceName) {
      case "My Pet Profile":
        if (pets.length === 0) {
          handleCreatePet();
        } else {
          setActiveService('petProfile');
        }
        break;
      case "Pet Age Calculator":
        setIsAgeModalOpen(true);
        setActiveService('ageCalculator');
        break;
      case "Pet Weight/BMI Checker":
        setIsWeightModalOpen(true);
        setActiveService('weightChecker');
        break;
      case "Pet Food Recipe Generator":
        setIsRecipeModalOpen(true);
        setActiveService('recipeGenerator');
        break;
      case "Pet Name Generator":
        setIsNameModalOpen(true);
        setActiveService('nameGenerator');
        break;
      default:
        console.log(`Clicked on ${serviceName}`);
    }
  };

  const handleCreatePet = () => {
    setEditingPet(null);
    setIsPetModalOpen(true);
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setIsPetModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  // Services data with safe access
  const services = [
    {
      id: 1,
      name: "My Pet Profile",
      icon: <FaUserCircle />,
      description: pets.length > 0 
        ? `Manage ${pets.length} pet profile(s)` 
        : "Create your first pet profile",
      color: "#8B5CF6",
      hasPets: pets.length > 0,
      stats: pets.length
    },
    {
      id: 2,
      name: "Pet Age Calculator",
      icon: <FaCalculator />,
      description: "Calculate your pet's age in human years",
      color: "#3B82F6",
      stats: safeServiceHistory.ageCalculations.length
    },
    {
      id: 3,
      name: "Pet Weight/BMI Checker",
      icon: <FaWeight />,
      description: "Check if your pet is at a healthy weight",
      color: "#10B981",
      stats: safeServiceHistory.weightRecords.length
    },
    {
      id: 4,
      name: "Pet Food Recipe Generator",
      icon: <FaUtensils />,
      description: "Get customized recipes for your pet",
      color: "#F59E0B",
      stats: "New"
    },
    {
      id: 5,
      name: "Pet Name Generator",
      icon: <FaSignature />,
      description: "Find the perfect name for your new pet",
      color: "#EC4899",
      stats: "Fun"
    },
    {
      id: 6,
      name: "Logout",
      icon: <FaSignOutAlt />,
      description: "Securely sign out of your account",
      color: "#EF4444",
      isLogout: true
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Loading your dashboard...
        {apiStatus === 'checking' && <p>Checking API connection...</p>}
      </div>
    );
  }

  // Authentication error
  if (!user) {
    return (
      <div className="error-container">
        <h2>Authentication Error</h2>
        <p>Unable to load user data. Please log in again.</p>
        <button 
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="logout-btn"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // API connection error
  if (apiStatus === 'error') {
    return (
      <div className="error-container">
        <h2>Connection Error</h2>
        <p>Unable to connect to the server. Please check if your backend is running.</p>
        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={() => window.location.reload()}
            className="logout-btn"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="dashboard-container">
      {/* API Status Indicator */}
      <div className="api-status" data-status={apiStatus}>
        {apiStatus === 'connected' ? '✅ API Connected' : '❌ API Error'}
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="floating-pets">
          <span className="pet-float pet-1">🐕</span>
          <span className="pet-float pet-2">🐱</span>
          <span className="pet-float pet-3">🐾</span>
          <span className="pet-float pet-4">❤️</span>
        </div>

        <div className="welcome-header">
          <FaPaw className="welcome-icon" />
          <div className="welcome-text">
            <h1>Welcome back, {user.username || user.email}! 🐾</h1>
            {pets.length > 0 && (
              <div className="pet-welcome">
                <span>Say hello to your {pets.length} furry friend(s)!</span>
              </div>
            )}
          </div>
        </div>
        <p className="welcome-subtitle">Email: {user.email}</p>
        <p className="welcome-description">
          From your account dashboard you can access various pet tools and manage your account.
        </p>
      </div>

      {/* Quick Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🐕</div>
            <div className="stat-info">
              <span className="stat-number">{pets.length}</span>
              <span className="stat-label">Pets</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-number">{safeServiceHistory.ageCalculations.length}</span>
              <span className="stat-label">Age Calculations</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚖️</div>
            <div className="stat-info">
              <span className="stat-number">{safeServiceHistory.weightRecords.length}</span>
              <span className="stat-label">Weight Checks</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌟</div>
            <div className="stat-info">
              <span className="stat-number">{pets.length * 2 + 5}</span>
              <span className="stat-label">Pet Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      {serviceResults.length > 0 && (
        <div className="recent-activity">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-grid">
            {serviceResults.slice(0, 3).map((result, index) => (
              <ServiceResultCard
                key={result.id || index}
                result={result}
                onDelete={handleDeleteServiceResult}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pet Profiles Section */}
      {pets.length > 0 && (
        <div className="pet-profile-display">
          <div className="profile-header">
            <h2>Your Pet Family</h2>
            <button 
              className="edit-profile-btn"
              onClick={handleCreatePet}
            >
              <FaPlus /> Add New Pet
            </button>
          </div>
          
          <div className="pets-grid">
            {pets.map((pet) => (
              <div key={pet._id} className="profile-card">
                <div className="profile-image-section">
                  <img 
                    src={pet.image || '/default-pet.png'} 
                    alt={pet.name}
                    className="profile-image"
                    onError={(e) => {
                      e.target.src = '/default-pet.png';
                    }}
                  />
                </div>
                
                <div className="profile-details">
                  <h3 className="pet-name">{pet.name}</h3>
                  <div className="profile-info-grid">
                    <div className="info-item">
                      <span className="info-label">Type</span>
                      <span className="info-value">
                        {pet.type === 'dog' ? '🐕' : 
                         pet.type === 'cat' ? '🐈' : 
                         pet.type === 'bird' ? '🐦' : 
                         pet.type === 'rabbit' ? '🐇' : 
                         pet.type === 'fish' ? '🐠' : 
                         pet.type === 'hamster' ? '🐹' : '🐾'} 
                        {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
                      </span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Breed</span>
                      <span className="info-value">{pet.breed || 'Not specified'}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Age</span>
                      <span className="info-value">
                        {pet.age ? `${pet.age} years` : 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Weight</span>
                      <span className="info-value">
                        {pet.weight ? `${pet.weight} kg` : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="profile-actions">
                  <button 
                    className="edit-profile-btn"
                    onClick={() => handleEditPet(pet)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="delete-profile-btn"
                    onClick={() => handleDeletePet(pet._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Pets Message */}
      {pets.length === 0 && (
        <div className="welcome-section no-pets-section">
          <h2>No Pets Yet! 🐾</h2>
          <p>Start by creating your first pet profile to unlock all features.</p>
          <button 
            className="edit-profile-btn"
            onClick={handleCreatePet}
          >
            <FaPlus /> Create Your First Pet Profile
          </button>
        </div>
      )}

      {/* Service History Section - SINGLE COMPONENT */}
      <ServiceHistory 
        history={safeServiceHistory}
        onDelete={handleDeleteServiceResult}
      />

      {/* Services Gallery */}
<div 
  className="services-section" 
  style={{
    background: 'linear-gradient(125deg, #FFE87C 50%, #FFB347 90%)',
    border: '2px solid rgba(255, 200, 100, 0.5)',
    borderRadius: '12px',
    padding: '2rem'
  }}
>
        <h2 className="services-title">Your Pet Tools</h2>
        <p className="services-subtitle">Choose from our specialized pet services</p>
        
        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-card ${service.isLogout ? 'logout-card' : ''} ${service.hasPets ? 'profile-card-highlight' : ''}`}
              onClick={service.isLogout ? handleLogout : () => handleServiceClick(service.name)}
              style={{ '--card-color': service.color }}
            >
              <div className="service-icon" style={{ color: service.color }}>
                {service.icon}
              </div>
              <h3 className="service-name">{service.name}</h3>
              <p className="service-description">{service.description}</p>
              
              {service.stats && !service.isLogout && (
                <div className="service-stats">
                  <span className="stat-badge">
                    {typeof service.stats === 'number' ? service.stats : service.stats}
                  </span>
                </div>
              )}
              
              {service.hasPets && (
                <div className="profile-badge">
                  <FaPaw /> {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <PetProfileModal
        isOpen={isPetModalOpen}
        onClose={() => {
          setIsPetModalOpen(false);
          setEditingPet(null);
        }}
        pet={editingPet}
        onPetUpdate={handlePetUpdate}
      />

      <AgeCalculatorModal
        isOpen={isAgeModalOpen}
        onClose={() => setIsAgeModalOpen(false)}
        pets={pets}
        onResult={handleServiceResult}
      />

      <WeightCheckerModal
        isOpen={isWeightModalOpen}
        onClose={() => {
          console.log("Dashing.jsx - Closing weight modal");
          setIsWeightModalOpen(false);
          setEditingWeightRecord(null);
        }}
        pets={pets}
        onResult={handleServiceResult}
        editRecord={editingWeightRecord}
      />

      <RecipeGeneratorModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        pets={pets}
        onResult={handleServiceResult}
      />

      <NameGeneratorModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onResult={handleServiceResult}
      />
    </section>
  );
};

export default Dashing;