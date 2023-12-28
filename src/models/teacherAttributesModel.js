// models/TeacherAttributeModel.js
const mongoose = require('mongoose');

const teacherAttributeModelSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  ptm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ptm',
  },
});

const TeacherAttributeModel = mongoose.model('TeacherAttributeModel', teacherAttributeModelSchema);

module.exports = TeacherAttributeModel;
