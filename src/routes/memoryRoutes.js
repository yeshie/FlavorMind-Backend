// src/routes/memoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  createMemory,
  getMemories,
  getMemory,
  deleteMemory,
} = require('../controllers/memoryController');
const { protect } = require('../middleware/auth');
const {
  memoryValidation,
  paginationValidation,
  validate,
} = require('../middleware/validation');

// All memory routes require authentication
router.use(protect);

router.post('/', memoryValidation, validate, createMemory);
router.get('/', paginationValidation, validate, getMemories);
router.get('/:id', getMemory);
router.delete('/:id', deleteMemory);

module.exports = router;