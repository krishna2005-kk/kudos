const User = require('../users/user.model');
const MonthlyReset = require('./monthlyReset.model');
const { getMonthRange } = require('../../shared/utils/month');
const AppError = require('../../shared/errors/AppError');

const LOCK_DURATION_MS = 15 * 60 * 1000;

async function claimReset(month, triggeredBy) {
  const now = new Date();
  const lockExpiresAt = new Date(now.getTime() + LOCK_DURATION_MS);
  try {
    return { reset: await MonthlyReset.create({ month, status: 'running', startedAt: now, lockExpiresAt, triggeredBy }), alreadyCompleted: false };
  } catch (error) {
    if (error.code !== 11000) throw error;
  }

  const existing = await MonthlyReset.findOne({ month });
  if (existing.status === 'completed') return { reset: null, alreadyCompleted: true };

  const reclaimed = await MonthlyReset.findOneAndUpdate(
    { _id: existing._id, status: { $in: ['failed', 'running'] }, lockExpiresAt: { $lt: now } },
    { $set: { status: 'running', startedAt: now, lockExpiresAt, completedAt: null, errorMessage: null, triggeredBy } },
    { new: true }
  );
  return { reset: reclaimed, alreadyCompleted: false };
}

async function runMonthlyReset({ month, triggeredBy = null } = {}) {
  const { selected } = getMonthRange(month);
  const claim = await claimReset(selected, triggeredBy);
  if (claim.alreadyCompleted) return { month: selected, status: 'already_completed', usersReset: 0 };
  const { reset } = claim;
  if (!reset) throw new AppError('Monthly reset is already running', 409);
  if (reset.status !== 'running') throw new AppError('Monthly reset is already running', 409);

  try {
    const result = await User.updateMany({}, { $set: { givingAllowance: 100 } });
    reset.status = 'completed';
    reset.usersReset = result.modifiedCount;
    reset.completedAt = new Date();
    reset.lockExpiresAt = new Date();
    await reset.save();
    return { month: selected, status: 'completed', usersReset: result.modifiedCount };
  } catch (error) {
    reset.status = 'failed';
    reset.errorMessage = error.message.slice(0, 500);
    reset.lockExpiresAt = new Date();
    await reset.save();
    throw error;
  }
}

module.exports = { runMonthlyReset };
