const mongoose = require('mongoose');

const complianceIssueSchema = new mongoose.Schema(
  {
    audit: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit', required: true },
    issue: { type: String, required: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
    status: { type: String, enum: ['OPEN', 'RESOLVED'], default: 'OPEN' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ComplianceIssue', complianceIssueSchema);
