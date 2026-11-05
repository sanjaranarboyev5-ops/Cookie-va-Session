const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

router.put('/preferences', requireAuth, userController.updatePreferences);

module.exports = router;

