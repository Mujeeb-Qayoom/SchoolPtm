// models/PTM.js
const mongoose = require('mongoose');

const ptmSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  teacherAttributes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeacherAttributes'
  }],

  duration: {
    type: Number,
    enum: [15, 20, 30],
    required: true
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  lunchStartTime: {
    type: Date,
    required: true
  },
  lunchEndTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Ptm = mongoose.model('Ptm', ptmSchema);

module.exports = Ptm;
