// src/middleware/validation.js
const { body, param, query, validationResult } = require('express-validator');
const ApiResponse = require('../utils/response');

/**
 * Handle validation errors
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));
    return ApiResponse.validationError(res, formattedErrors);
  }
  next();
};

/**
 * Recipe Creation Validation
 */
exports.recipeValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Recipe title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),
  
  body('instructions')
    .isArray({ min: 1 })
    .withMessage('At least one instruction step is required'),
  
  body('prepTime')
    .isInt({ min: 0 })
    .withMessage('Prep time must be a positive number'),
  
  body('cookTime')
    .isInt({ min: 0 })
    .withMessage('Cook time must be a positive number'),
  
  body('servings')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Servings must be between 1 and 20'),
  
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  
  body('cuisine')
    .trim()
    .notEmpty()
    .withMessage('Cuisine type is required'),
  
  body('category')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage'])
    .withMessage('Invalid category'),
];

/**
 * Memory Description Validation
 */
exports.memoryValidation = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Memory description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('isVoiceInput')
    .optional()
    .isBoolean()
    .withMessage('isVoiceInput must be a boolean'),
];

/**
 * Feedback Validation
 */
exports.feedbackValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
];

/**
 * Scaling Validation
 */
exports.scalingValidation = [
  body('servings')
    .isInt({ min: 1, max: 20 })
    .withMessage('Servings must be between 1 and 20'),
];

/**
 * Pagination Validation
 */
exports.paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];