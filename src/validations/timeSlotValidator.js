const Joi = require('joi');

const timeSlotValidation = Joi.object({
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    status: Joi.string().valid('available', 'booked', 'freezed').default('available'),
    isActive: Joi.boolean().default(true),
    location: Joi.string().hex().length(24).required(),
    teacher: Joi.string().hex().length(24).required(),
    appointment: Joi.string().hex().length(24).required(),
});

module.exports = timeSlotValidation;
