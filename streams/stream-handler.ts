export const handler = async (event: any) => {
    console.log("DynamoDB Stream Event:", JSON.stringify(event, null, 2));
};


