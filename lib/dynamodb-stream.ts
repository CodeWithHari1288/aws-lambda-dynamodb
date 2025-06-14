import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as eventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import path = require('path');

export class DynamodbStream extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // DynamoDB table with streams enabled
    const table = new dynamodb.Table(this, 'streamtable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES, // Choose stream view type
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName : "StreamTable",
    });

    // Lambda function triggered by DynamoDB stream
    const streamHandler = new lambda.Function(this, 'StreamHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'stream-handler.handler',
      code:  cdk.aws_lambda.Code.fromAsset(path.join(__dirname,'/../streams')),
    });

    // Attach DynamoDB stream as event source
    streamHandler.addEventSource(new eventSources.DynamoEventSource(table, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      batchSize: 5,
      retryAttempts: 2,
    }));

    // Grant the Lambda permission to read from the stream
    table.grantStreamRead(streamHandler);
  }
}
