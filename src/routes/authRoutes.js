// src/routes/authRoutes.js - Complete Authentication Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  googleAuth,
  appleAuth,
  sendOTP,
  verifyOTP,
  forgotPassword,
  verifyEmail,
  logout,
  getCurrentUser,
} = require('../controllers/authController');

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const otpValidation = [
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(\+94|0)[0-9]{9}$/)
    .withMessage('Please provide a valid Sri Lankan phone number'),
];

const verifyOTPValidation = [
  ...otpValidation,
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),
];

const emailValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
];

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/google', body('idToken').notEmpty(), validate, googleAuth);
router.post('/apple', body('idToken').notEmpty(), validate, appleAuth);
router.post('/send-otp', otpValidation, validate, sendOTP);
router.post('/verify-otp', verifyOTPValidation, validate, verifyOTP);
router.post('/forgot-password', emailValidation, validate, forgotPassword);

// Protected routes
router.post('/verify-email', protect, emailValidation, validate, verifyEmail);
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentUser);

// Test route
router.get('/ping', (req, res) => {
  res.json({ 
    message: 'Auth routes working',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;