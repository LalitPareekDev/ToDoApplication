const { Responses } = require('../../commons/api_responses');
const { Dynamo } = require('../../../resources/Dynamo');
const { verifyToken } = require('../../commons/jwt');

const tableName = process.env.taskTableName;

module.exports.handler = async (event) => {
    console.log('event', event);
    try {
        let payload = verifyToken(event);
        if(payload.UserType == 'TEAM_MEMBER') {
            return Responses._400({
                message: 'Team member unauthorized for creating the task'
            });
        }
        if(!event.pathParameters || !event.pathParameters.taskId) {
            // return error id is missing
            return Responses._400({
                message: 'Task ID is missing from the path'
            });
        }
        let ID = event.pathParameters.taskId;
        const result = await Dynamo.remove(ID, tableName).catch(error => {
            console.log('error', error);
            return null;
        })
        if(!result) {
            return Responses._400({
                message: 'no data found for the given ID'
            });
        }
        return Responses._200({
            message: 'Task deleted'
        });
    } catch(error) {
        return Responses._400({
            error: error
        });
    }
}
