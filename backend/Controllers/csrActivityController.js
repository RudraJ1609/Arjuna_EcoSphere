const CSRActivity = require('../Models/CSRActivity');

// @route  GET /api/csr-activities
const getActivities = async (req, res) => {
  try {
    const activities = await CSRActivity.find();
    res.status(200).json({ success: true, activities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/csr-activities   (Admin only)
const createActivity = async (req, res) => {
  try {
    const { title, description, evidenceRequired } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const activity = await CSRActivity.create({ title, description, evidenceRequired });
    res.status(201).json({ success: true, activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PATCH /api/csr-activities/:id   (Admin only)
const updateActivity = async (req, res) => {
  try {
    const activity = await CSRActivity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.status(200).json({ success: true, activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  DELETE /api/csr-activities/:id   (Admin only)
const deleteActivity = async (req, res) => {
  try {
    const activity = await CSRActivity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.status(200).json({ success: true, message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getActivities, createActivity, updateActivity, deleteActivity };
