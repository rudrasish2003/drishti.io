const express = require('express');
const { body, param } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createProject,
  getUserProjects,
  getProject,
  updateProject,
  deleteProject,
  generatePRD,
  generateImplementationPlan
} = require('../controllers/projectController');

const router = express.Router();

// All routes require authentication eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGQ4MTQ0MDNlMTVkOGQxN2UzOGViNTMiLCJpYXQiOjE3NTg5OTIxNzMsImV4cCI6MTc1OTU5Njk3M30.oS_VgNqhWkBFooB_Ln99bzRz-HaoIHtXIGHsbig0STw
router.use(authenticateToken);

// Validation rules 
const projectValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be under 200 characters'),
  
  body('idea')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Idea must be between 10-2000 characters')
];

const projectIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID')
];

// Routes
router.post('/', projectValidation, createProject);
router.get('/', getUserProjects);
router.get('/:id', projectIdValidation, getProject);
router.put('/:id', [...projectIdValidation, ...projectValidation], updateProject);
router.delete('/:id', projectIdValidation, deleteProject);
router.post('/:id/generate-prd', projectIdValidation, generatePRD);
router.post('/:id/generate-plan', projectIdValidation, generateImplementationPlan);

module.exports = router;