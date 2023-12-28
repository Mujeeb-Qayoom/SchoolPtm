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

  timeSlots: [{                                     /// array of time skots id's
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true,
  }],
  ptm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ptm',
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  }

});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;