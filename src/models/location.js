// models/Location.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locationName: {
    type: String, // <-- Added 'type: String'
    required: true,
  },
  floor: {
    type: String,
    enum: ['ground', 'first', 'second', 'third', 'forth'],
    default: 'ground',
  },
  buildingName: {
    type: String, // <-- Corrected 'string' to 'String'
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
