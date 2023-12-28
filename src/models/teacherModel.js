// models/Teacher.js
// models/Teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  }],
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  }],
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
