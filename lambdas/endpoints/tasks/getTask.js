const { Responses } = require('../../commons/api_responses');
const { Dynamo } = require('../../../resources/Dynamo');
const { convertTaskDates } = require('../../commons/convert_tasks_date');
const { verifyToken } = require('../../commons/jwt');

const tableName = process.env.taskTableName;

module.exports.handler = async (event) => {
    console.log('event', event);
    try {
        let payload = verifyToken(event);
        if(!event.pathParameters || !event.pathParameters.taskId) {
            return Responses._400({
                message: 'Task ID is missing from the path'
            });
        }
        let ID = event.pathParameters.taskId;
        const result = await Dynamo.get(ID, tableName).catch(error => {
            console.log('error', error);
            return null;
        })
        if(!result) {
            return Responses._400({
                message: 'no data found for the given ID'
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
