const express = require('express');
const router = express.Router();
const {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} = require('../Controllers/csrActivityController');
const {
  joinActivity,
  getPendingParticipations,
  approveParticipation,
  rejectParticipation,
} = require('../Controllers/employeeParticipationController');
const { protect } = require('../Middleware/authMiddleware');
const { authorizeRoles } = require('../Middleware/roleMiddleware');

// activities
router.get('/', protect, getActivities);
router.post('/', protect, authorizeRoles('ADMIN'), createActivity);
router.patch('/:id', protect, authorizeRoles('ADMIN'), updateActivity);
router.delete('/:id', protect, authorizeRoles('ADMIN'), deleteActivity);

// participation
router.post('/:activityId/join', protect, joinActivity);
router.get('/participation/pending', protect, authorizeRoles('ADMIN', 'MANAGER'), getPendingParticipations);
router.patch('/participation/:id/approve', protect, authorizeRoles('ADMIN', 'MANAGER'), approveParticipation);
router.patch('/participation/:id/reject', protect, authorizeRoles('ADMIN', 'MANAGER'), rejectParticipation);

module.exports = router;
