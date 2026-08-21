const crypto = require('crypto');
const User = require('../users/user.model');
const Session = require('./session.model');
const AppError = require('../../shared/errors/AppError');
const { hashToken, createAccessToken, createRefreshToken, verifyRefreshToken } = require('./auth.tokens');
const config = require('../../config/env');
const { OAuth2Client } = require('google-auth-library');

function publicUser(user) {
  const { _id, name, email, avatar, department, role, givingAllowance, earnedPoints, isEmailVerified, createdAt } = user;
  return {
    id: _id.toString(), name, email, avatar, department, role, givingAllowance, earnedPoints, isEmailVerified, createdAt,
  };
}

async function createSessionTokens(userId) {
  const tokenId = crypto.randomUUID();
  const refreshToken = createRefreshToken(userId, tokenId);
  const expiresAt = new Date(Date.now() + config.refreshTokenDays * 24 * 60 * 60 * 1000);

  await Session.create({ user: userId, tokenHash: hashToken(refreshToken), expiresAt });
  return { accessToken: createAccessToken(userId), refreshToken };
}

async function signup(input) {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) throw new AppError('An account with this email already exists', 409);

  const user = await User.create(input);
  const tokens = await createSessionTokens(user._id);
  return { user: publicUser(user), ...tokens };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password +givingAllowance');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokens = await createSessionTokens(user._id);
  return { user: publicUser(user), ...tokens };
}

async function googleLogin(credential) {
  if (!config.googleClientId) throw new AppError('Google sign-in is not configured on the server', 503);

  const client = new OAuth2Client(config.googleClientId);
  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: config.googleClientId });
    payload = ticket.getPayload();
  } catch {
    throw new AppError('Google credential is invalid or expired', 401);
  }

  if (!payload.email || !payload.email_verified) throw new AppError('Your Google email address must be verified', 401);
  const user = await User.findOne({ email: payload.email.toLowerCase() }).select('+givingAllowance');
  if (!user) throw new AppError('No Kudos account exists for this Google email. Please sign up first.', 404);

  const tokens = await createSessionTokens(user._id);
  return { user: publicUser(user), ...tokens };
}

async function refresh(refreshToken) {
  if (!refreshToken) throw new AppError('Refresh token is required', 401);

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  if (payload.type !== 'refresh') throw new AppError('Invalid refresh token', 401);

  const revoked = await Session.updateOne(
    { tokenHash: hashToken(refreshToken), user: payload.sub, revokedAt: null, expiresAt: { $gt: new Date() } },
    { $set: { revokedAt: new Date() } }
  );
  if (revoked.modifiedCount !== 1) throw new AppError('Refresh token is no longer valid', 401);

  const user = await User.findById(payload.sub).select('+givingAllowance');
  if (!user) throw new AppError('User not found', 401);

  const tokens = await createSessionTokens(user._id);
  return { user: publicUser(user), ...tokens };
}

async function logout(refreshToken) {
  if (refreshToken) await Session.updateOne({ tokenHash: hashToken(refreshToken), revokedAt: null }, { $set: { revokedAt: new Date() } });
}

async function verifyEmail(userId) {
  const user = await User.findByIdAndUpdate(userId, { isEmailVerified: true }, { new: true });
  if (!user) throw new AppError('User not found', 404);
  return publicUser(user);
}

async function requestPasswordReset(email) {
  const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires');
  if (!user) return null;

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = hashToken(resetToken);
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateBeforeSave: false });
  return resetToken;
}

async function resetPassword({ token, password }) {
  const user = await User.findOne({
    passwordResetToken: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) throw new AppError('Password reset token is invalid or has expired', 400);

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  await Session.updateMany({ user: user._id, revokedAt: null }, { $set: { revokedAt: new Date() } });

  const tokens = await createSessionTokens(user._id);
  return { user: publicUser(user), ...tokens };
}

module.exports = {
  signup, login, googleLogin, refresh, logout, verifyEmail, requestPasswordReset, resetPassword, publicUser,
};
