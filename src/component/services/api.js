// services/api.js - Centralized API calls for frontend
const API_BASE = 'http://localhost:5000/api';

// Generic API call function with auth
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Pet CRUD Operations
export const petAPI = {
  // CREATE - Add new pet
  createPet: (petData) => apiCall('/pets', {
    method: 'POST',
    body: JSON.stringify(petData)
  }),

  // READ - Get all user's pets
  getPets: () => apiCall('/pets'),

  // READ - Get single pet
  getPet: (id) => apiCall(`/pets/${id}`),

  // UPDATE - Update pet profile
  updatePet: (id, updates) => apiCall(`/pets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),

  // DELETE - Remove pet
  deletePet: (id) => apiCall(`/pets/${id}`, {
    method: 'DELETE'
  })
};

// Test protected route
export const testProtectedRoute = () => apiCall('/protected-test');

export default apiCall;