const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Ro'yxatdan o'tish (Register)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, password, language, theme } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Ism va parol kiritilishi shart',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
      });
    }

    // Foydalanuvchi allaqachon mavjudligini tekshirish
    const existingUser = await User.findOne({ name: name.trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bunday ismli foydalanuvchi allaqachon mavjud',
      });
    }

    // Parolni hash qilish
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yangi foydalanuvchini saqlash (Har bir foydalanuvchiga alohida _id beriladi)
    const newUser = await User.create({
      name: name.trim(),
      password: hashedPassword,
      language: language || 'uz',
      theme: theme || 'light',
    });

    // Ro'yxatdan o'tgandan so'ng avtomatik Session yaratish
    req.session.userId = newUser._id;
    req.session.userName = newUser.name;
    req.session.createdAt = new Date();

    res.status(201).json({
      success: true,
      message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!',
      user: {
        id: newUser._id,
        name: newUser.name,
        language: newUser.language,
        theme: newUser.theme,
      },
      session: {
        id: req.sessionID,
        cookieName: 'connect.sid',
        httpOnly: true,
        sameSite: 'lax',
      },
    });
  } catch (error) {
    console.error('Register xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message,
    });
  }
};

// @desc    Tizimga kirish (Login)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Ism va parolni kiriting',
      });
    }

    // Foydalanuvchini bazadan qidirish
    const user = await User.findOne({ name: name.trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Bunday foydalanuvchi topilmadi',
      });
    }

    // Parolni solishtirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Noto\'g\'ri parol kiritildi! Ruxsat berilmaydi.',
      });
    }

    // Session yaratish va req.session.userId saqlash
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.createdAt = new Date();

    res.status(200).json({
      success: true,
      message: 'Tizimga muvaffaqiyatli kirdingiz!',
      user: {
        id: user._id,
        name: user.name,
        language: user.language,
        theme: user.theme,
      },
      session: {
        id: req.sessionID,
        cookieName: 'connect.sid',
        httpOnly: true,
        sameSite: 'lax',
      },
    });
  } catch (error) {
    console.error('Login xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message,
    });
  }
};

// @desc    Joriy foydalanuvchi ma'lumotlari (Me)
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        isAuthenticated: false,
        message: 'Autentifikatsiyadan o\'tilmagan',
      });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        isAuthenticated: false,
        message: 'Foydalanuvchi topilmadi',
      });
    }

    // Cookie va Session holati ma'lumotlari
    const cookie = req.session.cookie || {};
    const maxAge = cookie.maxAge || 0;
    const expires = cookie.expires ? new Date(cookie.expires) : null;

    res.status(200).json({
      success: true,
      isAuthenticated: true,
      user: {
        id: user._id,
        name: user.name,
        language: user.language,
        theme: user.theme,
        createdAt: user.createdAt,
      },
      session: {
        id: req.sessionID,
        cookieName: 'connect.sid',
        httpOnly: cookie.httpOnly !== undefined ? cookie.httpOnly : true,
        sameSite: cookie.sameSite || 'lax',
        secure: cookie.secure || false,
        maxAge: maxAge,
        expires: expires,
        sessionCreatedAt: req.session.createdAt || null,
        active: true,
      },
    });
  } catch (error) {
    console.error('getMe xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message,
    });
  }
};

// @desc    Session holatini to'liq tekshirish (Inspect Session)
// @route   GET /api/auth/session-status
exports.getSessionStatus = async (req, res) => {
  try {
    const isAuth = !!(req.session && req.session.userId);
    const cookie = req.session ? req.session.cookie : null;

    res.status(200).json({
      success: true,
      isAuthenticated: isAuth,
      serverTime: new Date().toISOString(),
      session: {
        sessionId: req.sessionID,
        userId: req.session ? req.session.userId : null,
        userName: req.session ? req.session.userName : null,
        createdAt: req.session ? req.session.createdAt : null,
        cookieName: 'connect.sid',
        rawCookieReceived: req.cookies ? req.cookies['connect.sid'] : null,
        cookieConfig: {
          httpOnly: cookie ? cookie.httpOnly : true,
          sameSite: cookie ? cookie.sameSite : 'lax',
          secure: cookie ? cookie.secure : false,
          originalMaxAge: cookie ? cookie.originalMaxAge : null,
          maxAge: cookie ? cookie.maxAge : null,
          expires: cookie ? cookie.expires : null,
        },
        status: isAuth ? 'FAOL (ACTIVE)' : 'NOFAOL (INACTIVE)',
      },
    });
  } catch (error) {
    console.error('Session status xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message,
    });
  }
};

// @desc    Tizimdan chiqish (Logout)
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
  try {
    // Session'ni MongoDB'dan va xotiradan yo'q qilish
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy xatolik:', err);
        return res.status(500).json({
          success: false,
          message: 'Chiqishda xatolik yuz berdi',
        });
      }

      // connect.sid cookie'sini brauzerdan tozalash
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });

      return res.status(200).json({
        success: true,
        message: 'Tizimdan muvaffaqiyatli chiqildi. Session va Cookie o\'chirildi.',
      });
    });
  } catch (error) {
    console.error('Logout xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message,
    });
  }
};

