const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    costXP: { type: Number, required: true },
    stock: { type: Number, default: null }, // null = unlimited
    // redemption requests - embedded since always accessed via the reward
    redemptions: [
      {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
          type: String,
          enum: ['PENDING', 'APPROVED', 'REJECTED'],
          default: 'PENDING',
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reward', rewardSchema);
