const mongoose = require('mongoose');

const csrActivitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    evidenceRequired: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CSRActivity', csrActivitySchema);