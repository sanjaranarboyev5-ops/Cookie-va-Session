const User = require('../models/User');

// @desc    Foydalanuvchi sozlamalarini yangilash (Til va Rang)
// @route   PUT /api/user/preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { language, theme } = req.body;
    const userId = req.session.userId;

    const updateData = {};
    if (language && ['uz', 'ru', 'en'].includes(language)) {
      updateData.language = language;
    }
    if (theme && ['light', 'dark'].includes(theme)) {
      updateData.theme = theme;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Sozlamalar saqlandi',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        language: updatedUser.language,
        theme: updatedUser.theme,
      },
    });
  } catch (error) {
    console.error('Update preferences xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Sozlamalarni yangilashda xatolik',
      error: error.message,
    });
  }
};

