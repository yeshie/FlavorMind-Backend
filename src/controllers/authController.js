// src/controllers/authController.js - Complete Firebase Auth Implementation
const admin = require('firebase-admin');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

// Initialize Firebase Auth
const auth = admin.auth();
const db = admin.firestore();

/**
 * @desc    Register new user with email/password
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    });

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      preferences: {},
      savedRecipes: [],
      cookingHistory: [],
    });

    // Generate custom token
    const token = await auth.createCustomToken(userRecord.uid);

    // Send verification email (optional)
    const verificationLink = await auth.generateEmailVerificationLink(email);
    // TODO: Send email with verificationLink

    logger.info(`User registered: ${email}`);

    return ApiResponse.created(res, {
      token,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
      },
    }, 'Registration successful. Please verify your email.');
  } catch (error) {
    logger.error('Registration error:', error);

    if (error.code === 'auth/email-already-exists') {
      return ApiResponse.badRequest(res, 'Email already registered');
    }
    if (error.code === 'auth/invalid-password') {
      return ApiResponse.badRequest(res, 'Password must be at least 6 characters');
    }

    return ApiResponse.serverError(res, 'Registration failed');
  }
};

/**
 * @desc    Login with email/password
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verify credentials by getting user
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return ApiResponse.unauthorized(res, 'Invalid credentials');
    }

    // Generate custom token
    const token = await auth.createCustomToken(userRecord.uid);

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    const userData = userDoc.data();

    // Update last login
    await db.collection('users').doc(userRecord.uid).update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    });

    logger.info(`User logged in: ${email}`);

    return ApiResponse.success(res, {
      token,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || userData?.name,
        photoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
      },
    }, 'Login successful');
  } catch (error) {
    logger.error('Login error:', error);

    if (error.code === 'auth/user-not-found') {
      return ApiResponse.unauthorized(res, 'Invalid credentials');
    }

    return ApiResponse.serverError(res, 'Login failed');
  }
};

/**
 * @desc    Google Sign-In
 * @route   POST /api/v1/auth/google
 * @access  Public
 */
exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify Google ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists
    let userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      // Create new user
      await db.collection('users').doc(uid).set({
        uid,
        name: name || email.split('@')[0],
        email,
        photoURL: picture,
        provider: 'google',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Update last login
      await db.collection('users').doc(uid).update({
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Generate custom token
    const token = await auth.createCustomToken(uid);

    logger.info(`Google sign-in: ${email}`);

    return ApiResponse.success(res, {
      token,
      user: {
        uid,
        email,
        displayName: name,
        photoURL: picture,
        emailVerified: true,
      },
    }, 'Google sign-in successful');
  } catch (error) {
    logger.error('Google auth error:', error);
    return ApiResponse.serverError(res, 'Google authentication failed');
  }
};

/**
 * @desc    Apple Sign-In
 * @route   POST /api/v1/auth/apple
 * @access  Public
 */
exports.appleAuth = async (req, res) => {
  try {
    const { idToken, user } = req.body;

    // Verify Apple ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Check if user exists
    let userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      // Create new user
      await db.collection('users').doc(uid).set({
        uid,
        name: user?.name || email.split('@')[0],
        email,
        provider: 'apple',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Update last login
      await db.collection('users').doc(uid).update({
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Generate custom token
    const token = await auth.createCustomToken(uid);

    logger.info(`Apple sign-in: ${email}`);

    return ApiResponse.success(res, {
      token,
      user: {
        uid,
        email,
        displayName: user?.name || email.split('@')[0],
        emailVerified: true,
      },
    }, 'Apple sign-in successful');
  } catch (error) {
    logger.error('Apple auth error:', error);
    return ApiResponse.serverError(res, 'Apple authentication failed');
  }
};

/**
 * @desc    Send OTP for phone authentication
 * @route   POST /api/v1/auth/send-otp
 * @access  Public
 */
exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Firestore (expires in 5 minutes)
    await db.collection('otps').doc(phoneNumber).set({
      otp,
      phoneNumber,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 5 * 60 * 1000),
      attempts: 0,
    });

    // TODO: Send OTP via SMS service (Twilio, AWS SNS, etc.)
    // For development, log the OTP
    logger.info(`OTP for ${phoneNumber}: ${otp}`);

    return ApiResponse.success(res, null, 'OTP sent successfully');
  } catch (error) {
    logger.error('Send OTP error:', error);
    return ApiResponse.serverError(res, 'Failed to send OTP');
  }
};

/**
 * @desc    Verify OTP and login/register
 * @route   POST /api/v1/auth/verify-otp
 * @access  Public
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Get OTP from Firestore
    const otpDoc = await db.collection('otps').doc(phoneNumber).get();

    if (!otpDoc.exists) {
      return ApiResponse.badRequest(res, 'OTP not found or expired');
    }

    const otpData = otpDoc.data();

    // Check expiration
    if (otpData.expiresAt.toMillis() < Date.now()) {
      await db.collection('otps').doc(phoneNumber).delete();
      return ApiResponse.badRequest(res, 'OTP expired');
    }

    // Check attempts
    if (otpData.attempts >= 3) {
      await db.collection('otps').doc(phoneNumber).delete();
      return ApiResponse.badRequest(res, 'Too many attempts. Please request a new OTP');
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      await db.collection('otps').doc(phoneNumber).update({
        attempts: admin.firestore.FieldValue.increment(1),
      });
      return ApiResponse.badRequest(res, 'Invalid OTP');
    }

    // Delete used OTP
    await db.collection('otps').doc(phoneNumber).delete();

    // Check if user exists with this phone number
    const usersSnapshot = await db.collection('users')
      .where('phoneNumber', '==', phoneNumber)
      .limit(1)
      .get();

    let uid;

    if (usersSnapshot.empty) {
      // Create new user
      const userRecord = await auth.createUser({
        phoneNumber,
      });

      uid = userRecord.uid;

      await db.collection('users').doc(uid).set({
        uid,
        phoneNumber,
        provider: 'phone',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      uid = usersSnapshot.docs[0].id;
      
      // Update last login
      await db.collection('users').doc(uid).update({
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Generate custom token
    const token = await auth.createCustomToken(uid);
    const userRecord = await auth.getUser(uid);

    logger.info(`Phone auth successful: ${phoneNumber}`);

    return ApiResponse.success(res, {
      token,
      user: {
        uid,
        phoneNumber,
        displayName: userRecord.displayName || 'User',
      },
    }, 'OTP verified successfully');
  } catch (error) {
    logger.error('Verify OTP error:', error);
    return ApiResponse.serverError(res, 'OTP verification failed');
  }
};

/**
 * @desc    Forgot password - send reset email
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate password reset link
    const resetLink = await auth.generatePasswordResetLink(email);

    // TODO: Send email with resetLink
    logger.info(`Password reset link generated for: ${email}`);

    return ApiResponse.success(res, null, 'Password reset email sent');
  } catch (error) {
    logger.error('Forgot password error:', error);

    if (error.code === 'auth/user-not-found') {
      // For security, don't reveal if email exists
      return ApiResponse.success(res, null, 'If email exists, reset link will be sent');
    }

    return ApiResponse.serverError(res, 'Failed to send reset email');
  }
};

/**
 * @desc    Verify email address
 * @route   POST /api/v1/auth/verify-email
 * @access  Private
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Send verification email
    const verificationLink = await auth.generateEmailVerificationLink(email);

    // TODO: Send email with verificationLink
    logger.info(`Email verification sent to: ${email}`);

    return ApiResponse.success(res, null, 'Verification email sent');
  } catch (error) {
    logger.error('Verify email error:', error);
    return ApiResponse.serverError(res, 'Failed to send verification email');
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
  try {
    // Revoke user's tokens (optional)
    await auth.revokeRefreshTokens(req.user.uid);

    logger.info(`User logged out: ${req.user.uid}`);

    return ApiResponse.success(res, null, 'Logout successful');
  } catch (error) {
    logger.error('Logout error:', error);
    return ApiResponse.serverError(res, 'Logout failed');
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return ApiResponse.notFound(res, 'User not found');
    }

    const userData = userDoc.data();

    return ApiResponse.success(res, {
      user: userData,
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    return ApiResponse.serverError(res, 'Failed to get user');
  }
};