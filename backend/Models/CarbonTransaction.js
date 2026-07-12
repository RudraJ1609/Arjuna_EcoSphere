const mongoose = require('mongoose');

const carbonTransactionSchema = new mongoose.Schema(
  {
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emissionFactor: { type: mongoose.Schema.Types.ObjectId, ref: 'EmissionFactor' },
    source: { type: String, required: true }, // e.g. "Fleet", "Manufacturing", "Purchase"
    amountCO2: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CarbonTransaction', carbonTransactionSchema);
