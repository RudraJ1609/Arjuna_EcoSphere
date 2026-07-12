const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    auditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    findings: { type: String },
    status: {
      type: String,
      enum: ['PLANNED', 'UNDER_REVIEW', 'COMPLETED'],
      default: 'PLANNED',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Audit', auditSchema);
