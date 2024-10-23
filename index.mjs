import {DynamoDBClient, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import bcrypt from 'bcryptjs';

const region = process.env.AWS_REGION;

const DYNAMO_TABLE_NAME = process.env.DYNAMO_TABLE_NAME;

const dynamoDbClient = new DynamoDBClient({region});

export const handler = async (event) => {
    try {
        let user = event.requestContext.authorizer;

        const {currentPassword, password} = JSON.parse(event.body);
        if (!currentPassword || !password) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({message: 'All fields are required'}),
            };
        }

        if (!bcrypt.compareSync(currentPassword, user.password)) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({errors: [{field: "currentPassword", message: "Incorrect password."}]}),
            };
        }

        const updateParams = {
            TableName: DYNAMO_TABLE_NAME,
            Key: {
                id: {S: user.id}
            },
            UpdateExpression: 'SET #n = :password',
            ExpressionAttributeNames: {
                '#n': 'password'
            },
            ExpressionAttributeValues: {
                ':password': {S: bcrypt.hashSync(password, 10)},
            },
            ReturnValues: 'ALL_NEW'
        };

        const data = await dynamoDbClient.send(new UpdateItemCommand(updateParams));
        console.log(data)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                errors: []
            }),
        };
    } catch (err) {
        console.error('Error updating user password:', err);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                message: 'Failed to update user password'
            }),
        };
    }
};
