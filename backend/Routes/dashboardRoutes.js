const express = require('express');
const router = express.Router();
const { getDashboard } = require('../Controllers/dashboardController');
const { protect } = require('../Middleware/authMiddleware');

router.get('/', protect, getDashboard);

module.exports = router;
