import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

export const handler = async (event: any) => {

    const dynamo = new DynamoDBClient({ region: 'us-east-1' });
    const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });

    const userId = event.queryStringParameters?.userId || 'user-1';

    const response = await dynamo.send(new QueryCommand({
    TableName: "TrainingTableOne",
    KeyConditionExpression: 'id = :u',
    ExpressionAttributeValues: {
    ':u': { S: "0.gkloekhm388" },
    },
    }));

    const history = response.Items?.map(item => item.id).join('\n') || 'No history';

    const prompt = `Summarize this entry:\n${history}`;

    const bedrockRes = await bedrock.send(new InvokeModelCommand({
    modelId: 'anthropic.claude-v2:1',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
    prompt,
    max_tokens_to_sample: 300,
    temperature: 0.7,
    }),
    }));

    const output = JSON.parse(Buffer.from(bedrockRes.body).toString('utf-8'));

    return {
    statusCode: 200,
    body: JSON.stringify({ summary: output.completion }),
    };
    



};
