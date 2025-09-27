const express = require('express');
const { param } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  downloadPRDMarkdown,
  downloadPRDPDF,
  downloadPlanMarkdown,
  downloadPlanPDF,
  downloadProjectZIP
} = require('../controllers/exportController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation
const projectIdValidation = [
  param('id').isMongoId().withMessage('Invalid project ID')
];

// Export routes
router.get('/:id/prd/markdown', projectIdValidation, downloadPRDMarkdown);
router.get('/:id/prd/pdf', projectIdValidation, downloadPRDPDF);
router.get('/:id/plan/markdown', projectIdValidation, downloadPlanMarkdown);
router.get('/:id/plan/pdf', projectIdValidation, downloadPlanPDF);
router.get('/:id/complete', projectIdValidation, downloadProjectZIP);

module.exports = router;