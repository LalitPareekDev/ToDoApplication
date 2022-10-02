const { Responses } = require('../../commons/api_responses');
const { Dynamo } = require('../../../resources/Dynamo');
const { signupSchemaValidator } = require('../../schema-validators/signup.validator');
const { encrypt } = require('../../commons/bcryptjs');

const tableName = process.env.userTableName;

module.exports.handler = async (event) => {
    console.log('event', event);
    let ID = new Date().getTime().toString();
    let data = JSON.parse(event.body);
    try {
        signupSchemaValidator(data);
        data.ID = ID;
        data.Password = encrypt(data.Password);
        data.DateCreated = new Date().getTime();
        const result = await Dynamo.save(data, tableName).catch(error => {
            console.log('error', error);
            return null;
        })
        if(!result) {
            return Responses._400({
                error: 'User not registered'
            });
        }
        return Responses._200({
            message: 'User has been registered',
            result
        });
    } catch(error) {
        return Responses._400({
            error: error
        });
    }
}