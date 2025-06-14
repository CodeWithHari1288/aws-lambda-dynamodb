import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Event, S3EventRecord } from "aws-lambda";

export const handler = async (event: S3Event) => {

    const client = new DynamoDBClient({region:"us-east-1"});
    const docClient = DynamoDBDocumentClient.from(client);
    console.log("Event Received in : "+JSON.stringify(event)); 
    const result = JSON.parse(JSON.stringify(event));
    let bucketName;
    let keyName;
    let sizeOfObject;

    for (const record of event.Records) {
        bucketName = record.s3.bucket.name;
        keyName = record.s3?.object?.key;
        sizeOfObject = record.s3?.object?.size;
    }
    
    console.log("Event Values : " + bucketName + keyName+ sizeOfObject);
 
   await docClient.send(new PutCommand({
     TableName: 'TrainingTableOne',
     Item: {
       id: Math.random().toString(32),
       action: "Added a new folder in S3",
       userName: "UserId"+Math.random().toString(32),
       bucket: bucketName,
       key: keyName,
       size: sizeOfObject
     },
   })).then(data=>{
     console.log("Success : "+data)
   }).catch(e=>{
     console.log("Exception : " + e)
   });

}