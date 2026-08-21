const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { DEPARTMENTS, ROLES } = require('./user.constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must have at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must have at least 8 characters'],
      select: false,
    },
    avatar: { type: String, trim: true, default: null },
    department: { type: String, enum: DEPARTMENTS, required: true },
    role: { type: String, enum: ROLES, default: 'employee' },
    givingAllowance: { type: Number, default: 100, min: 0, select: false },
    earnedPoints: { type: Number, default: 0, min: 0 },
    isEmailVerified: { type: Boolean, default: false },
    passwordChangedAt: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ department: 1, name: 1 });

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.passwordChangedAt = new Date();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function changedPasswordAfter(jwtIssuedAt) {
  if (!this.passwordChangedAt) return false;
  return jwtIssuedAt < Math.floor(this.passwordChangedAt.getTime() / 1000);
};

module.exports = mongoose.model('User', userSchema);
