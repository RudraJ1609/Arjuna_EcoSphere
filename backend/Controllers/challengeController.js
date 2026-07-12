const Challenge = require('../Models/Challenge');

const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.status(200).json({ success: true, challenges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createChallenge = async (req, res) => {
  try {
    const { title, xp, difficulty, deadline } = req.body;
    if (!title || !xp || !deadline) {
      return res.status(400).json({ success: false, message: 'Title, xp, and deadline are required' });
    }
    const challenge = await Challenge.create({ title, xp, difficulty, deadline });
    res.status(201).json({ success: true, challenge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    res.status(200).json({ success: true, challenge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    res.status(200).json({ success: true, message: 'Challenge deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getChallenges, createChallenge, updateChallenge, deleteChallenge };