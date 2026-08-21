const authService = require('./auth.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const config = require('../../config/env');

const refreshCookieOptions = {
  httpOnly: true,
  secure: config.env === 'production',
  sameSite: 'lax',
  path: '/api/v1/auth',
  maxAge: config.refreshTokenDays * 24 * 60 * 60 * 1000,
};

function sendAuthResponse(res, statusCode, message, result) {
  res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
  res.status(statusCode).json({
    success: true,
    message,
    data: { user: result.user, accessToken: result.accessToken },
  });
}

const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.validated.body);
  sendAuthResponse(res, 201, 'Account created', result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body);
  sendAuthResponse(res, 200, 'Logged in', result);
});

const googleLogin = asyncHandler(async (req, res) => {
  const result = await authService.googleLogin(req.validated.body.credential);
  sendAuthResponse(res, 200, 'Logged in with Google', result);
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.cookies.refreshToken);
  sendAuthResponse(res, 200, 'Token refreshed', result);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies.refreshToken);
  res.clearCookie('refreshToken', refreshCookieOptions);
  res.status(200).json({ success: true, message: 'Logged out', data: null });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.user._id);
  res.status(200).json({ success: true, message: 'Email verified', data: { user } });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const resetToken = await authService.requestPasswordReset(req.validated.body.email);
  const data = config.env === 'production' || !resetToken ? null : { resetToken };
  res.status(200).json({
    success: true,
    message: 'If an account exists for this email, password reset instructions have been sent',
    data,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.validated.body);
  sendAuthResponse(res, 200, 'Password reset successfully', result);
});

module.exports = { signup, login, googleLogin, refresh, logout, verifyEmail, forgotPassword, resetPassword };
