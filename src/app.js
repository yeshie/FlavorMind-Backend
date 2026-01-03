// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Create Express app
const app = express();

// Import routes
const recipeRoutes = require('./routes/recipeRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const cookbookRoutes = require('./routes/cookbookRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CLIENT_URL?.split(',') || [];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Compression
app.use(compression());

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'FlavorMind API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API status
app.get('/api/status', (req, res) => {
  res.json({
    name: 'FlavorMind API',
    version: process.env.API_VERSION || 'v1',
    status: 'active',
    features: {
      memoryBasedGeneration: 'pending_ai_integration',
      localIngredientAdaptation: 'pending_ai_integration',
      dynamicScaling: 'active',
      digitalCookbook: 'active',
      feedbackSystem: 'active',
      smartRecommendations: 'pending_ai_integration',
    },
    database: 'pending_firebase_integration',
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🍲 Welcome to FlavorMind API',
    description: 'AI-Powered Culinary Assistant for Memory-Based and Locally Adaptive Personalized Cooking',
    version: process.env.API_VERSION || 'v1',
    endpoints: {
      health: '/health',
      status: '/api/status',
      recipes: '/api/v1/recipes',
      memories: '/api/v1/memories',
      cookbook: '/api/v1/cookbook',
      feedback: '/api/v1/feedback',
    },
  });
});

console.log('recipes:', typeof recipeRoutes, recipeRoutes);
console.log('memories:', typeof memoryRoutes, memoryRoutes);
console.log('cookbook:', typeof cookbookRoutes, cookbookRoutes);
console.log('feedback:', typeof feedbackRoutes, feedbackRoutes);

app.use(`${apiVersion}/recipes`, recipeRoutes);
app.use(`${apiVersion}/memories`, memoryRoutes);
app.use(`${apiVersion}/cookbook`, cookbookRoutes);
app.use(`${apiVersion}/feedback`, feedbackRoutes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;