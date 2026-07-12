const mongoose = require('mongoose');

const employeeParticipationSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activity: { type: mongoose.Schema.Types.ObjectId, ref: 'CSRActivity', required: true },
    proofUrl: { type: String },
    points: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// prevent the same employee joining the same activity twice
employeeParticipationSchema.index({ employee: 1, activity: 1 }, { unique: true });

module.exports = mongoose.model('EmployeeParticipation', employeeParticipationSchema);
