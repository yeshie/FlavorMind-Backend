// src/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const {
  submitRecipeFeedback,
  getRecipeFeedback,
  updateFeedback,
  deleteFeedback,
} = require('../controllers/feedbackController');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  feedbackValidation,
  paginationValidation,
  validate,
} = require('../middleware/validation');

// Public routes
router.get('/recipes/:recipeId', paginationValidation, validate, getRecipeFeedback);

// Protected routes
router.post('/recipes/:recipeId', protect, feedbackValidation, validate, submitRecipeFeedback);
router.put('/:feedbackId', protect, feedbackValidation, validate, updateFeedback);
router.delete('/:feedbackId', protect, deleteFeedback);

module.exports = router;