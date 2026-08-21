const mongoose = require('mongoose');
const { ALLOWED_POINTS, COMPANY_VALUES } = require('./kudos.constants');

const kudosSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, immutable: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, immutable: true },
    points: { type: Number, enum: ALLOWED_POINTS, required: true, immutable: true },
    message: { type: String, required: true, trim: true, minlength: 3, maxlength: 500 },
    companyValue: { type: String, enum: COMPANY_VALUES, required: true, immutable: true },
  },
  { timestamps: true, versionKey: false }
);

kudosSchema.index({ createdAt: -1, _id: -1 });
kudosSchema.index({ receiver: 1, createdAt: -1 });
kudosSchema.index({ sender: 1, createdAt: -1 });

module.exports = mongoose.model('Kudos', kudosSchema);
