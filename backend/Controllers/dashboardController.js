const EnvironmentalGoal = require('../Models/EnvironmentalGoal');
const EmployeeParticipation = require('../Models/EmployeeParticipation');
const ComplianceIssue = require('../Models/ComplianceIssue');
const User = require('../Models/User');
const CarbonTransaction = require('../Models/CarbonTransaction');

// @route  GET /api/dashboard
// @access Private (any logged-in user)
const getDashboard = async (req, res) => {
  try {
    // ---------- ENVIRONMENTAL SCORE ----------
    // Per goal: 100 if currentCO2 is at/under target, decreasing the further over target it is.
    // Average across all goals. Defaults to 100 if no goals exist yet (nothing to be penalized for).
    const goals = await EnvironmentalGoal.find();
    let environmentalScore = 100;
    if (goals.length > 0) {
      const goalScores = goals.map((g) => {
        if (g.targetCO2 <= 0) return 100;
        if (g.currentCO2 <= g.targetCO2) return 100;
        const overBy = (g.currentCO2 - g.targetCO2) / g.targetCO2;
        return Math.max(0, 100 - overBy * 100);
      });
      environmentalScore = Math.round(goalScores.reduce((a, b) => a + b, 0) / goalScores.length);
    }

    // ---------- SOCIAL SCORE ----------
    // % of submitted CSR participations that were approved (proxy for genuine, verified engagement).
    // Defaults to 100 if nobody has submitted anything yet.
    const totalParticipations = await EmployeeParticipation.countDocuments();
    const approvedParticipations = await EmployeeParticipation.countDocuments({ status: 'APPROVED' });
    const socialScore =
      totalParticipations === 0 ? 100 : Math.round((approvedParticipations / totalParticipations) * 100);

    // ---------- GOVERNANCE SCORE ----------
    // % of compliance issues that have been resolved. Defaults to 100 if no issues have ever been raised.
    const totalIssues = await ComplianceIssue.countDocuments();
    const resolvedIssues = await ComplianceIssue.countDocuments({ status: 'RESOLVED' });
    const governanceScore = totalIssues === 0 ? 100 : Math.round((resolvedIssues / totalIssues) * 100);

    // ---------- OVERALL ----------
    const overallScore = Math.round((environmentalScore + socialScore + governanceScore) / 3);

    // ---------- QUICK STATS ----------
    const totalEmployees = await User.countDocuments();
    const totalCarbonLogged = await CarbonTransaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amountCO2' } } },
    ]);

    res.status(200).json({
      success: true,
      scores: {
        environmental: environmentalScore,
        social: socialScore,
        governance: governanceScore,
        overall: overallScore,
      },
      stats: {
        totalEmployees,
        totalGoals: goals.length,
        totalCarbonCO2: totalCarbonLogged[0]?.total || 0,
        pendingApprovals: await EmployeeParticipation.countDocuments({ status: 'PENDING' }),
        openComplianceIssues: totalIssues - resolvedIssues,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboard };
