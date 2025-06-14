import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';


export class DynamodbGlobal extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

const globalTable = new Table(this, "Table", {
    tableName: "TrainingGlobalTable1",
    partitionKey: { name: "id", type: AttributeType.STRING },
    replicationRegions: ['us-east-2'],
    
  });

}
}