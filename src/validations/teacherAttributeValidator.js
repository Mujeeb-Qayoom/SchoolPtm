const Joi = require('joi');

const teacherAttributeModelValidation = Joi.object({
    location: Joi.string().hex().length(24).required(),
    teacher: Joi.string().hex().length(24).required(),
    appointment: Joi.string().hex().length(24).required(),
    ptm: Joi.string().hex().length(24).required(),
});

module.exports = teacherAttributeModelValidation;
