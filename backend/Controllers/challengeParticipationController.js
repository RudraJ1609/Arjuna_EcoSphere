const ChallengeParticipation = require('../Models/ChallengeParticipation');
const Challenge = require('../Models/Challenge');
const User = require('../Models/User');

const joinChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const employeeId = req.user.id;

    const existing = await ChallengeParticipation.findOne({ employee: employeeId, challenge: challengeId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already joined this challenge' });
    }

    const participation = await ChallengeParticipation.create({
      employee: employeeId,
      challenge: challengeId,
    });

    res.status(201).json({ success: true, participation });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Already joined this challenge' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const completeChallenge = async (req, res) => {
  try {
    const participation = await ChallengeParticipation.findById(req.params.id).populate('challenge');
    if (!participation) {
      return res.status(404).json({ success: false, message: 'Participation not found' });
    }
    if (participation.completed) {
      return res.status(400).json({ success: false, message: 'Already marked complete' });
    }

    participation.completed = true;
    await participation.save();

    await User.findByIdAndUpdate(participation.employee, { $inc: { xpPoints: participation.challenge.xp } });

    res.status(200).json({ success: true, participation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select('name xpPoints department role')
      .populate('department', 'name')
      .sort({ xpPoints: -1 })
      .limit(20);
    res.status(200).json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { joinChallenge, completeChallenge, getLeaderboard };