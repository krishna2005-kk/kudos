const express = require('express');
const { protect, authorize } = require('../auth/auth.middleware');
const validate = require('../../shared/middleware/validate');
const { runResetSchema } = require('./monthlyReset.validation');
const monthlyResetController = require('./monthlyReset.controller');

const router = express.Router();

router.post('/monthly-resets', protect, authorize('admin'), validate(runResetSchema), monthlyResetController.runMonthlyReset);

module.exports = router;
