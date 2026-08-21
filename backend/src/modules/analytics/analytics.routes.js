const express = require('express');
const { protect, authorize } = require('../auth/auth.middleware');
const validate = require('../../shared/middleware/validate');
const { monthQuerySchema } = require('./analytics.validation');
const analyticsController = require('./analytics.controller');

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/overview', validate(monthQuerySchema), analyticsController.getOverview);
router.get('/departments', validate(monthQuerySchema), analyticsController.getDepartments);
router.get('/company-values', validate(monthQuerySchema), analyticsController.getCompanyValues);

module.exports = router;
