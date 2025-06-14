import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import path = require("path");
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Runtime, Code, Function } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";


export class DynamodbGenAiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaGenAi = new Function(this, "lambdaGenAi" ,{
        runtime: Runtime.NODEJS_20_X,
        handler: 'dynamodb-gen-handler.handler',
        code: Code.fromAsset(path.join(__dirname, '../dynamodbgenai')),
        timeout: cdk.Duration.seconds(30),
        environment: {
            TABLE_NAME: "TrainingTableOne",
        },
    });

   const table =  Table.fromTableArn(this, 'ImportedTable', cdk.Fn.importValue('TrainingTableOneArn'));


    lambdaGenAi.addToRolePolicy(new PolicyStatement({
            actions: ['bedrock:InvokeModel'],
            resources: ['*'],
            effect: Effect.ALLOW
            }));

    lambdaGenAi.addToRolePolicy(new PolicyStatement({
    actions: ['dynamodb:Query'],
    resources: ['*'],
                }));

        const api = new RestApi(this, 'GenRestApi', {
        restApiName: 'GenAI with DynamoDB',
        deployOptions: { stageName: 'dev' },
        });

    api.root.addResource('dynamobedrock').addMethod('GET', new LambdaIntegration(lambdaGenAi));

}
}