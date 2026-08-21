const analyticsService = require('./analytics.service');
const asyncHandler = require('../../shared/utils/asyncHandler');

const getOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOverview(req.validated.query.month);
  res.status(200).json({ success: true, message: 'Analytics overview retrieved', data });
});

const getDepartments = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDepartmentAnalytics(req.validated.query.month);
  res.status(200).json({ success: true, message: 'Department analytics retrieved', data });
});

const getCompanyValues = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCompanyValueAnalytics(req.validated.query.month);
  res.status(200).json({ success: true, message: 'Company-value analytics retrieved', data });
});

module.exports = { getOverview, getDepartments, getCompanyValues };
