// models/Subject.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
