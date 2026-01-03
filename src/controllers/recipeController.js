// src/controllers/recipeController.js
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

/**
 * @desc    Get all recipes
 * @route   GET /api/v1/recipes
 * @access  Public
 */
exports.getRecipes = async (req, res) => {
  try {
    const { page = 1, limit = 10, cuisine, category, difficulty } = req.query;

    // TODO: Fetch from database
    // For now, return mock data
    const mockRecipes = [
      {
        id: '1',
        title: 'Sri Lankan Chicken Curry',
        description: 'Traditional spicy chicken curry with coconut milk',
        cuisine: 'Sri Lankan',
        category: 'lunch',
        difficulty: 'medium',
        prepTime: 20,
        cookTime: 40,
        servings: 4,
        isLocal: true,
      },
      {
        id: '2',
        title: 'Hoppers (Appa)',
        description: 'Bowl-shaped pancakes made from fermented rice flour',
        cuisine: 'Sri Lankan',
        category: 'breakfast',
        difficulty: 'medium',
        prepTime: 30,
        cookTime: 15,
        servings: 6,
        isLocal: true,
      },
    ];

    return ApiResponse.success(res, {
      recipes: mockRecipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: mockRecipes.length,
        pages: 1,
      },
    });
  } catch (error) {
    logger.error('Get recipes error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * @desc    Get single recipe
 * @route   GET /api/v1/recipes/:id
 * @access  Public
 */
exports.getRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Fetch from database
    const mockRecipe = {
      id: id,
      title: 'Sri Lankan Chicken Curry',
      description: 'Traditional spicy chicken curry with coconut milk',
      cuisine: 'Sri Lankan',
      category: 'lunch',
      difficulty: 'medium',
      prepTime: 20,
      cookTime: 40,
      servings: 4,
      ingredients: [
        { name: 'Chicken', quantity: '500g', unit: 'g', isLocal: true },
        { name: 'Coconut milk', quantity: '400ml', unit: 'ml', isLocal: true },
        { name: 'Curry powder', quantity: '2 tbsp', unit: 'tbsp', isLocal: true },
      ],
      instructions: [
        { step: 1, description: 'Marinate chicken with curry powder', duration: 10 },
        { step: 2, description: 'Cook chicken until golden', duration: 15 },
        { step: 3, description: 'Add coconut milk and simmer', duration: 25 },
      ],
      author: 'test-user-123',
      createdAt: new Date().toISOString(),
    };

    return ApiResponse.success(res, { recipe: mockRecipe });
  } catch (error) {
    logger.error('Get recipe error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * @desc    Create new recipe
 * @route   POST /api/v1/recipes
 * @access  Private
 */
exports.createRecipe = async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      author: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      views: 0,
    };

    // TODO: Save to database
    logger.info('Recipe created:', recipeData.title);

    return ApiResponse.created(res, { recipe: recipeData }, 'Recipe created successfully');
  } catch (error) {
    logger.error('Create recipe error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * @desc    Update recipe
 * @route   PUT /api/v1/recipes/:id
 * @access  Private
 */
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Check if recipe exists and user is owner
    // TODO: Update in database

    const updatedRecipe = {
      id,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    return ApiResponse.success(res, { recipe: updatedRecipe }, 'Recipe updated successfully');
  } catch (error) {
    logger.error('Update recipe error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * @desc    Delete recipe
 * @route   DELETE /api/v1/recipes/:id
 * @access  Private
 */
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Check if recipe exists and user is owner
    // TODO: Delete from database

    return ApiResponse.success(res, null, 'Recipe deleted successfully');
  } catch (error) {
    logger.error('Delete recipe error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * @desc    Scale recipe
 * @route   POST /api/v1/recipes/:id/scale
 * @access  Public
 */
exports.scaleRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { servings } = req.body;

    // TODO: Fetch recipe from database
    // TODO: Implement scaling algorithm

    const scaledRecipe = {
      id,
      originalServings: 4,
      newServings: servings,
      scaleFactor: servings / 4,
      message: 'Recipe scaled successfully',
    };

    return ApiResponse.success(res, scaledRecipe);
  } catch (error) {
    logger.error('Scale recipe error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * @desc    Search recipes
 * @route   GET /api/v1/recipes/search
 * @access  Public
 */
exports.searchRecipes = async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query) {
      return ApiResponse.badRequest(res, 'Search query is required');
    }

    // TODO: Implement search with FAISS/vector similarity

    return ApiResponse.success(res, { 
      query,
      recipes: [],
      message: 'Search functionality will be implemented with AI integration',
    });
  } catch (error) {
    logger.error('Search recipes error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};