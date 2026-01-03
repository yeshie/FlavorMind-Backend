// src/middleware/auth.js
const ApiResponse = require('../utils/response');

/**
 * Authentication Middleware (Placeholder)
 * Will be implemented with Firebase in Phase 3
 */
exports.protect = async (req, res, next) => {
  try {
    // TODO: Implement Firebase authentication
    // For now, we'll just pass through
    
    // Mock user for testing
    req.user = {
      uid: 'test-user-123',
      email: 'test@flavormind.com',
      name: 'Test User',
    };

    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Authentication required');
  }
};

/**
 * Optional Authentication
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    // TODO: Implement optional Firebase auth
    req.user = null;
    next();
  } catch (error) {
    next();
  }
};

/**
 * Admin Authorization (Placeholder)
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return ApiResponse.forbidden(res, 'Admin access required');
  }
  next();
};