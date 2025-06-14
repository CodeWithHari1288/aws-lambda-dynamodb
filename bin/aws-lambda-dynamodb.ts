#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsLambdaDynamodbStack } from '../lib/aws-lambda-dynamodb-stack';
import { DynamodbStream } from '../lib/dynamodb-stream';
import { DynamodbGenAiStack } from '../lib/dynamodb-genai-stack';
import { S3DualStack } from '../lib/s3-dualstack';
import { DynamodbGlobal } from '../lib/dynamodb-global';
import { DynamoDbDmlStack } from '../lib/dynamodb-dml-stack';

const app = new cdk.App();
new AwsLambdaDynamodbStack(app, 'AwsLambdaDynamodbStack', {
  
  env: {  account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1'
},
});

new DynamodbStream(app, 'DynamodbStream', {
  
  env: {  account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1'
},
});

new DynamodbGenAiStack(app, 'DynamoDbGenAI', {
  
  env: {  account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1'
},
});

// new DynamodbGlobal(app, 'DynamodbGlobal', {
  
//   env: {  account: process.env.CDK_DEFAULT_ACCOUNT,
//     region: 'us-east-1'
// },
// });


new DynamoDbDmlStack(app, 'DynamoDbDmlStack', {
  
  env: {  account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1'
},
});