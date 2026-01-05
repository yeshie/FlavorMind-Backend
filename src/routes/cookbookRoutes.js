// src/routes/cookbookRoutes.js
const express = require('express');
const router = express.Router();
const {
  getSavedRecipes,
  saveRecipe,
  removeRecipe,
  organizeCookbook,
} = require('../controllers/cookbookController');
const { protect } = require('../middleware/auth');
const {
  paginationValidation,
  validate,
} = require('../middleware/validation');

// All cookbook routes require authentication
router.use(protect);

router.get('/', paginationValidation, validate, getSavedRecipes);
router.post('/:recipeId', saveRecipe);
router.delete('/:recipeId', removeRecipe);
router.put('/organize', organizeCookbook);

module.exports = router;