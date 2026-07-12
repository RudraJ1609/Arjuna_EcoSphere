const Department = require('../Models/Department');

// @route  GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('parent', 'name code');
    res.status(200).json({ success: true, departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/departments   (Admin only)
const createDepartment = async (req, res) => {
  try {
    const { name, code, head, parent } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }
    const department = await Department.create({ name, code, head, parent: parent || null });
    res.status(201).json({ success: true, department });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PATCH /api/departments/:id   (Admin only)
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, department });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  DELETE /api/departments/:id   (Admin only)
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };
