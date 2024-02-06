const Joi = require('joi');

const appointmentValidation = Joi.object({
    parentId: Joi.string().optional(),
    childernId: Joi.string().optional(),
    ptm: Joi.string().hex().length(24).required(),
    isActive: Joi.boolean().required(),
    meetingType: Joi.string().optional(),
});

module.exports = appointmentValidation;
