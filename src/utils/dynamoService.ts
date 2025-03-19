import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const dynamodbClient = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const storeCommandInDynamoDB = async (command: string) => {
  const commandId = new Date().toISOString();
  const putParams = {
    TableName: "TerminalCommands",
    Item: {
      commandId: { S: commandId },
      command: { S: command },
      timestamp: { S: new Date().toISOString() },
    },
  };

  const putCommand = new PutItemCommand(putParams);
  await dynamodbClient.send(putCommand);
};

export const getStoredCommands = async () => {
  const scanParams = { TableName: "TerminalCommands" };
  const scanCommand = new ScanCommand(scanParams);
  return await dynamodbClient.send(scanCommand);
};

