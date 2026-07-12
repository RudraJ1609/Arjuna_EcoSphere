const express = require('express');
const router = express.Router();
const { registerUser, loginUser, createAccountByAdmin, getMe } = require('../Controllers/authController');
const { protect } = require('../Middleware/authMiddleware');
const { authorizeRoles } = require('../Middleware/roleMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.post('/create-account', protect, authorizeRoles('ADMIN'), createAccountByAdmin);

module.exports = router;