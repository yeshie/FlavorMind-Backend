// server.js
require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`
╔═════════════════════════════════════════════════════════════════════╗
║                                                                     ║
║                  🍲 FlavorMind Backend API 🍲                       ║
║            AI-Powered Culinary Assistant Platform                  ║
║                                                                     ║
║   Server Status: ✅ RUNNING                                         ║
║   Port: ${PORT}                                                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                       ║
║   API Version: ${process.env.API_VERSION || 'v1'}                                             ║
║                                                                     ║
║   📡 http://localhost:${PORT}                                         ║
║   📊 Status: http://localhost:${PORT}/api/status                      ║
║   ❤️  Health: http://localhost:${PORT}/health                         ║
║                                                                     ║
║   🚀 Core Features:                                                 ║
║      ✅ Recipe Management                                           ║
║      ✅ Digital Cookbook                                            ║
║      ✅ Feedback System                                             ║
║      ✅ Dynamic Scaling                                             ║
║      ⏳ Memory-Based Generation (Phase 4)                          ║
║      ⏳ AI Integration (Phase 4)                                    ║
║      ⏳ Firebase Integration (Phase 3)                              ║
║                                                                     ║
╚═════════════════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('❌ Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('👋 SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('✅ HTTP server closed');
    process.exit(0);
  });
});