// src/component/services/RecipeGeneratorModal.jsx
import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../../services/serviceAPI';
import { ChefHat, Heart, Clock, Users, X, Bookmark, Edit, Trash2, Eye, Plus } from 'lucide-react';

const RecipeGeneratorModal = ({ isOpen, onClose, pet, onRecipesSave }) => {
  const [criteria, setCriteria] = useState({
    petType: 'dog',
    weight: '',
    healthConditions: [],
    ingredients: []
  });
  const [recipes, setRecipes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [viewMode, setViewMode] = useState('generate'); // 'generate', 'view', 'edit', 'saved'
  const [editingRecipe, setEditingRecipe] = useState(null);

  const healthConditions = [
    { value: 'weight_loss', label: 'Weight Loss', icon: '⚖️' },
    { value: 'allergies', label: 'Food Allergies', icon: '🚫' },
    { value: 'sensitive_stomach', label: 'Sensitive Stomach', icon: '🤢' },
    { value: 'joint_health', label: 'Joint Health', icon: '🦴' }
  ];

  const ingredients = [
    { value: 'chicken', label: 'Chicken', icon: '🍗' },
    { value: 'beef', label: 'Beef', icon: '🥩' },
    { value: 'fish', label: 'Fish', icon: '🐟' },
    { value: 'rice', label: 'Rice', icon: '🍚' },
    { value: 'sweet_potato', label: 'Sweet Potato', icon: '🍠' },
    { value: 'carrots', label: 'Carrots', icon: '🥕' }
  ];

  // Load saved recipes from localStorage
  useEffect(() => {
    const loadSavedRecipes = () => {
      try {
        const saved = localStorage.getItem('savedRecipes');
        if (saved) {
          setSavedRecipes(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved recipes:', error);
      }
    };

    loadSavedRecipes();
  }, []);

  // Pre-fill form if pet is provided
  useEffect(() => {
    if (pet) {
      setCriteria(prev => ({
        ...prev,
        petType: pet.type || 'dog',
        weight: pet.weight || ''
      }));
    }
  }, [pet]);


  // Load saved recipes from API on component mount
// Load saved recipes from API on component mount
useEffect(() => {
  const loadSavedRecipes = async () => {
    try {
      const response = await serviceAPI.getSavedRecipes();
      // Handle both API response and localStorage fallback
      const recipes = response.recipes || response || [];
      setSavedRecipes(Array.isArray(recipes) ? recipes : []);
    } catch (error) {
      console.error('Error loading saved recipes:', error);
      // Final fallback - try localStorage directly
      try {
        const saved = localStorage.getItem('savedRecipes');
        if (saved) {
          setSavedRecipes(JSON.parse(saved));
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
        setSavedRecipes([]);
      }
    }
  };

  if (isOpen) {
    loadSavedRecipes();
  }
}, [isOpen]);

  // Save recipes to localStorage
  const saveRecipesToStorage = (recipes) => {
    try {
      localStorage.setItem('savedRecipes', JSON.stringify(recipes));
    } catch (error) {
      console.error('Error saving recipes:', error);
    }
  };

  // CRUD Operations
// CRUD Operations
const generateRecipes = async (e) => {
  e.preventDefault();
  setIsGenerating(true);
  console.log('Starting recipe generation...');

  try {
    const response = await serviceAPI.generateRecipes({ criteria });
    console.log('Recipe generation response:', response);
    
    const recipesWithIds = (response.recipes || []).map(recipe => ({
      ...recipe,
      id: recipe.id || Date.now() + Math.random(),
      petInfo: criteria,
      createdAt: new Date().toISOString()
    }));
    
    setRecipes(recipesWithIds);
    console.log('Recipes set:', recipesWithIds.length);

    // Add to service history for dashboard display
    if (recipesWithIds.length > 0) {
      const recipeHistoryItem = {
        type: 'recipe',
        id: Date.now().toString(),
        name: `${recipesWithIds.length} Recipes Generated`,
        description: `Custom recipes for your ${criteria.petType}`,
        cookingTime: recipesWithIds[0].cookingTime,
        servings: recipesWithIds[0].servings,
        ingredients: recipesWithIds[0].ingredients,
        petInfo: criteria,
        timestamp: new Date().toISOString(),
        recipesCount: recipesWithIds.length
      };

      const savedHistory = JSON.parse(localStorage.getItem('serviceHistory') || '{}');
      const newHistory = { 
        ...savedHistory,
        recipes: [recipeHistoryItem, ...(savedHistory.recipes || []).slice(0, 9)]
      };
      localStorage.setItem('serviceHistory', JSON.stringify(newHistory));
    }

    if (onRecipesSave) {
      onRecipesSave(response.generationId);
    }

  } catch (error) {
    console.error('Recipe generation error:', error);
    // Fallback mock data
    const basicRecipes = [
      {
        id: Date.now() + 1,
        name: "Basic Chicken Meal",
        description: "Simple and nutritious meal for your pet",
        cookingTime: 25,
        servings: "2 meals",
        ingredients: [
          { name: "Chicken", amount: "200g" },
          { name: "Rice", amount: "1 cup" },
          { name: "Vegetables", amount: "1/2 cup" }
        ],
        instructions: [
          "Cook all ingredients",
          "Mix together",
          "Cool and serve"
        ],
        nutritionalInfo: {
          calories: "300 kcal",
          protein: "20g",
          fat: "10g",
          carbs: "35g"
        },
        petInfo: criteria,
        createdAt: new Date().toISOString()
      }
    ];
    
    setRecipes(basicRecipes);
    console.log('Using fallback recipes');
  } finally {
    setIsGenerating(false);
    console.log('Recipe generation completed');
  }
};
const saveRecipe = async (recipe) => {
  try {
    // Save to localStorage for recipe management
    await serviceAPI.saveRecipe(recipe);
    
    // Also add to service history for dashboard display
    const recipeHistoryItem = {
      type: 'recipe',
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      petInfo: recipe.petInfo,
      timestamp: new Date().toISOString(),
      savedAt: new Date().toISOString()
    };

    // Update service history in localStorage
    const savedHistory = JSON.parse(localStorage.getItem('serviceHistory') || '{}');
    const newHistory = { 
      ...savedHistory,
      recipes: [recipeHistoryItem, ...(savedHistory.recipes || []).slice(0, 9)]
    };
    localStorage.setItem('serviceHistory', JSON.stringify(newHistory));

    // Reload the saved recipes to update UI
    const response = await serviceAPI.getSavedRecipes();
    const recipes = response.recipes || response || [];
    setSavedRecipes(Array.isArray(recipes) ? recipes : []);
    
    console.log('Recipe saved successfully and added to history');
    
    // Show success message
    alert(`Recipe "${recipe.name}" saved successfully!`);
    
  } catch (error) {
    console.error('Failed to save recipe:', error);
    alert('Failed to save recipe. Please try again.');
  }
};


const deleteRecipe = async (recipeId) => {
  try {
    await serviceAPI.deleteRecipe(recipeId);
    // Reload the saved recipes
    const response = await serviceAPI.getSavedRecipes();
    const recipes = response.recipes || response || [];
    setSavedRecipes(Array.isArray(recipes) ? recipes : []);
  } catch (error) {
    console.error('Failed to delete recipe:', error);
    alert('Failed to delete recipe. Please try again.');
  }
};

const updateRecipe = async (updatedRecipe) => {
  try {
    await serviceAPI.updateRecipe(updatedRecipe.id, updatedRecipe);
    // Reload the saved recipes
    const response = await serviceAPI.getSavedRecipes();
    const recipes = response.recipes || response || [];
    setSavedRecipes(Array.isArray(recipes) ? recipes : []);
    setEditingRecipe(null);
    setViewMode('saved');
  } catch (error) {
    console.error('Failed to update recipe:', error);
    alert('Failed to update recipe. Please try again.');
  }
};
  const viewRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setViewMode('view');
  };

  const editRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setViewMode('edit');
  };

  const createNewRecipe = () => {
    setEditingRecipe({
      id: Date.now(),
      name: '',
      description: '',
      cookingTime: '',
      servings: '',
      ingredients: [{ name: '', amount: '' }],
      instructions: [''],
      nutritionalInfo: {
        calories: '',
        protein: '',
        fat: '',
        carbs: ''
      },
      petInfo: criteria
    });
    setViewMode('edit');
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>
            <ChefHat size={24} />
            <h2 style={styles.modalTitleText}>Pet Recipe Generator</h2>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.modalContent}>
          {/* Navigation Tabs */}
          <div style={styles.tabContainer}>
            <button 
              style={{
                ...styles.tab,
                ...(viewMode === 'generate' ? styles.activeTab : {})
              }}
              onClick={() => setViewMode('generate')}
            >
              Generate Recipes
            </button>
            <button 
              style={{
                ...styles.tab,
                ...(viewMode === 'saved' ? styles.activeTab : {})
              }}
              onClick={() => setViewMode('saved')}
            >
              Saved Recipes ({savedRecipes.length})
            </button>
          </div>

          {pet && (
            <div style={styles.petBanner}>
              🐾 Generating recipes for: <strong>{pet.name}</strong>
            </div>
          )}

          {/* Generate Recipes View */}
          {viewMode === 'generate' && recipes.length === 0 && (
            <form onSubmit={generateRecipes} style={styles.form}>
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Tell us about your pet</h3>
                
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <Heart size={16} />
                      Pet Type
                    </label>
                    <select 
                      value={criteria.petType}
                      onChange={(e) => setCriteria(prev => ({ ...prev, petType: e.target.value }))}
                      style={styles.select}
                    >
                      <option value="dog">🐕 Dog</option>
                      <option value="cat">🐈 Cat</option>
                      <option value="rabbit">🐇 Rabbit</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Weight (kg)</label>
                    <input
                      type="number"
                      value={criteria.weight}
                      onChange={(e) => setCriteria(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="e.g., 12.5"
                      step="0.1"
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Special Dietary Needs</h3>
                <div style={styles.checkboxGrid}>
                  {healthConditions.map(condition => (
                    <label key={condition.value} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={criteria.healthConditions.includes(condition.value)}
                        onChange={(e) => {
                          const newConditions = e.target.checked
                            ? [...criteria.healthConditions, condition.value]
                            : criteria.healthConditions.filter(c => c !== condition.value);
                          setCriteria(prev => ({ ...prev, healthConditions: newConditions }));
                        }}
                        style={styles.checkboxInput}
                      />
                      <span style={styles.checkmark}>
                        <span style={styles.conditionEmoji}>{condition.icon}</span>
                        {condition.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Preferred Ingredients</h3>
                <div style={styles.checkboxGrid}>
                  {ingredients.map(ingredient => (
                    <label key={ingredient.value} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={criteria.ingredients.includes(ingredient.value)}
                        onChange={(e) => {
                          const newIngredients = e.target.checked
                            ? [...criteria.ingredients, ingredient.value]
                            : criteria.ingredients.filter(i => i !== ingredient.value);
                          setCriteria(prev => ({ ...prev, ingredients: newIngredients }));
                        }}
                        style={styles.checkboxInput}
                      />
                      <span style={styles.checkmark}>
                        <span style={styles.ingredientEmoji}>{ingredient.icon}</span>
                        {ingredient.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                style={{
                  ...styles.generateButton,
                  ...(isGenerating ? styles.loadingButton : {})
                }}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div style={styles.spinner}></div>
                    Cooking up recipes...
                  </>
                ) : (
                  <>
                    <ChefHat size={20} />
                    Generate Recipes
                  </>
                )}
              </button>
            </form>
          )}

          {/* Generated Recipes View */}
          {viewMode === 'generate' && recipes.length > 0 && (
            <div style={styles.resultsContainer}>
              <div style={styles.resultsHeader}>
                <h3 style={styles.resultsTitle}>Recommended Recipes ({recipes.length})</h3>
                <div style={styles.resultsActions}>
                  <button 
                    onClick={() => setRecipes([])}
                    style={styles.secondaryButton}
                  >
                    Generate New
                  </button>
                  <button 
                    onClick={() => setViewMode('saved')}
                    style={styles.primaryButton}
                  >
                    View Saved ({savedRecipes.length})
                  </button>
                </div>
              </div>

              <div style={styles.recipesGrid}>
                {recipes.map((recipe) => (
                  <div key={recipe.id} style={styles.recipeCard}>
                    <div style={styles.recipeHeader}>
                      <div style={styles.recipeIcon}>🍖</div>
                      <button 
                        onClick={() => saveRecipe(recipe)}
                        style={styles.saveButton}
                        title="Save recipe"
                      >
                        <Bookmark size={16} />
                      </button>
                    </div>

                    <div style={styles.recipeContent}>
                      <h4 style={styles.recipeName}>{recipe.name}</h4>
                      <p style={styles.recipeDescription}>{recipe.description}</p>

                      <div style={styles.recipeMeta}>
                        <span style={styles.metaItem}>
                          <Clock size={14} />
                          {recipe.cookingTime} mins
                        </span>
                        <span style={styles.metaItem}>
                          <Users size={14} />
                          {recipe.servings}
                        </span>
                      </div>

                      <div style={styles.ingredientsPreview}>
                        <strong>Ingredients:</strong>
                        <ul style={styles.ingredientsList}>
                          {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                            <li key={idx} style={styles.ingredientItem}>{ing.name}</li>
                          ))}
                          {recipe.ingredients.length > 3 && <li style={styles.moreItem}>...and more</li>}
                        </ul>
                      </div>

                      <div style={styles.recipeActions}>
                        <button 
                          onClick={() => viewRecipe(recipe)}
                          style={styles.actionButton}
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button 
                          onClick={() => saveRecipe(recipe)}
                          style={styles.actionButton}
                        >
                          <Bookmark size={14} />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Recipes View */}
          {viewMode === 'saved' && (
            <div style={styles.savedContainer}>
              <div style={styles.savedHeader}>
                <h3 style={styles.savedTitle}>Your Saved Recipes ({savedRecipes.length})</h3>
                <button 
                  onClick={createNewRecipe}
                  style={styles.createButton}
                >
                  <Plus size={16} />
                  Create New Recipe
                </button>
              </div>

              {savedRecipes.length === 0 ? (
                <div style={styles.emptyState}>
                  <ChefHat size={48} style={styles.emptyIcon} />
                  <h4 style={styles.emptyTitle}>No saved recipes yet</h4>
                  <p style={styles.emptyText}>
                    Generate some recipes or create your own custom recipe to get started.
                  </p>
                  <button 
                    onClick={() => setViewMode('generate')}
                    style={styles.primaryButton}
                  >
                    Generate Recipes
                  </button>
                </div>
              ) : (
                <div style={styles.savedGrid}>
                  {savedRecipes.map((recipe) => (
                    <div key={recipe.id} style={styles.savedRecipeCard}>
                      <div style={styles.savedRecipeHeader}>
                        <div style={styles.savedRecipeIcon}>🍖</div>
                        <div style={styles.savedRecipeActions}>
                          <button 
                            onClick={() => viewRecipe(recipe)}
                            style={styles.smallActionButton}
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => editRecipe(recipe)}
                            style={styles.smallActionButton}
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => deleteRecipe(recipe.id)}
                            style={styles.smallActionButton}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div style={styles.savedRecipeContent}>
                        <h4 style={styles.savedRecipeName}>{recipe.name}</h4>
                        <p style={styles.savedRecipeDescription}>{recipe.description}</p>
                        
                        <div style={styles.savedRecipeMeta}>
                          <span style={styles.savedMetaItem}>
                            <Clock size={12} />
                            {recipe.cookingTime} mins
                          </span>
                          <span style={styles.savedMetaItem}>
                            {new Date(recipe.savedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View Recipe Detail */}
          {viewMode === 'view' && editingRecipe && (
            <div style={styles.detailContainer}>
              <div style={styles.detailHeader}>
                <button 
                  onClick={() => setViewMode('saved')}
                  style={styles.backButton}
                >
                  ← Back to Saved
                </button>
                <div style={styles.detailActions}>
                  <button 
                    onClick={() => editRecipe(editingRecipe)}
                    style={styles.secondaryButton}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteRecipe(editingRecipe.id)}
                    style={styles.dangerButton}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>

              <div style={styles.detailContent}>
                <div style={styles.detailHero}>
                  <div style={styles.detailIcon}>🍖</div>
                  <div>
                    <h2 style={styles.detailTitle}>{editingRecipe.name}</h2>
                    <p style={styles.detailDescription}>{editingRecipe.description}</p>
                  </div>
                </div>

                <div style={styles.detailGrid}>
                  <div style={styles.detailSection}>
                    <h4 style={styles.detailSectionTitle}>📊 Nutritional Information</h4>
                    <div style={styles.nutritionGrid}>
                      <div style={styles.nutritionItem}>
                        <span style={styles.nutritionLabel}>Calories</span>
                        <span style={styles.nutritionValue}>{editingRecipe.nutritionalInfo.calories}</span>
                      </div>
                      <div style={styles.nutritionItem}>
                        <span style={styles.nutritionLabel}>Protein</span>
                        <span style={styles.nutritionValue}>{editingRecipe.nutritionalInfo.protein}</span>
                      </div>
                      <div style={styles.nutritionItem}>
                        <span style={styles.nutritionLabel}>Fat</span>
                        <span style={styles.nutritionValue}>{editingRecipe.nutritionalInfo.fat}</span>
                      </div>
                      <div style={styles.nutritionItem}>
                        <span style={styles.nutritionLabel}>Carbs</span>
                        <span style={styles.nutritionValue}>{editingRecipe.nutritionalInfo.carbs}</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.detailSection}>
                    <h4 style={styles.detailSectionTitle}>⏱️ Cooking Info</h4>
                    <div style={styles.infoGrid}>
                      <div style={styles.infoItem}>
                        <Clock size={16} />
                        <span>{editingRecipe.cookingTime} minutes</span>
                      </div>
                      <div style={styles.infoItem}>
                        <Users size={16} />
                        <span>{editingRecipe.servings} servings</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}>🥕 Ingredients</h4>
                  <ul style={styles.ingredientsDetailList}>
                    {editingRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} style={styles.ingredientDetailItem}>
                        <span style={styles.ingredientName}>{ingredient.name}</span>
                        <span style={styles.ingredientAmount}>{ingredient.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}>👨‍🍳 Instructions</h4>
                  <ol style={styles.instructionsList}>
                    {editingRecipe.instructions.map((instruction, index) => (
                      <li key={index} style={styles.instructionItem}>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Edit/Create Recipe Form */}
          {viewMode === 'edit' && editingRecipe && (
            <div style={styles.editContainer}>
              <div style={styles.editHeader}>
                <h3 style={styles.editTitle}>
                  {editingRecipe.id > 1000 ? 'Edit Recipe' : 'Create New Recipe'}
                </h3>
                <button 
                  onClick={() => setViewMode('saved')}
                  style={styles.secondaryButton}
                >
                  Cancel
                </button>
              </div>

              <div style={styles.editForm}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Recipe Name</label>
                    <input
                      type="text"
                      value={editingRecipe.name}
                      onChange={(e) => setEditingRecipe(prev => ({ ...prev, name: e.target.value }))}
                      style={styles.input}
                      placeholder="Enter recipe name"
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea
                      value={editingRecipe.description}
                      onChange={(e) => setEditingRecipe(prev => ({ ...prev, description: e.target.value }))}
                      style={styles.textarea}
                      placeholder="Describe your recipe"
                      rows="3"
                    />
                  </div>
                </div>

                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Cooking Time (minutes)</label>
                    <input
                      type="number"
                      value={editingRecipe.cookingTime}
                      onChange={(e) => setEditingRecipe(prev => ({ ...prev, cookingTime: e.target.value }))}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Servings</label>
                    <input
                      type="text"
                      value={editingRecipe.servings}
                      onChange={(e) => setEditingRecipe(prev => ({ ...prev, servings: e.target.value }))}
                      style={styles.input}
                      placeholder="e.g., 2-3 meals"
                    />
                  </div>
                </div>

                <div style={styles.formSection}>
                  <h4 style={styles.sectionTitle}>Ingredients</h4>
                  {editingRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} style={styles.ingredientRow}>
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => {
                          const newIngredients = [...editingRecipe.ingredients];
                          newIngredients[index].name = e.target.value;
                          setEditingRecipe(prev => ({ ...prev, ingredients: newIngredients }));
                        }}
                        style={styles.ingredientInput}
                        placeholder="Ingredient name"
                      />
                      <input
                        type="text"
                        value={ingredient.amount}
                        onChange={(e) => {
                          const newIngredients = [...editingRecipe.ingredients];
                          newIngredients[index].amount = e.target.value;
                          setEditingRecipe(prev => ({ ...prev, ingredients: newIngredients }));
                        }}
                        style={styles.amountInput}
                        placeholder="Amount"
                      />
                      <button
                        onClick={() => {
                          const newIngredients = editingRecipe.ingredients.filter((_, i) => i !== index);
                          setEditingRecipe(prev => ({ ...prev, ingredients: newIngredients }));
                        }}
                        style={styles.removeButton}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setEditingRecipe(prev => ({
                      ...prev,
                      ingredients: [...prev.ingredients, { name: '', amount: '' }]
                    }))}
                    style={styles.addButton}
                  >
                    <Plus size={14} />
                    Add Ingredient
                  </button>
                </div>

                <div style={styles.formActions}>
                  <button 
                    onClick={() => updateRecipe(editingRecipe)}
                    style={styles.primaryButton}
                  >
                    {editingRecipe.id > 1000 ? 'Update Recipe' : 'Save Recipe'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline CSS Styles
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f8fafc'
  },
  modalTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#1f2937'
  },
  modalTitleText: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '6px',
    color: '#6b7280',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    flex: 1,
    overflow: 'auto',
    padding: '1.5rem'
  },
  tabContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.5rem'
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    color: '#6b7280',
    transition: 'all 0.2s ease'
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  petBanner: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    border: '1px solid #bfdbfe'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '500',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    background: 'white'
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.75rem'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  checkboxInput: {
    marginRight: '0.5rem'
  },
  checkmark: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    flex: 1,
    transition: 'all 0.2s ease'
  },
  conditionEmoji: {
    fontSize: '1.125rem'
  },
  ingredientEmoji: {
    fontSize: '1.125rem'
  },
  generateButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    fontSize: '0.875rem'
  },
  loadingButton: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  resultsTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  resultsActions: {
    display: 'flex',
    gap: '0.75rem'
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease'
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease'
  },
  dangerButton: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease'
  },
  recipesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  recipeCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    backgroundColor: 'white'
  },
  recipeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb'
  },
  recipeIcon: {
    fontSize: '2rem'
  },
  saveButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '4px',
    color: '#6b7280',
    transition: 'all 0.2s ease'
  },
  recipeContent: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  recipeName: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  recipeDescription: {
    margin: 0,
    color: '#6b7280',
    fontSize: '0.875rem',
    lineHeight: '1.4'
  },
  recipeMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  ingredientsPreview: {
    fontSize: '0.875rem'
  },
  ingredientsList: {
    margin: '0.5rem 0 0 0',
    paddingLeft: '1rem',
    color: '#6b7280'
  },
  ingredientItem: {
    marginBottom: '0.25rem'
  },
  moreItem: {
    fontStyle: 'italic',
    color: '#9ca3af'
  },
  recipeActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  savedContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  savedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  savedTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  createButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 2rem',
    color: '#6b7280'
  },
  emptyIcon: {
    color: '#d1d5db',
    marginBottom: '1rem'
  },
  emptyTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#374151'
  },
  emptyText: {
    margin: '0 0 1.5rem 0',
    fontSize: '0.875rem'
  },
  savedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem'
  },
  savedRecipeCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '1rem',
    transition: 'all 0.2s ease',
    backgroundColor: 'white'
  },
  savedRecipeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  savedRecipeIcon: {
    fontSize: '1.5rem'
  },
  savedRecipeActions: {
    display: 'flex',
    gap: '0.25rem'
  },
  smallActionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '4px',
    color: '#6b7280',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  savedRecipeContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  savedRecipeName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  savedRecipeDescription: {
    margin: 0,
    color: '#6b7280',
    fontSize: '0.75rem',
    lineHeight: '1.4'
  },
  savedRecipeMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: '#9ca3af'
  },
  savedMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem'
  },
  detailActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  detailContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  detailHero: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  detailIcon: {
    fontSize: '3rem'
  },
  detailTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937'
  },
  detailDescription: {
    margin: 0,
    color: '#6b7280',
    fontSize: '1rem',
    lineHeight: '1.5'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem'
  },
  detailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  detailSectionTitle: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  nutritionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem'
  },
  nutritionItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #e5e7eb'
  },
  nutritionLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  nutritionValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    marginTop: '0.25rem'
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    color: '#374151',
    fontSize: '0.875rem'
  },
  ingredientsDetailList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  ingredientDetailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #e5e7eb'
  },
  ingredientName: {
    fontWeight: '500',
    color: '#1f2937'
  },
  ingredientAmount: {
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  instructionsList: {
    margin: 0,
    paddingLeft: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  instructionItem: {
    color: '#374151',
    lineHeight: '1.5',
    paddingLeft: '0.5rem'
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  editHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  editTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  ingredientRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  ingredientInput: {
    flex: 2,
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '0.875rem'
  },
  amountInput: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '0.875rem'
  },
  removeButton: {
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButton: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px dashed #d1d5db',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  }
};

export default RecipeGeneratorModal;