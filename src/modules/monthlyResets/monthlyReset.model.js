const mongoose = require('mongoose');

const monthlyResetSchema = new mongoose.Schema(
  {
    month: { type: String, required: true, unique: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ },
    status: { type: String, enum: ['running', 'completed', 'failed'], required: true },
    usersReset: { type: Number, default: 0 },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, default: null },
    lockExpiresAt: { type: Date, required: true },
    errorMessage: { type: String, default: null },
    triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('MonthlyReset', monthlyResetSchema);
