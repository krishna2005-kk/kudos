const User = require('../users/user.model');
const AppError = require('../../shared/errors/AppError');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { verifyAccessToken } = require('./auth.tokens');

const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AppError('Access token is required', 401);
  }

  let payload;
  try {
    payload = verifyAccessToken(authorization.slice(7));
  } catch {
    throw new AppError('Invalid or expired access token', 401);
  }

  if (payload.type !== 'access') throw new AppError('Invalid access token', 401);
  const user = await User.findById(payload.sub).select('+givingAllowance');
  if (!user || user.changedPasswordAfter(payload.iat)) throw new AppError('Access token is no longer valid', 401);

  req.user = user;
  next();
});

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError('You do not have permission to perform this action', 403));
    return next();
  };
}

module.exports = { protect, authorize };
