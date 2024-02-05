// models/TimeSlot.js
const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'freezed', 'upcomming', 'lunch'],
    default: 'available',
  },
  isActive: {
    type: Boolean,
    default: true,

  },
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
    ref: 'Ptm'
  },
  joinUrl: {
    type: String,
  },
  meetingId: {
    type: String,
  },
  startUrl: {
    type: String,
  }

});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;
