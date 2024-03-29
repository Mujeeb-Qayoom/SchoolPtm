// models/Parent.js
const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Children',
  }],

  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },



});

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
