const User = require('./user.model');

function findById(userId) {
  return User.findById(userId);
}

function findPublicUsers({ department, search, page, limit }) {
  const filter = { role: 'employee' };
  if (department) filter.department = department;
  if (search) filter.name = { $regex: search, $options: 'i' };

  return Promise.all([
    User.find(filter)
      .select('name email avatar department role earnedPoints isEmailVerified createdAt')
      .sort({ name: 1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);
}

function updateProfile(userId, updates) {
  return User.findByIdAndUpdate(userId, { $set: updates }, { returnDocument: 'after', runValidators: true });
}

function updateAdminFields(userId, updates) {
  return User.findByIdAndUpdate(userId, { $set: updates }, { returnDocument: 'after', runValidators: true });
}

function findAdminUsers({ department, search }) {
  const filter = {};
  if (department) filter.department = department;
  if (search) filter.name = { $regex: search, $options: 'i' };
  return User.find(filter)
    .select('name email avatar department role earnedPoints givingAllowance isEmailVerified createdAt')
    .sort({ name: 1, _id: 1 })
    .lean();
}

function adjustPoints(userId, field, amount) {
  return User.findByIdAndUpdate(
    userId,
    { $inc: { [field]: amount } },
    { returnDocument: 'after', runValidators: true }
  ).select('name email department role earnedPoints givingAllowance');
}

module.exports = { findById, findPublicUsers, updateProfile, updateAdminFields, findAdminUsers, adjustPoints };
