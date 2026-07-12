const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // store hashed, never plain text
    role: {
      type: String,
      enum: ['ADMIN', 'MANAGER', 'EMPLOYEE', 'AUDITOR'],
      default: 'EMPLOYEE',
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    xpPoints: { type: Number, default: 0 },
    profileImage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
