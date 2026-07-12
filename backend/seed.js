// Run with: node seed.js
// Populates departments, users (all 4 roles), goals, carbon logs, CSR activities +
// participations (mix of approved/pending), challenges + completions, and compliance issues
// so the dashboard shows real, non-trivial numbers for the demo.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Department = require('./Models/Department');
const User = require('./Models/User');
const EnvironmentalGoal = require('./Models/EnvironmentalGoal');
const CarbonTransaction = require('./Models/CarbonTransaction');
const CSRActivity = require('./Models/CSRActivity');
const EmployeeParticipation = require('./Models/EmployeeParticipation');
const Challenge = require('./Models/Challenge');
const ChallengeParticipation = require('./Models/ChallengeParticipation');
const Audit = require('./Models/Audit');
const ComplianceIssue = require('./Models/ComplianceIssue');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding...');

  // wipe existing demo data so this can be re-run safely
  await Promise.all([
    Department.deleteMany({}),
    User.deleteMany({}),
    EnvironmentalGoal.deleteMany({}),
    CarbonTransaction.deleteMany({}),
    CSRActivity.deleteMany({}),
    EmployeeParticipation.deleteMany({}),
    Challenge.deleteMany({}),
    ChallengeParticipation.deleteMany({}),
    Audit.deleteMany({}),
    ComplianceIssue.deleteMany({}),
  ]);

  // ---------- DEPARTMENTS ----------
  const [manufacturing, logistics, corporate] = await Department.create([
    { name: 'Manufacturing', code: 'MFG', head: 'S. Nair' },
    { name: 'Logistics', code: 'LOG', head: 'R. Iyer' },
    { name: 'Corporate', code: 'COR', head: 'A. Mehta' },
  ]);

  // ---------- USERS (password for all: password123) ----------
  const hashedPassword = await bcrypt.hash('password123', 10);
  const [admin, manager, auditor, emp1, emp2, emp3] = await User.create([
    { name: 'Admin User', email: 'admin@ecosphere.com', password: hashedPassword, role: 'ADMIN', department: corporate._id },
    { name: 'Manager User', email: 'manager@ecosphere.com', password: hashedPassword, role: 'MANAGER', department: manufacturing._id },
    { name: 'Auditor User', email: 'auditor@ecosphere.com', password: hashedPassword, role: 'AUDITOR', department: corporate._id },
    { name: 'Aditi Rao', email: 'aditi@ecosphere.com', password: hashedPassword, role: 'EMPLOYEE', department: manufacturing._id },
    { name: 'Karan Shah', email: 'karan@ecosphere.com', password: hashedPassword, role: 'EMPLOYEE', department: logistics._id },
    { name: 'Priya Nair', email: 'priya@ecosphere.com', password: hashedPassword, role: 'EMPLOYEE', department: manufacturing._id },
  ]);

  // ---------- ENVIRONMENTAL ----------
  await EnvironmentalGoal.create([
    { name: 'Reduce Fleet Emissions', department: logistics._id, targetCO2: 500, currentCO2: 390, deadline: new Date('2026-12-31'), status: 'ON_TRACK' },
    { name: 'Cut Packaging Waste', department: manufacturing._id, targetCO2: 120, currentCO2: 98, deadline: new Date('2026-09-30'), status: 'ON_TRACK' },
    { name: 'Office Energy Cut', department: corporate._id, targetCO2: 80, currentCO2: 92, deadline: new Date('2026-06-30'), status: 'ACTIVE' }, // slightly over target on purpose
  ]);

  await CarbonTransaction.create([
    { department: manufacturing._id, employee: emp1._id, source: 'Manufacturing', amountCO2: 45.2 },
    { department: logistics._id, employee: emp2._id, source: 'Fleet', amountCO2: 120.5 },
    { department: manufacturing._id, employee: emp3._id, source: 'Purchase', amountCO2: 15.8 },
  ]);

  // ---------- SOCIAL ----------
  const [treePlantation, bloodDonation, beachCleanup] = await CSRActivity.create([
    { title: 'Tree Plantation', description: 'Plant trees around the campus', evidenceRequired: true, isOpen: true },
    { title: 'Blood Donation', description: 'Quarterly blood donation drive', evidenceRequired: true, isOpen: true },
    { title: 'Beach Cleanup', description: 'Community beach cleanup', evidenceRequired: false, isOpen: true },
  ]);

  await EmployeeParticipation.create([
    { employee: emp1._id, activity: treePlantation._id, status: 'APPROVED', points: 50, approvedBy: manager._id },
    { employee: emp2._id, activity: bloodDonation._id, status: 'APPROVED', points: 30, approvedBy: manager._id },
    { employee: emp3._id, activity: beachCleanup._id, status: 'PENDING' }, // left pending on purpose - shows approval queue working
  ]);
  // manually award XP for the approved ones (mirrors what the approve endpoint does)
  await User.findByIdAndUpdate(emp1._id, { $inc: { xpPoints: 50 } });
  await User.findByIdAndUpdate(emp2._id, { $inc: { xpPoints: 30 } });

  // ---------- GAMIFICATION ----------
  const [sprintChallenge, recycleChallenge] = await Challenge.create([
    { title: 'Sustainability Sprint', xp: 200, difficulty: 'Hard', deadline: new Date('2026-07-20'), status: 'ACTIVE' },
    { title: 'Recycle Challenge', xp: 80, difficulty: 'Easy', deadline: new Date('2026-07-15'), status: 'ACTIVE' },
  ]);

  await ChallengeParticipation.create([
    { employee: emp1._id, challenge: sprintChallenge._id, completed: true },
    { employee: emp2._id, challenge: recycleChallenge._id, completed: false }, // joined but not completed
  ]);
  await User.findByIdAndUpdate(emp1._id, { $inc: { xpPoints: 200 } });

  // ---------- GOVERNANCE ----------
  const audit1 = await Audit.create({
    title: 'Q2 Waste Audit',
    department: manufacturing._id,
    auditor: auditor._id,
    findings: '3 minor issues found',
    status: 'COMPLETED',
  });

  await ComplianceIssue.create([
    { audit: audit1._id, issue: 'Missing MSDS sheets', severity: 'HIGH', status: 'OPEN', department: manufacturing._id },
    { audit: audit1._id, issue: 'Late vendor disclosure', severity: 'MEDIUM', status: 'RESOLVED', department: logistics._id },
  ]);

  console.log('Seed complete.');
  console.log('Login with any of these (password: password123):');
  console.log('  admin@ecosphere.com   (ADMIN)');
  console.log('  manager@ecosphere.com (MANAGER)');
  console.log('  auditor@ecosphere.com (AUDITOR)');
  console.log('  aditi@ecosphere.com   (EMPLOYEE, 250 XP)');
  console.log('  karan@ecosphere.com   (EMPLOYEE, 30 XP)');
  console.log('  priya@ecosphere.com   (EMPLOYEE, 0 XP, pending CSR approval)');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});