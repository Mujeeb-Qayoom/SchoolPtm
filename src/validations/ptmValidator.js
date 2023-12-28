const Joi = require('joi');

const ptmValidation = Joi.object({
    date: Joi.date().required(),
    duration: Joi.number().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    lunchStartTime: Joi.date().required(),
    lunchEndTime: Joi.date().required(),
})

module.exports = ptmValidation;
