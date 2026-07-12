const EmployeeParticipation = require('../Models/EmployeeParticipation');
const User = require('../Models/User');

// @route  POST /api/csr-activities/:activityId/join
// @access Private (Employee)
const joinActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const employeeId = req.user.id;

    const existing = await EmployeeParticipation.findOne({ employee: employeeId, activity: activityId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already joined this activity' });
    }

    const participation = await EmployeeParticipation.create({
      employee: employeeId,
      activity: activityId,
      proofUrl: req.body.proofUrl || null,
    });

    res.status(201).json({ success: true, participation });
  } catch (err) {
    // catches the unique index violation too, in case of a race condition
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Already joined this activity' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/csr-activities/participation/pending   (Manager/Admin - approval queue)
const getPendingParticipations = async (req, res) => {
  try {
    const pending = await EmployeeParticipation.find({ status: 'PENDING' })
      .populate('employee', 'name email')
      .populate('activity', 'title');
    res.status(200).json({ success: true, pending });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PATCH /api/csr-activities/participation/:id/approve   (Manager/Admin)
// @body   { points: number }
const approveParticipation = async (req, res) => {
  try {
    const { points } = req.body;
    const participation = await EmployeeParticipation.findById(req.params.id);

    if (!participation) {
      return res.status(404).json({ success: false, message: 'Participation not found' });
    }
    if (participation.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'This participation has already been reviewed' });
    }

    participation.status = 'APPROVED';
    participation.points = points || 0;
    participation.approvedBy = req.user.id;
    await participation.save();

    // award XP to the employee
    await User.findByIdAndUpdate(participation.employee, { $inc: { xpPoints: participation.points } });

    res.status(200).json({ success: true, participation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PATCH /api/csr-activities/participation/:id/reject   (Manager/Admin)
const rejectParticipation = async (req, res) => {
  try {
    const participation = await EmployeeParticipation.findById(req.params.id);
    if (!participation) {
      return res.status(404).json({ success: false, message: 'Participation not found' });
    }
    if (participation.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'This participation has already been reviewed' });
    }

    participation.status = 'REJECTED';
    participation.approvedBy = req.user.id;
    await participation.save();

    res.status(200).json({ success: true, participation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { joinActivity, getPendingParticipations, approveParticipation, rejectParticipation };
