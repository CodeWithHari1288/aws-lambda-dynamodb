import * as cdk from 'aws-cdk-lib';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsLambdaDynamodbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
       // Lambda Function to read from Stream
       const lambdaS3= new cdk.aws_lambda.Function(this,"S3DynamoDBHandler" , {
        runtime : cdk.aws_lambda.Runtime.NODEJS_20_X,
        code :  cdk.aws_lambda.Code.fromAsset(path.join(__dirname,'/../dynamodb')),
        handler : 'dynamodb_handle.handler',
        allowPublicSubnet: true,
        timeout : cdk.Duration.seconds(10)
      }
    );
  
  
        //Change this if desired
        const BUCKET_NAME = 's3-bucket-dynamodb'
  
        // S3 bucket
        const bucket = new Bucket(this, BUCKET_NAME, {
          bucketName: "aws-lambda-dynamodb-stack",
          autoDeleteObjects: true,
          removalPolicy: cdk.RemovalPolicy.DESTROY
        });
      
      // Event Source Mapping S3 -> Lambda
      const s3PutEventSource = new S3EventSource(bucket, {
        events: [
          EventType.OBJECT_CREATED_PUT
        ]
      });
   
      lambdaS3.addEventSource(s3PutEventSource);  
  
  
      
      const dynamoDBTable = new Table(this, "TrainingDynamoDB", {
        tableName: "TrainingTableOne",
        partitionKey: {
          name: "id",
          type: AttributeType.STRING
        }
      });

      new cdk.CfnOutput(this, "DynamodbTableArn", {
      value: dynamoDBTable.tableArn,
      exportName: "TrainingTableOneArn",
    });
  
      lambdaS3.addToRolePolicy(
             new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['dynamodb:PutItem'],
              resources: [
                dynamoDBTable.tableArn,
                ],
              }),
           );
  }
}
