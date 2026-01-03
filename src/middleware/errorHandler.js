// src/middleware/errorHandler.js
const logger = require('../utils/logger');
const ApiResponse = require('../utils/response');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Error caught:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    return ApiResponse.validationError(res, errors);
  }

  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Invalid authentication token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Authentication token expired');
  }

  if (err.code === 11000) {
    // Duplicate key error (will use with database)
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.badRequest(res, `${field} already exists`);
  }

  // Default to 500 server error
  return ApiResponse.serverError(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  );
};

/**
 * 404 Not Found Handler
 */
const notFound = (req, res, next) => {
  return ApiResponse.notFound(res, `Route ${req.originalUrl} not found`);
};

module.exports = {
  errorHandler,
  notFound,
};