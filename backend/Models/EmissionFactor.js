const mongoose = require('mongoose');

const emissionFactorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Diesel", "Electricity (grid)"
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    unit: { type: String, required: true }, // e.g. "litre", "kWh"
    co2PerUnit: { type: Number, required: true }, // kg CO2 per unit
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmissionFactor', emissionFactorSchema);
