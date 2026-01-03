// test-app.js - Quick test to verify app structure
require('dotenv').config();

console.log('Testing app structure...\n');

try {
  console.log('1. Loading logger...');
  const logger = require('./src/utils/logger');
  console.log('   ✅ Logger loaded\n');

  console.log('2. Loading response utility...');
  const ApiResponse = require('./src/utils/response');
  console.log('   ✅ Response utility loaded\n');

  console.log('3. Loading middleware...');
  const errorHandler = require('./src/middleware/errorHandler');
  const validation = require('./src/middleware/validation');
  const auth = require('./src/middleware/auth');
  console.log('   ✅ Middleware loaded\n');

  console.log('4. Loading controllers...');
  const recipeController = require('./src/controllers/recipeController');
  const memoryController = require('./src/controllers/memoryController');
  const cookbookController = require('./src/controllers/cookbookController');
  const feedbackController = require('./src/controllers/feedbackController');
  console.log('   ✅ Controllers loaded\n');

  console.log('5. Loading routes...');
  const recipeRoutes = require('./src/routes/recipeRoutes');
  const memoryRoutes = require('./src/routes/memoryRoutes');
  const cookbookRoutes = require('./src/routes/cookbookRoutes');
  const feedbackRoutes = require('./src/routes/feedbackRoutes');
  console.log('   ✅ Routes loaded\n');

  console.log('6. Loading Express app...');
  const app = require('./src/app');
  console.log('   ✅ Express app loaded');
  console.log('   App type:', typeof app);
  console.log('   Has listen?', typeof app.listen === 'function');
  
  console.log('\n✅ All components loaded successfully!\n');
  console.log('You can now run: npm run dev');
  
} catch (error) {
  console.error('\n❌ Error loading components:');
  console.error(error.message);
  console.error('\nStack trace:');
  console.error(error.stack);
  process.exit(1);
}