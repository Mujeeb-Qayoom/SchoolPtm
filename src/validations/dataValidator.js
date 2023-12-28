const Joi = require('joi');

const validateData = (data, schema, res) => {
    const { error, value } = schema.validate(data);

    if (error) {
        // Instead of sending a response, throw an error
        throw new Error(error.details[0].message);
    }

    return value;
};

module.exports = { validateData };
