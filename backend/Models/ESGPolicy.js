const mongoose = require('mongoose');

const esgPolicySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    // employees who accepted this policy - avoids a separate collection for a simple join table
    acknowledgements: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        acknowledgedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ESGPolicy', esgPolicySchema);