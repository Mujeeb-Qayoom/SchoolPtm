// models/Student.js
const mongoose = require('mongoose');

const childernSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },

});

const Childern = mongoose.model('Children', childernSchema);

module.exports = Childern;
