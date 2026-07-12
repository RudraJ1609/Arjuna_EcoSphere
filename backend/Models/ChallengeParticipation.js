const mongoose = require('mongoose');

const challengeParticipationSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    completed: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// prevent the same employee joining the same challenge twice
challengeParticipationSchema.index({ employee: 1, challenge: 1 }, { unique: true });

module.exports = mongoose.model('ChallengeParticipation', challengeParticipationSchema);
