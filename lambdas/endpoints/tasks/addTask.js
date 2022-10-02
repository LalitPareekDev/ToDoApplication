const { Responses } = require('../../commons/api_responses');
const { Dynamo } = require('../../../resources/Dynamo');
const { addTaskSchemaValidator } = require('../../schema-validators/add-task.validator');
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
        let ID = new Date().getTime().toString();
        let data = JSON.parse(event.body);
        addTaskSchemaValidator(data);
        data.ID = ID;
        data.DateCreated = new Date().getTime();
        data.Status = TaskStatus.DRAFT;
        data.CreatedBy = payload.Username;

        const result = await Dynamo.save(data, tableName).catch(error => {
            console.log('error', error);
            return null;
        })
        if(!result) {
            return Responses._400({
                message: 'Task not created'
            });
        }
        return Responses._200({
            result
        });
    } catch(error) {
        return Responses._400({
            error: error
        });
    }
}
