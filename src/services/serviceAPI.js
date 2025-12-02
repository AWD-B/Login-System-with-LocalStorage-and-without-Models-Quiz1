// services/serviceAPI.js - API calls for all pet services
const API_BASE = 'http://localhost:5000/api';

// Mock recipe data for demonstration
const mockRecipesData = {
  dog: [
    {
      name: "Healthy Chicken Delight",
      description: "A balanced meal with lean protein and vegetables perfect for active dogs",
      cookingTime: 30,
      servings: "2-3 meals",
      ingredients: [
        { name: "Chicken Breast", amount: "200g" },
        { name: "Brown Rice", amount: "1 cup" },
        { name: "Carrots", amount: "2 medium" },
        { name: "Green Beans", amount: "1 cup" },
        { name: "Fish Oil", amount: "1 tsp" }
      ],
      instructions: [
        "Cook chicken thoroughly until no longer pink",
        "Steam vegetables until tender",
        "Cook brown rice according to package instructions",
        "Mix all ingredients together in a large bowl",
        "Add fish oil and mix well",
        "Cool before serving to your dog"
      ],
      nutritionalInfo: {
        calories: "350 kcal",
        protein: "25g",
        fat: "8g",
        carbs: "45g"
      }
    },
    {
      name: "Beef & Vegetable Stew",
      description: "Hearty stew with lean beef and nutritious vegetables",
      cookingTime: 45,
      servings: "3-4 meals",
      ingredients: [
        { name: "Lean Ground Beef", amount: "250g" },
        { name: "Sweet Potato", amount: "1 large" },
        { name: "Peas", amount: "1/2 cup" },
        { name: "Carrots", amount: "3 medium" },
        { name: "Beef Broth", amount: "2 cups" }
      ],
      instructions: [
        "Brown the ground beef in a large pot",
        "Dice sweet potato and carrots into small pieces",
        "Add vegetables and beef broth to the pot",
        "Simmer for 30 minutes until vegetables are soft",
        "Let cool completely before serving"
      ],
      nutritionalInfo: {
        calories: "420 kcal",
        protein: "28g",
        fat: "15g",
        carbs: "38g"
      }
    }
  ],
  cat: [
    {
      name: "Salmon Supreme",
      description: "Omega-rich fish meal for healthy skin and coat",
      cookingTime: 20,
      servings: "2-3 meals",
      ingredients: [
        { name: "Salmon Fillet", amount: "150g" },
        { name: "Pumpkin Puree", amount: "2 tbsp" },
        { name: "Peas", amount: "1/4 cup" },
        { name: "Fish Oil", amount: "1/2 tsp" }
      ],
      instructions: [
        "Bake salmon at 180°C for 15 minutes",
        "Steam peas until tender",
        "Flake the cooked salmon",
        "Mix all ingredients together",
        "Add fish oil before serving"
      ],
      nutritionalInfo: {
        calories: "280 kcal",
        protein: "22g",
        fat: "18g",
        carbs: "12g"
      }
    }
  ],
  rabbit: [
    {
      name: "Garden Fresh Salad",
      description: "Fresh vegetable mix for your bunny",
      cookingTime: 10,
      servings: "1-2 meals",
      ingredients: [
        { name: "Romaine Lettuce", amount: "2 cups" },
        { name: "Carrots", amount: "1 small" },
        { name: "Bell Pepper", amount: "1/4" },
        { name: "Cilantro", amount: "1 tbsp" }
      ],
      instructions: [
        "Wash all vegetables thoroughly",
        "Chop into bite-sized pieces",
        "Mix together in a bowl",
        "Serve fresh"
      ],
      nutritionalInfo: {
        calories: "80 kcal",
        protein: "3g",
        fat: "1g",
        carbs: "15g"
      }
    }
  ]
};

// Service-specific API calls
export const serviceAPI = {
  // Age Calculator
  calculateAge: (petData) => fetch(`${API_BASE}/services/age`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(petData)
  }).then(res => res.json()),

  // Weight/BMI Checker
  calculateBMI: (weightData) => fetch(`${API_BASE}/services/bmi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(weightData)
  }).then(res => res.json()),

  // ===== RECIPE GENERATOR - MOCK DATA =====
  
  // Recipe Generation - USES MOCK DATA
  generateRecipes: async (criteria) => {
    console.log('Generating recipes with criteria:', criteria);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const petType = criteria.petType || 'dog';
    const baseRecipes = mockRecipesData[petType] || mockRecipesData.dog;
    
    // Filter based on selected ingredients
    let filteredRecipes = baseRecipes;
    if (criteria.ingredients && criteria.ingredients.length > 0) {
      filteredRecipes = baseRecipes.filter(recipe => {
        return criteria.ingredients.some(ingredient => 
          recipe.ingredients.some(ing => 
            ing.name.toLowerCase().includes(ingredient)
          )
        );
      });
    }
    
    // If no recipes match, return base recipes
    if (filteredRecipes.length === 0) {
      filteredRecipes = baseRecipes;
    }
    
    // Add IDs and pet info to recipes
    const recipesWithIds = filteredRecipes.map(recipe => ({
      ...recipe,
      id: Date.now() + Math.random(),
      petInfo: criteria
    }));
    
    return { 
      recipes: recipesWithIds,
      generationId: Date.now().toString(),
      message: `Generated ${recipesWithIds.length} recipes for your ${petType}`
    };
  },

  // Get user's saved recipes - LOCALSTORAGE ONLY
  getSavedRecipes: async () => {
    try {
      const saved = localStorage.getItem('savedRecipes');
      const recipes = saved ? JSON.parse(saved) : [];
      console.log('Loaded recipes from localStorage:', recipes.length);
      return { recipes };
    } catch (error) {
      console.log('No saved recipes found, starting fresh');
      return { recipes: [] };
    }
  },

  // Save Recipe - LOCALSTORAGE ONLY
  saveRecipe: async (recipe) => {
    try {
      const saved = localStorage.getItem('savedRecipes');
      const recipes = saved ? JSON.parse(saved) : [];
      
      const recipeToSave = {
        ...recipe,
        id: recipe.id || Date.now().toString(),
        savedAt: new Date().toISOString()
      };
      
      // Check if recipe already exists
      const existingIndex = recipes.findIndex(r => r.id === recipeToSave.id);
      if (existingIndex >= 0) {
        recipes[existingIndex] = recipeToSave;
      } else {
        recipes.push(recipeToSave);
      }
      
      localStorage.setItem('savedRecipes', JSON.stringify(recipes));
      console.log('Recipe saved to localStorage:', recipeToSave.name);
      return { success: true, recipe: recipeToSave };
    } catch (error) {
      console.error('Error saving recipe:', error);
      return { success: false, error: error.message };
    }
  },

  // Update Recipe - LOCALSTORAGE ONLY
  updateRecipe: async (recipeId, updates) => {
    try {
      const saved = localStorage.getItem('savedRecipes');
      const recipes = saved ? JSON.parse(saved) : [];
      
      const recipeIndex = recipes.findIndex(r => r.id === recipeId);
      if (recipeIndex >= 0) {
        recipes[recipeIndex] = { ...recipes[recipeIndex], ...updates };
        localStorage.setItem('savedRecipes', JSON.stringify(recipes));
        console.log('Recipe updated in localStorage:', recipeId);
        return { success: true, recipe: recipes[recipeIndex] };
      } else {
        return { success: false, error: 'Recipe not found' };
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete Recipe - LOCALSTORAGE ONLY
  deleteRecipe: async (recipeId) => {
    try {
      const saved = localStorage.getItem('savedRecipes');
      const recipes = saved ? JSON.parse(saved) : [];
      
      const filteredRecipes = recipes.filter(r => r.id !== recipeId);
      localStorage.setItem('savedRecipes', JSON.stringify(filteredRecipes));
      console.log('Recipe deleted from localStorage:', recipeId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return { success: false, error: error.message };
    }
  },

  // ===== OTHER METHODS =====
  getGuides: () => fetch(`${API_BASE}/services/guides`).then(res => res.json()),
  downloadGuide: (guideId) => fetch(`${API_BASE}/services/guides/${guideId}/download`).then(res => res.json()),
  generateChart: (chartData) => fetch(`${API_BASE}/services/charts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(chartData)
  }).then(res => res.json()),
  identifyBreed: (formData) => fetch(`${API_BASE}/services/breeds/identify`, {
    method: 'POST',
    body: formData,
    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
  }).then(res => res.json()),
  generateNames: (preferences) => fetch(`${API_BASE}/services/names`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(preferences)
  }).then(res => res.json()),
  saveFavoriteNames: (favorites) => fetch(`${API_BASE}/services/names/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(favorites)
  }).then(res => res.json()),
  getDashboardData: () => fetch(`${API_BASE}/dashboard/data`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
  }).then(res => res.json()),
  deleteServiceRecord: (serviceType, id) => fetch(`${API_BASE}/dashboard/${serviceType}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
  }).then(res => res.json()),
  updateServiceRecord: (serviceType, id, data) => fetch(`${API_BASE}/dashboard/${serviceType}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  getServiceHistory: (serviceType, limit = 10) => fetch(`${API_BASE}/dashboard/history/${serviceType}?limit=${limit}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
  }).then(res => res.json()),
  toggleServiceVisibility: (serviceType, isVisible) => fetch(`${API_BASE}/dashboard/services/visibility`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ serviceType, isVisible })
  }).then(res => res.json())
};

export default serviceAPI;