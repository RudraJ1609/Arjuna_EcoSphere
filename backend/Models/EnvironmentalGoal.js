const mongoose = require('mongoose');

const environmentalGoalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    targetCO2: { type: Number, required: true },
    currentCO2: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'ON_TRACK', 'COMPLETED', 'MISSED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EnvironmentalGoal', environmentalGoalSchema);
