const Joi = require('joi');

const updateTaskSchemaValidator = (data) => {
    
    try {
        let schema = Joi.object().keys({
            Title: Joi.string()
                      .min(3)
                      .max(30)
                      .pattern(new RegExp('^[a-zA-Z0-9#_]*$')),
            Description: Joi.string()
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

module.exports = { updateTaskSchemaValidator };