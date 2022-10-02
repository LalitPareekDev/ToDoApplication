const { Responses } = require('../../commons/api_responses');
const { Dynamo } = require('../../../resources/Dynamo');
const { convertTaskDates } = require('../../commons/convert_tasks_date');
const { verifyToken } = require('../../commons/jwt');

const tableName = process.env.taskTableName;

module.exports.handler = async (event) => {
    console.log('event', event);
    try {
        let payload = verifyToken(event);
        if(!event.pathParameters || !event.pathParameters.memberId) {
            return Responses._400({
                message: 'Member ID is missing from the path'
            });
        }
        let memberId = event.pathParameters.memberId;
        const result = await Dynamo.getAllByProperty('AssignedTo', memberId, tableName).catch(error => {
            console.log('error', error);
            return null;
        })
        if(!result) {
            return Responses._400({
                message: 'no data found',
                result: result
            });
        }
        return Responses._200({
            result: convertTaskDates(result)
        });   
    } catch(error) {
        return Responses._400({
            error: error
        });
    }
}
