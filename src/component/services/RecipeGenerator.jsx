// components/services/RecipeGenerator.jsx - Personalized Pet Food Recipes
import React, { useState, useEffect } from 'react';
import { serviceAPI } from "../../services/serviceAPI";
import "../../styles/Services.css";

// Icons
import { ChefHat, Heart, Clock, Users, Bookmark, Share2 } from 'lucide-react';

const RecipeGenerator = () => {
  const [criteria, setCriteria] = useState({
    petType: 'dog',
    weight: '',
    age: '',
    healthConditions: [],
    ingredients: [],
    cookingTime: 'any',
    difficulty: 'easy'
  });
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const petTypes = [
    { value: 'dog', label: '🐕 Dog', icon: '🐕' },
    { value: 'cat', label: '🐈 Cat', icon: '🐈' },
    { value: 'rabbit', label: '🐇 Rabbit', icon: '🐇' },
    { value: 'bird', label: '🐦 Bird', icon: '🐦' }
  ];

  const healthConditions = [
    { value: 'weight_loss', label: 'Weight Loss', icon: '⚖️' },
    { value: 'allergies', label: 'Food Allergies', icon: '🚫' },
    { value: 'sensitive_stomach', label: 'Sensitive Stomach', icon: '🤢' },
    { value: 'joint_health', label: 'Joint Health', icon: '🦴' },
    { value: 'skin_issues', label: 'Skin Issues', icon: '🌟' },
    { value: 'senior', label: 'Senior Pet', icon: '👴' }
  ];

  const ingredients = [
    { value: 'chicken', label: 'Chicken', icon: '🍗' },
    { value: 'beef', label: 'Beef', icon: '🥩' },
    { value: 'fish', label: 'Fish', icon: '🐟' },
    { value: 'rice', label: 'Rice', icon: '🍚' },
    { value: 'sweet_potato', label: 'Sweet Potato', icon: '🍠' },
    { value: 'carrots', label: 'Carrots', icon: '🥕' },
    { value: 'peas', label: 'Peas', icon: '🟢' },
    { value: 'eggs', label: 'Eggs', icon: '🥚' }
  ];

  const sampleRecipes = [
    {
      id: 1,
      name: "Chicken & Rice Delight",
      description: "Gentle on stomach, perfect for sensitive pups",
      petType: 'dog',
      cookingTime: 30,
      difficulty: 'easy',
      ingredients: [
        { name: "Chicken Breast", amount: "200g", note: "Cooked and shredded" },
        { name: "Brown Rice", amount: "1 cup", note: "Cooked" },
        { name: "Carrots", amount: "1/2 cup", note: "Steamed and mashed" },
        { name: "Peas", amount: "1/4 cup", note: "Steamed" }
      ],
      instructions: [
        "Cook chicken thoroughly and shred into small pieces",
        "Prepare brown rice according to package instructions",
        "Steam carrots and peas until soft",
        "Mix all ingredients together in a large bowl",
        "Let cool before serving to your pet"
      ],
      nutrition: {
        calories: "350 kcal",
        protein: "25g",
        carbs: "45g",
        fat: "8g"
      },
      suitableFor: ['sensitive_stomach', 'weight_loss'],
      rating: 4.8,
      prepTime: "15 mins",
      cookTime: "15 mins",
      servings: "3-4 meals",
      image: "🍗"
    },
    {
      id: 2,
      name: "Fish Feline Feast",
      description: "Omega-rich recipe for shiny coats",
      petType: 'cat',
      cookingTime: 20,
      difficulty: 'easy',
      ingredients: [
        { name: "Salmon", amount: "150g", note: "Baked or steamed" },
        { name: "Pumpkin", amount: "1/4 cup", note: "Pureed" },
        { name: "Quinoa", amount: "1/2 cup", note: "Cooked" },
        { name: "Fish Oil", amount: "1 tsp", note: "Optional" }
      ],
      instructions: [
        "Cook salmon until flaky",
        "Steam pumpkin until soft and puree",
        "Cook quinoa according to package",
        "Flake salmon and mix with pumpkin and quinoa",
        "Add fish oil and mix well"
      ],
      nutrition: {
        calories: "280 kcal",
        protein: "22g",
        carbs: "20g",
        fat: "12g"
      },
      suitableFor: ['skin_issues', 'joint_health'],
      rating: 4.9,
      prepTime: "10 mins",
      cookTime: "10 mins",
      servings: "2-3 meals",
      image: "🐟"
    }
  ];

  const generateRecipes = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setRecipes(sampleRecipes.filter(recipe => 
        recipe.petType === criteria.petType
      ));
    } catch (error) {
      console.error('Recipe generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveRecipe = (recipe) => {
    setSavedRecipes(prev => {
      const exists = prev.find(r => r.id === recipe.id);
      if (exists) return prev;
      return [...prev, recipe];
    });
  };

  const shareRecipe = (recipe) => {
    navigator.clipboard.writeText(`Check out this pet recipe: ${recipe.name}`);
    alert('Recipe link copied to clipboard! 📋');
  };

  return (
    <div className="service-page recipe-generator">
      <div className="service-header">
        <div className="header-icon">
          <ChefHat size={32} />
        </div>
        <h1>Pet Food Recipe Generator</h1>
        <p>Create delicious, healthy meals for your furry friend! 🍖</p>
      </div>

      <div className="recipe-container">
        {/* Criteria Form */}
        <div className="criteria-section">
          <form onSubmit={generateRecipes} className="criteria-form">
            <div className="form-grid">
              {/* Pet Type */}
              <div className="form-group">
                <label>
                  <Heart size={16} />
                  Pet Type
                </label>
                <div className="pet-type-selector">
                  {petTypes.map(pet => (
                    <button
                      key={pet.value}
                      type="button"
                      className={`pet-type-btn ${criteria.petType === pet.value ? 'active' : ''}`}
                      onClick={() => setCriteria(prev => ({ ...prev, petType: pet.value }))}
                    >
                      <span className="pet-emoji">{pet.icon}</span>
                      {pet.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight and Age */}
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={criteria.weight}
                  onChange={(e) => setCriteria(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="e.g., 12.5"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label>Age (years)</label>
                <input
                  type="number"
                  value={criteria.age}
                  onChange={(e) => setCriteria(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="e.g., 3"
                  min="0"
                />
              </div>

              {/* Health Conditions */}
              <div className="form-group full-width">
                <label>Special Dietary Needs</label>
                <div className="condition-grid">
                  {healthConditions.map(condition => (
                    <label key={condition.value} className="condition-checkbox">
                      <input
                        type="checkbox"
                        checked={criteria.healthConditions.includes(condition.value)}
                        onChange={(e) => {
                          const newConditions = e.target.checked
                            ? [...criteria.healthConditions, condition.value]
                            : criteria.healthConditions.filter(c => c !== condition.value);
                          setCriteria(prev => ({ ...prev, healthConditions: newConditions }));
                        }}
                      />
                      <span className="checkmark">
                        <span className="condition-emoji">{condition.icon}</span>
                        {condition.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferred Ingredients */}
              <div className="form-group full-width">
                <label>Preferred Ingredients</label>
                <div className="ingredient-grid">
                  {ingredients.map(ingredient => (
                    <label key={ingredient.value} className="ingredient-checkbox">
                      <input
                        type="checkbox"
                        checked={criteria.ingredients.includes(ingredient.value)}
                        onChange={(e) => {
                          const newIngredients = e.target.checked
                            ? [...criteria.ingredients, ingredient.value]
                            : criteria.ingredients.filter(i => i !== ingredient.value);
                          setCriteria(prev => ({ ...prev, ingredients: newIngredients }));
                        }}
                      />
                      <span className="checkmark">
                        <span className="ingredient-emoji">{ingredient.icon}</span>
                        {ingredient.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="generate-btn"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="spinner"></div>
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
        </div>

        {/* Recipes Results */}
        {recipes.length > 0 && (
          <div className="recipes-results">
            <h3>Recommended Recipes ({recipes.length})</h3>
            <div className="recipes-grid">
              {recipes.map(recipe => (
                <div key={recipe.id} className="recipe-card">
                  <div className="recipe-header">
                    <div className="recipe-image">{recipe.image}</div>
                    <div className="recipe-actions">
                      <button 
                        onClick={() => saveRecipe(recipe)}
                        className="icon-btn"
                        title="Save recipe"
                      >
                        <Bookmark size={16} />
                      </button>
                      <button 
                        onClick={() => shareRecipe(recipe)}
                        className="icon-btn"
                        title="Share recipe"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="recipe-content">
                    <h4 className="recipe-name">{recipe.name}</h4>
                    <p className="recipe-description">{recipe.description}</p>

                    <div className="recipe-meta">
                      <span className="meta-item">
                        <Clock size={14} />
                        {recipe.cookingTime} mins
                      </span>
                      <span className="meta-item">
                        <Users size={14} />
                        {recipe.servings}
                      </span>
                      <span className="meta-item rating">
                        ⭐ {recipe.rating}
                      </span>
                    </div>

                    <div className="recipe-details">
                      <div className="detail-section">
                        <h5>Ingredients</h5>
                        <ul className="ingredients-list">
                          {recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx}>
                              <strong>{ingredient.name}:</strong> {ingredient.amount}
                              {ingredient.note && <small> ({ingredient.note})</small>}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="detail-section">
                        <h5>Instructions</h5>
                        <ol className="instructions-list">
                          {recipe.instructions.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="nutrition-facts">
                        <h5>Nutrition (per serving)</h5>
                        <div className="nutrition-grid">
                          <span>Calories: {recipe.nutrition.calories}</span>
                          <span>Protein: {recipe.nutrition.protein}</span>
                          <span>Carbs: {recipe.nutrition.carbs}</span>
                          <span>Fat: {recipe.nutrition.fat}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Recipes */}
        {savedRecipes.length > 0 && (
          <div className="saved-recipes">
            <h4>Your Saved Recipes ({savedRecipes.length})</h4>
            <div className="saved-recipes-grid">
              {savedRecipes.map(recipe => (
                <div key={recipe.id} className="saved-recipe-card">
                  <span className="saved-emoji">{recipe.image}</span>
                  <span className="saved-name">{recipe.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeGenerator;