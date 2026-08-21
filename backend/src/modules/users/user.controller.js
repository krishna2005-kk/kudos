const userService = require('./user.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { publicUser } = require('../auth/auth.service');

const listUsers = asyncHandler(async (req, res) => {
  const data = await userService.listUsers(req.validated.query);
  res.status(200).json({ success: true, message: 'Users retrieved', data });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.validated.params.id);
  res.status(200).json({ success: true, message: 'User retrieved', data: { user } });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Profile retrieved', data: { user: publicUser(req.user) } });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMyProfile(req.user._id, req.validated.body);
  res.status(200).json({ success: true, message: 'Profile updated', data: { user } });
});

const adminUpdateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUserAdminFields(req.validated.params.id, req.validated.body);
  res.status(200).json({ success: true, message: 'User updated', data: { user } });
});

const adminListUsers = asyncHandler(async (req, res) => {
  const users = await userService.listAdminUsers(req.validated.query);
  res.status(200).json({ success: true, message: 'Admin users retrieved', data: { users } });
});

const addPoints = asyncHandler(async (req, res) => {
  const user = await userService.addPoints(req.validated.params.id, req.validated.body);
  res.status(200).json({ success: true, message: 'Points added successfully', data: { user } });
});

module.exports = { listUsers, getUser, getMe, updateMe, adminUpdateUser, adminListUsers, addPoints };
