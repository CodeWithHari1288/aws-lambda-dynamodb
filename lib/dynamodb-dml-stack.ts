
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import { aws_lambda, Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { S3EventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import path = require("path");

export class DynamoDbDmlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    
       // Lambda Function to read from Stream
       const lambdaS3= new aws_lambda.Function(this,"DynamoDbDmlLambda" , {
        runtime : aws_lambda.Runtime.NODEJS_20_X,
        code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../dynamodbdml')),
        handler : 'dynamodb_dml_handle.handler',
        allowPublicSubnet: true,
        timeout : Duration.seconds(10)
      }
    );
       
      const dynamoDBTable = new Table(this, "DynamoDbDML", {
        tableName: "TrainingDynamoDml",
        partitionKey: {
          name: "id",
          type: AttributeType.STRING
        },
    
      });

      dynamoDBTable.grantReadWriteData(lambdaS3)
    
  }
}
