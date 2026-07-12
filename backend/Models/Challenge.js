const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    xp: { type: Number, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'ARCHIVED'],
      default: 'DRAFT',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Challenge', challengeSchema);