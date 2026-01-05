// src/middleware/auth.js
const { auth, db } = require('../config/firebase');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Authentication Middleware - Verify Firebase ID Token
 */
exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'No token provided');
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return ApiResponse.unauthorized(res, 'User not found');
    }

    // Attach user to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...userDoc.data(),
    };

    next();

  } catch (error) {
    logger.error('Auth middleware error:', error);

    if (error.code === 'auth/id-token-expired') {
      return ApiResponse.unauthorized(res, 'Token expired. Please login again.');
    }
    if (error.code === 'auth/argument-error') {
      return ApiResponse.unauthorized(res, 'Invalid token format');
    }

    return ApiResponse.unauthorized(res, 'Authentication failed');
  }
};

/**
 * Optional Authentication - Don't fail if no token
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (userDoc.exists) {
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        ...userDoc.data(),
      };
    } else {
      req.user = null;
    }

    next();

  } catch (error) {
    req.user = null;
    next();
  }
};

/**
 * Check if profile is complete
 */
exports.requireCompleteProfile = async (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Authentication required');
  }

  if (!req.user.isProfileComplete) {
    return ApiResponse.forbidden(res, 'Please complete your profile first');
  }

  next();
};

/**
 * Admin Authorization
 */
exports.isAdmin = async (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, 'Authentication required');
  }

  if (req.user.role !== 'admin') {
    return ApiResponse.forbidden(res, 'Admin access required');
  }

  next();
};