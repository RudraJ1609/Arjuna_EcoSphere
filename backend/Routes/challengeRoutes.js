const express = require('express');
const router = express.Router();
const {
  getChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} = require('../Controllers/challengeController');
const {
  joinChallenge,
  completeChallenge,
  getLeaderboard,
} = require('../Controllers/challengeParticipationController');
const { protect } = require('../Middleware/authMiddleware');
const { authorizeRoles } = require('../Middleware/roleMiddleware');

router.get('/', protect, getChallenges);
router.post('/', protect, authorizeRoles('ADMIN'), createChallenge);
router.patch('/:id', protect, authorizeRoles('ADMIN'), updateChallenge);
router.delete('/:id', protect, authorizeRoles('ADMIN'), deleteChallenge);

router.post('/:challengeId/join', protect, joinChallenge);
router.patch('/participation/:id/complete', protect, authorizeRoles('ADMIN', 'MANAGER'), completeChallenge);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;