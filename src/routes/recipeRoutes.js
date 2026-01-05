// src/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  scaleRecipe,
  searchRecipes,
} = require('../controllers/recipeController');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  recipeValidation,
  scalingValidation,
  paginationValidation,
  validate,
} = require('../middleware/validation');

// Public routes
router.get('/', paginationValidation, validate, getRecipes);
router.get('/search', validate, searchRecipes);
router.get('/:id', getRecipe);
router.post('/:id/scale', scalingValidation, validate, scaleRecipe);

// Protected routes (require authentication)
router.post('/', protect, recipeValidation, validate, createRecipe);
router.put('/:id', protect, recipeValidation, validate, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;