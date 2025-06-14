import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Event, S3EventRecord } from "aws-lambda";

export const handler = async (event: any) => {

    const client = new DynamoDBClient({region:"us-east-1"});
    const docClient = DynamoDBDocumentClient.from(client);
    console.log("Event Received in : "+JSON.stringify(event)); 
    
 
   await docClient.send(new PutCommand({
     TableName: 'TrainingDynamoDml',
     Item: {
       id: "1",
       action: "Inserting Event",
       userName: "UserId"+Math.random().toString(32)
     },
   })).then(data=>{
     console.log("Success : "+data)
   }).catch(e=>{
     console.log("Exception : " + e)
   });

   const params = {
        TableName: 'TrainingDynamoDml',
        KeyConditionExpression: 'id = :idVal',
        ExpressionAttributeValues: {
            ':idVal': '1'
        },
        };

        let response ;
        try {
              response= await docClient.send(new QueryCommand(params));
            }
            catch (e) {
            console.error(e);
            }

              
    console.log("response : " + JSON.stringify(response));

}