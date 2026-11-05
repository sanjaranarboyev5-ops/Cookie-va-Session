const mongoose = require('mongoose');
const Student = require('../models/Student');

// @desc    O'quvchilar ro'yxatini olish (qidiruv va filtr bilan)
// @route   GET /api/students
exports.getStudents = async (req, res) => {
  try {
    const { search, status, course, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { createdBy: req.session.userId };

    // Qidiruv (ism, telefon, email yoki kurs bo'yicha)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { course: searchRegex },
      ];
    }

    // Holat bo'yicha filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Kurs bo'yicha filter
    if (course && course !== 'all') {
      query.course = course;
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const students = await Student.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error('getStudents xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'O\'quvchilarni yuklashda xatolik',
      error: error.message,
    });
  }
};

// @desc    O'quvchilar statistikasini olish
// @route   GET /api/students/stats
exports.getStudentStats = async (req, res) => {
  try {
    const userId = req.session.userId;

    const total = await Student.countDocuments({ createdBy: userId });
    const active = await Student.countDocuments({ createdBy: userId, status: 'active' });
    const inactive = await Student.countDocuments({ createdBy: userId, status: 'inactive' });
    const graduated = await Student.countDocuments({ createdBy: userId, status: 'graduated' });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // O'rtacha baho
    const avgGradeResult = await Student.aggregate([
      { $match: { createdBy: userObjectId } },
      { $group: { _id: null, avgGrade: { $avg: '$grade' } } },
    ]);
    const avgGrade = avgGradeResult.length > 0 ? Math.round(avgGradeResult[0].avgGrade * 10) / 10 : 0;

    // Kurslar bo'yicha taqsimot
    const courseStats = await Student.aggregate([
      { $match: { createdBy: userObjectId } },
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        active,
        inactive,
        graduated,
        avgGrade,
        courseStats,
      },
    });
  } catch (error) {
    console.error('getStudentStats xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Statistikani yuklashda xatolik',
      error: error.message,
    });
  }
};

// @desc    O'quvchi qo'shish
// @route   POST /api/students
exports.createStudent = async (req, res) => {
  try {
    const { name, email, phone, course, status, grade } = req.body;

    if (!name || !course) {
      return res.status(400).json({
        success: false,
        message: 'O\'quvchi ismi va kursini kiritish majburiy',
      });
    }

    const student = await Student.create({
      name: name.trim(),
      email: email ? email.trim() : '',
      phone: phone ? phone.trim() : '',
      course,
      status: status || 'active',
      grade: grade !== undefined ? Number(grade) : 85,
      createdBy: req.session.userId,
    });

    res.status(201).json({
      success: true,
      message: 'O\'quvchi muvaffaqiyatli qo\'shildi',
      data: student,
    });
  } catch (error) {
    console.error('createStudent xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'O\'quvchini qo\'shishda xatolik',
      error: error.message,
    });
  }
};

// @desc    O'quvchini tahrirlash
// @route   PUT /api/students/:id
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, course, status, grade } = req.body;

    let student = await Student.findOne({ _id: id, createdBy: req.session.userId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi yoki sizga tegishli emas',
      });
    }

    student.name = name ? name.trim() : student.name;
    if (email !== undefined) student.email = email.trim();
    if (phone !== undefined) student.phone = phone.trim();
    if (course) student.course = course;
    if (status) student.status = status;
    if (grade !== undefined) student.grade = Number(grade);

    await student.save();

    res.status(200).json({
      success: true,
      message: 'O\'quvchi ma\'lumotlari yangilandi',
      data: student,
    });
  } catch (error) {
    console.error('updateStudent xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'O\'quvchini yangilashda xatolik',
      error: error.message,
    });
  }
};

// @desc    O'quvchini o'chirish
// @route   DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOneAndDelete({ _id: id, createdBy: req.session.userId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'O\'quvchi topilmadi yoki sizga tegishli emas',
      });
    }

    res.status(200).json({
      success: true,
      message: 'O\'quvchi muvaffaqiyatli o\'chirildi',
    });
  } catch (error) {
    console.error('deleteStudent xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'O\'quvchini o\'chirishda xatolik',
      error: error.message,
    });
  }
};
