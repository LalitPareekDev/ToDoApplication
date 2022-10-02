const { Responses } = require('../../commons/api_responses');
const { Dynamo } = require('../../../resources/Dynamo');
const { TaskStatus } = require('../../commons/config');
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
        if(!event.pathParameters.taskId) {
            return Responses._400({
                message: 'Task ID is missing from the path'
            });
        }
        let ID = event.pathParameters.taskId;
        const taskResult = await Dynamo.get(ID, tableName).catch(error => {
            console.log('error', error);
            return null;
        })
        if(taskResult && taskResult.Status && taskResult.Status == 'Closed') {
            return Responses._400({
                message: `This task:${ID} is already Closed`
            });
        }
        let data = {
            Status: TaskStatus.CLOSED,
            DateClosed: new Date().getTime()
        };
        const result = await Dynamo.update(ID, data, tableName).catch(error => {
            console.log('error', error);
            return null;
        })
        if(!result) {
            return Responses._400({
                message: 'Task not updated to closed'
            });
        }
        return Responses._200({
            message: 'Task updated to closed'
        });
    } catch(error) {
        return Responses._400({
            error: error
        });
    }
}
