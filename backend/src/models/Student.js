const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'O\'quvchi ismi kiritilishi shart'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    course: {
      type: String,
      required: [true, 'Kurs nomi kiritilishi shart'],
      trim: true,
      enum: ['Frontend React', 'Backend Node.js', 'Fullstack JavaScript', 'Mobile Flutter', 'Python & AI', 'UI/UX Dizayn'],
      default: 'Fullstack JavaScript',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated'],
      default: 'active',
    },
    grade: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Qidiruv uchun index qo'shamiz
studentSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('Student', studentSchema);

