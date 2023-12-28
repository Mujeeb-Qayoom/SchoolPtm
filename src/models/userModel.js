
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,

  },
  role: {
    type: String,
    enum: ['parent', 'teacher', 'children', 'admin'],
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});


const User = mongoose.model('User', userSchema);

module.exports = User;

