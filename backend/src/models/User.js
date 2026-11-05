const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ism kiritilishi shart'],
      unique: true,
      trim: true,
      minlength: [3, 'Ism kamida 3 ta belgidan iborat bo\'lishi kerak'],
    },
    password: {
      type: String,
      required: [true, 'Parol kiritilishi shart'],
      minlength: [6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'],
    },
    language: {
      type: String,
      enum: ['uz', 'ru', 'en'],
      default: 'uz',
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);

