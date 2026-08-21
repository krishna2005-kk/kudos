const monthlyResetService = require('./monthlyReset.service');
const asyncHandler = require('../../shared/utils/asyncHandler');

const runMonthlyReset = asyncHandler(async (req, res) => {
  const data = await monthlyResetService.runMonthlyReset({
    month: req.validated.body.month,
    triggeredBy: req.user._id,
  });
  const statusCode = data.status === 'already_completed' ? 200 : 201;
  res.status(statusCode).json({ success: true, message: `Monthly reset ${data.status.replace('_', ' ')}`, data });
});

module.exports = { runMonthlyReset };
