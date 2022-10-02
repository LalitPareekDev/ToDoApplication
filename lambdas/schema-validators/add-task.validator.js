const Joi = require('joi');

const addTaskSchemaValidator = (data) => {
    try {
        let schema = Joi.object().keys({
            Title: Joi.string()
                      .required()
                      .min(3)
                      .max(30)
                      .pattern(new RegExp('^[a-zA-Z0-9#_]*$')),
            Description: Joi.string().required()
        });
        let { error } = schema.validate(data);
        const valid = error == null;
        if(!valid) {
            throw(error.details.map(messages => messages.message));
        }
        return true;
    } catch(error) {
        throw(error);
    }
}

module.exports = { addTaskSchemaValidator };