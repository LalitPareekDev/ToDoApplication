const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const getAllByProperty = async (queryKey, queryValue, TableName) => {
    const params = {
        TableName,
        FilterExpression:  `${queryKey} = :queryValue`,
        ExpressionAttributeValues: {
            ':queryValue': queryValue
        }
    }

    const result = await documentClient.scan(params).promise();
    return result.Items || [];
}

const get = async (ID, TableName) => {
    const params = {
        TableName,
        Key: {
            ID
        }
    }

    const result = await documentClient.get(params).promise();

    if(!result || !result.Item) {
        new Error(`There was an error for fetching the data for ${KeyName} of ${KeyValue} from ${TableName}`);
    }

    console.log(result);

    return result.Item;
}

const save = async (data, TableName) => {

    if(!data || !data.ID) {
        new Error('ID is missing');
    }
    const params = {
        TableName,
        Item: data
    }
    const result = await documentClient.put(params).promise();
    if(!result) {
        new Error(`There was an error for adding the data for ID of ${data.ID} from ${TableName}`);
    }
    console.log(result);
    return data;
}

const update = async (ID, data, TableName) => {
    if(!ID) {
        new Error('ID is missing');
    }
    const objKeys = Object.keys(data);
    const params = {
        TableName: TableName,
        Key: { ID },
        UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
        ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
            ...acc,
            [`#key${index}`]: key,
        }), {}),
        ExpressionAttributeValues: objKeys.reduce((acc, key, index) => ({
            ...acc,
            [`:value${index}`]: data[key],
        }), {}),
    };
    const result = await documentClient.update(params).promise();
    if(!result) {
        new Error(`There was an error for updating the data for ID of ${ID} from ${TableName}`);
    }
    console.log(result);
    return data;
}

const remove = async (ID, TableName) => {
    if(!ID) {
        new Error('ID is missing');
    }
    const params = {
        TableName,
        Key: {
            ID
        }
    }
    const result = await documentClient.delete(params).promise();
    if(!result) {
        new Error(`There was an error for removing the task for ID of ${ID} from ${TableName}`);
    }

    console.log(result);

    return result;
}

const Dynamo = { getAllByProperty, get, save, update, remove };

module.exports = { Dynamo };