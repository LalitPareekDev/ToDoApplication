const Joi = require('joi');

const signupSchemaValidator = (data) => {
    try {
        let schema = Joi.object().keys({
            Name: Joi.string().required().min(3).max(30).pattern(new RegExp('^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$')),
            UserType: Joi.string().required().valid('TEAM_LEAD', 'TEAM_MEMBER'),
            Username: Joi.string().required().min(3).max(30).pattern(new RegExp('^[a-zA-Z_]*$')),
            Password: Joi.string().required().min(3).max(30).pattern(new RegExp('^[a-zA-Z0-9]*$'))
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

module.exports = { signupSchemaValidator }