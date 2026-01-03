// src/controllers/cookbookController.js
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

/**
 * @desc    Get user's saved recipes
 * @route   GET /api/v1/cookbook
 * @access  Private
 */
exports.getSavedRecipes = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    // TODO: Fetch from database
    const mockSavedRecipes = [
      {
        id: '1',
        title: 'Saved Chicken Curry',
        category: 'lunch',
        savedAt: new Date().toISOString(),
      },
    ];

    return ApiResponse.success(res, {
      recipes: mockSavedRecipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 1,
      },
    });
  } catch (error) {
    logger.error('Get saved recipes error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * @desc    Save recipe to cookbook
 * @route   POST /api/v1/cookbook/:recipeId
 * @access  Private
 */
exports.saveRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { category } = req.body;

    // TODO: Save to database
    logger.info(`Recipe ${recipeId} saved to cookbook`);

    return ApiResponse.success(res, {
      recipeId,
      category: category || 'uncategorized',
      savedAt: new Date().toISOString(),
    }, 'Recipe saved to cookbook');
  } catch (error) {
    logger.error('Save recipe error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * @desc    Remove recipe from cookbook
 * @route   DELETE /api/v1/cookbook/:recipeId
 * @access  Private
 */
exports.removeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    // TODO: Remove from database

    return ApiResponse.success(res, null, 'Recipe removed from cookbook');
  } catch (error) {
    logger.error('Remove recipe error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};

/**
 * @desc    Organize cookbook (create/update categories)
 * @route   PUT /api/v1/cookbook/organize
 * @access  Private
 */
exports.organizeCookbook = async (req, res) => {
  try {
    const { categories } = req.body;

    // TODO: Update user's cookbook organization

    return ApiResponse.success(res, { categories }, 'Cookbook organized successfully');
  } catch (error) {
    logger.error('Organize cookbook error:', error);
    return ApiResponse.serverError(res, error.message);
  }
};