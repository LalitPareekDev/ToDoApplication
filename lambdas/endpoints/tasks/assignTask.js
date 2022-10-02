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
        if(!event.pathParameters || !event.pathParameters.memberId) {
            return Responses._400({
                message: 'Member ID is missing from the path'
            });
        }
        let ID = event.pathParameters.taskId;
        let memberId = event.pathParameters.memberId;
        const taskResult = await Dynamo.get(ID, tableName).catch(error => {
            console.log('error', error);
            return null;
        })
        if(taskResult && taskResult.Status && taskResult.Status == 'Closed') {
            return Responses._400({
                message: `Closed task:${ID} cannot be change`
            });
        }
        let data = {
            AssignedTo: memberId,
            Status: TaskStatus.ASSIGNED,
            DateAssigned: new Date().getTime()
        };
        const result = await Dynamo.update(ID, data, tableName).catch(error => {
            console.log('error', error);
            return null;
        })
        if(!result) {
            return Responses._400({
                message: 'Task not assigned'
            });
        }
        return Responses._200({
            message: `Task assigned to member ${memberId}`,
            result
        });
    } catch(error) {
        return Responses._400({
            error: error
        });
    }
}
