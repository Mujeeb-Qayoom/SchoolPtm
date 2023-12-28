const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
    }],
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    }],
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;