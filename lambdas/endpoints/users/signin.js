const { Responses } = require('../../commons/api_responses');
const { Dynamo } = require('../../../resources/Dynamo');
const { signinSchemaValidator } = require('../../schema-validators/signin.validator');
const { hashValidate } = require('../../commons/bcryptjs');
const { generateToken } = require('../../commons/jwt');

const tableName = process.env.userTableName;

module.exports.handler = async (event) => {
    console.log('event', event);
    let data = JSON.parse(event.body);
    try {
        signinSchemaValidator(data);
        const result = await Dynamo.getAllByProperty('Username', data.Username, tableName).catch(error => {
            console.log('error', error);
            return null;
        })
        if(!result || result.length == 0) {
            return Responses._400({
                error: 'Invalid username'
            });
        }
        if(!hashValidate(data.Password, result[0].Password)) {
            return Responses._400({
                error: 'Invalid password'
            });
        }
        const resultObj = {
            ID: result[0].ID,
            Name: result[0].Name,
            Username: result[0].Username,
            UserType: result[0].UserType
        };
        const token = generateToken(resultObj);
        return Responses._200({
            result: {
                data: resultObj,
                token: token
            }
        });
    } catch(error) {
        return Responses._400({
            error: error
        });
    }
}