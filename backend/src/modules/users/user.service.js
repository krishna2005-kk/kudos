const AppError = require('../../shared/errors/AppError');
const userRepository = require('./user.repository');

async function getUserById(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
}

async function listUsers(query) {
  const [users, total] = await userRepository.findPublicUsers(query);
  return {
    users,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

async function updateMyProfile(userId, updates) {
  const user = await userRepository.updateProfile(userId, updates);
  if (!user) throw new AppError('User not found', 404);
  return user;
}

async function updateUserAdminFields(userId, updates) {
  const user = await userRepository.updateAdminFields(userId, updates);
  if (!user) throw new AppError('User not found', 404);
  return user;
}

async function listAdminUsers(query) {
  return userRepository.findAdminUsers(query);
}

async function addPoints(userId, input) {
  const target = await userRepository.findById(userId);
  if (!target) throw new AppError('User not found', 404);
  if (target.role !== 'employee') throw new AppError('Points can only be awarded to employees', 400);
  const user = await userRepository.adjustPoints(userId, 'earnedPoints', input.amount);
  if (!user) throw new AppError('User not found', 404);
  return user;
}

module.exports = { getUserById, listUsers, updateMyProfile, updateUserAdminFields, listAdminUsers, addPoints };
