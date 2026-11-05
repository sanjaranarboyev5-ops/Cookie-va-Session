const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { requireAuth } = require('../middleware/authMiddleware');

// Barcha student routerlari autentifikatsiya talab qiladi
router.use(requireAuth);

router.get('/', studentController.getStudents);
router.get('/stats', studentController.getStudentStats);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;

