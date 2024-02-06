const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  parentId: {
    type: String,
    required: false,
  },
  childrenId: {
    type: String,
    required: false,
  },
  timeSlots: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true,
  }],
  ptm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ptm',
    required: true,
  },
  meetingType: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  }

});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;