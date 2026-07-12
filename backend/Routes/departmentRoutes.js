const express = require('express');
const router = express.Router();
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../Controllers/departmentController');
const { protect } = require('../Middleware/authMiddleware');
const { authorizeRoles } = require('../Middleware/roleMiddleware');

router.get('/', protect, getDepartments);
router.post('/', protect, authorizeRoles('ADMIN'), createDepartment);
router.patch('/:id', protect, authorizeRoles('ADMIN'), updateDepartment);
router.delete('/:id', protect, authorizeRoles('ADMIN'), deleteDepartment);

module.exports = router;
