const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Avtorizatsiyadan o\'tilmagan. Iltimos, tizimga kiring.',
        code: 'UNAUTHORIZED',
      });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      // Agar session mavjud bo'lsa-yu, user bazadan o'chirilgan bo'lsa
      req.session.destroy();
      res.clearCookie('connect.sid');
      return res.status(401).json({
        success: false,
        message: 'Foydalanuvchi topilmadi. Qaytadan kiring.',
        code: 'USER_NOT_FOUND',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message,
    });
  }
};

module.exports = { requireAuth };

